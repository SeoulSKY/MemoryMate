import {genAI, parseStatusCode} from "./index";

import {Storage, FileStorage} from "./storage";
import {ChatSession, Content} from "@google/generative-ai";
import {Participant, ProfileData, BotProfile, UserProfile} from "./profile";
import {HttpError, InvalidArgumentError, InvalidStateError} from "./errors";
import Image, {ImageData} from "./image";

const model = genAI.getGenerativeModel({model: "gemini-pro"});
const visionModel = genAI.getGenerativeModel({model: "gemini-pro-vision"});

export interface Message {
  readonly author: Participant;
  readonly text: string;
  readonly images: ImageData[];
  readonly timestamp: Date;
}

/**
 * Get the instruction for the chatbot
 * @param bot The bot profile data
 * @param user The user profile data
 */
function getInstruction(bot: ProfileData, user: ProfileData): Content {
  return {role: "user", parts: [{text:
  `You are a chatbot for people with various dementia levels. The current patient's name is ${user.name}, 
  gender is ${user.gender.toString()} and ${user.age} years old. Your goal is to retrieve as much information 
  and their events as possible that will be used to personalize a set of questions and answers for their brain exercise 
  (It's not your task though). Set your personality with a name ${bot.name}, a gender ${bot.gender.toString()} and an 
  age ${bot.age}. Try to hide your actual intention and act as if you want to talk with them rather than retrieve 
  information. Do not include your expression in the message. Start your message with greeting`}]};
}

export default class Chat {

  private static instance: Chat;

  private static readonly historyPath = "chatHistory.json";

  public storage: Storage<string, string>;

  // @ts-expect-error it will be assigned in getInstance()
  private session: ChatSession;

  private constructor(storageType: new () => Storage<string, string>) {
    this.storage = new storageType();
  }

  /**
   * Get the chat instance
   * @param storageType The storage type
   * @returns The chat instance
   * @throws {InvalidStateError} If either bot or user profile does not exist
   * @throws {HttpError} If failed to send the message
   */
  public static async getInstance(storageType: new () => Storage<string, string> = FileStorage): Promise<Chat> {
    if (this.instance !== undefined) {
      return this.instance;
    }

    if (!await BotProfile.getInstance().has()) {
      throw new InvalidStateError("Bot profile does not exist");
    }

    if (!await UserProfile.getInstance().has()) {
      throw new InvalidStateError("User profile does not exist");
    }

    this.instance = new Chat(storageType);

    if (await this.instance.hasHistory()) {
      const history = [
        getInstruction(await BotProfile.getInstance().get(), await UserProfile.getInstance().get()),
      ];

      for (const message of await this.instance.getHistory()) {
        history.push({role: message.author === Participant.USER ? "user" : "model", parts: [{text: message.text}]});
      }

      this.instance.session = model.startChat({history: history});
    } else {
      this.instance.session = model.startChat();

      const bot = await BotProfile.getInstance().get();
      const user = await UserProfile.getInstance().get();
      const response = await this.instance.send(getInstruction(bot, user).parts[0].text!);
      await this.instance.save([{author: Participant.BOT, text: response, images: [], timestamp: new Date()}]);
    }

    return this.instance;
  }

  /**
   * Send a message to the chatbot
   * @param message The message to send
   * @param images The images to send
   * @returns The response from the chatbot
   * @throws {InvalidArgumentError} If the message is empty
   * @throws {HttpError} If failed to send the message
   */
  public async sendMessage(message: string, images: ImageData[] = []): Promise<Message> {
    if (message.trim() === "") {
      throw new InvalidArgumentError("Message cannot be empty");
    }

    const timestamp = new Date();

    images = await Promise.all(images.map(image => Image.getInstance().saveFromGallery(image)));

    const prompt = message + "\n" +
      (images.length > 0 ? "Images sent: " + await this.getImageDescriptions(images) + "\n" : "") +
      "Time sent: " + timestamp.toISOString();
    const response = await this.send(prompt);

    const history = await this.hasHistory() ? await this.getHistory() : [];
    history.push({author: Participant.USER, text: message, images, timestamp});
    history.push({author: Participant.BOT, text: response, images: [], timestamp: new Date()});
    await this.save(history);

    return history.pop()!;
  }

  /**
   * Send a message to the chatbot
   * @param text The message to send
   * @returns The response from the chatbot
   * @throws {HttpError} If failed to send the message
   */
  private async send(text: string): Promise<string> {
    try {
      return (await this.session.sendMessage(text)).response.text();
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpError(e.message, parseStatusCode(e));
      }
      throw e;
    }
  }

  /**
   * Check if the chat history exists
   * @returns true if the chat history exists, false otherwise
   */
  public async hasHistory(): Promise<boolean> {
    return this.storage.has(Chat.historyPath);
  }

  /**
   * Get the chat history
   * @returns The chat history
   * @throws {InvalidArgumentError} If the chat history does not exist
   */
  public async getHistory(): Promise<Message[]> {
    if (!await this.hasHistory()) {
      throw new InvalidStateError("Chat history does not exist");
    }

    return JSON.parse(await this.storage.get(Chat.historyPath), (key, value) => {
      if (key === "timestamp") {
        return new Date(value);
      }

      return value;
    });
  }

  /**
   * Delete the chat history
   * @throws {InvalidStateError} If the chat history does not exist
   */
  public async deleteHistory(): Promise<void> {
    if (!await this.hasHistory()) {
      throw new InvalidStateError("Chat history does not exist");
    }

    return this.getHistory().then(history =>
      history.flatMap(message => message.images)
        .map(image => image.path)
        .filter(path => Image.getInstance().has(path as string))
        .forEach(path => Image.getInstance().delete(path as string))
    ).then(() => this.storage.delete(Chat.historyPath))
      .then(() => [BotProfile.getInstance().get(), UserProfile.getInstance().get()])
      .then(async profiles => {
        const [bot, user] = await Promise.all(profiles);
        this.session = model.startChat({history: [getInstruction(bot, user)]});
      });
  }

  /**
   * Analyze the images and get the descriptions
   * @param images The images to analyze
   * @return The descriptions of the images
   * @throws {InvalidArgumentError} If no images are given
   * @throws {HttpError} If failed to analyze the images
   */
  private async getImageDescriptions(images: ImageData[]): Promise<string> {
    if (images.length === 0) {
      throw new InvalidArgumentError("No images are given");
    }

    const imgs = await Promise.all(images.map(async image => {
      return {
        inlineData: {
          data: await Image.getInstance().load(image),
          mimeType: image.mimeType,
        }
      };
    }));

    try {
      return (await visionModel.generateContent(["Describe these images", ...imgs])).response.text();
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpError(e.message, parseStatusCode(e));
      }
      throw e;
    }
  }

  /**
   * Save the chat history
   * @param history The chat history
   * @throws {InvalidArgumentError} If the chat history is empty
   */
  private async save(history: Message[]): Promise<void> {
    if (history.length === 0) {
      throw new InvalidArgumentError("Chat history cannot be empty");
    }

    return this.storage.set(Chat.historyPath, JSON.stringify(history, (_, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }

      return value;
    }));
  }
}
