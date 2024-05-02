import {FileStorage, Storage} from "./storage";
import {
  ChatSession,
  Content, GoogleGenerativeAIFetchError,
  GoogleGenerativeAIResponseError,
} from "@google/generative-ai";
import {BotProfile, Participant, ProfileData, UserProfile} from "./profile";
import {HttpError, InvalidArgumentError, InvalidStateError} from "./errors";
import Image, {ImageData} from "./image";
import {rootLogger} from "../index";
import {AppName} from "../constants";
import {HttpStatusCode, languageModel, visionModel} from "./index";


const logger = rootLogger.extend("Chat");

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
  `You are a professional consultant for people with various dementia levels. 
  You work for an app called ${AppName}. 
  It actively evaluates users' dementia levels through subtle cues and interactions, 
  creating tailored cognitive exercises. These exercises are designed to stimulate various cognitive functions, 
  ensuring that users receive targeted and effective cognitive stimulation.
  But do not assume you know about the app other than the information provided.
  The current patient's name is ${user.name}, gender is ${user.gender.toString()} and ${user.age} years old. 
  Your responsibility is to retrieve as much information and their events as possible that will be used for 
  tailored treatment later (It's not your task though). 
  Set your personality with a name ${bot.name}, a gender ${bot.gender.toString()} and an age ${bot.age}. 
  Act according to your personality. 
  Try to hide your actual intention and act as if you want to talk with them rather than retrieve information. 
  Do not include your expression or other information, such as time sent, in your message. 
  Your message must feel natural like chatting with a human`.replace("\n", "")
  }]};
}

function getGreeting(bot: ProfileData, user: ProfileData): Content {
  return {role: "model", parts: [{text:
        `Hello, ${user.name}! I'm ${bot.name} and ${bot.age} years old. I'm here to chat with you. How are you today?`
  }]};
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

    const bot = await BotProfile.getInstance().get();
    const user = await UserProfile.getInstance().get();

    const history = [getInstruction(bot, user)];

    if (await this.instance.hasHistory()) {
      for (const message of await this.instance.getHistory()) {
        history.push({role: message.author === Participant.USER ? "user" : "model", parts: [{text: message.text}]});
      }
    } else {
      const greeting = {
        author: Participant.BOT,
        text: getGreeting(bot, user).parts[0].text!,
        images: [],
        timestamp: new Date(),
      };
      history.push({role: "model", parts: [{text: greeting.text}]});
      await this.instance.save([greeting]);
    }

    this.instance.session = languageModel.startChat({history: history});

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

    const prompt = message + "\n" +
      (images.length > 0 ? "Images sent: " + await this.getImageDescriptions(images) + "\n" : "") +
      "Time sent: " + timestamp.toISOString();
    const response = await this.send(prompt);

    images = await Promise.all(images.map(image => Image.getInstance().saveFromGallery(image)));

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
    logger.debug(`Sending message to Gemini: ${text}`);

    let response;
    try {
      response = (await this.session.sendMessage(text)).response.text();
    } catch (e) {
      if (e instanceof GoogleGenerativeAIResponseError) {
        throw new HttpError(e.message, e.response.status);
      } else if (e instanceof GoogleGenerativeAIFetchError) {
        throw new HttpError(e.message, e.status ?? HttpStatusCode.INTERNAL_SERVER_ERROR);
      }
      throw e;
    }

    logger.debug(`Received response from Gemini: ${response}`);
    return response;
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
        .forEach(path => Image.getInstance().delete(path))
    ).then(async () => {
      await this.storage.delete(Chat.historyPath);
      const bot = await BotProfile.getInstance().get();
      const user = await UserProfile.getInstance().get();
      this.session = languageModel.startChat({
        history: [getInstruction(bot, user), getGreeting(bot, user)],
      });
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

    logger.debug(`Sending images to Gemini: ${images.map(image => image.path)}`);

    const imgs = await Promise.all(images.map(async image => {
      return {
        inlineData: {
          data: await Image.getInstance().load(image),
          mimeType: image.mimeType,
        }
      };
    }));

    let response;
    try {
      response = (await visionModel.generateContent(["Describe these images", ...imgs])).response.text();
    } catch (e) {
      if (e instanceof GoogleGenerativeAIResponseError) {
        throw new HttpError(e.message, e.response.status);
      }
      throw e;
    }

    logger.debug(`Received response from Gemini: ${response}`);
    return response;
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
