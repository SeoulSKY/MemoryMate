import {genAI} from "./index";

import {Storage, FileSystem} from "./storage";
import {ChatSession} from "@google/generative-ai";
import Profile, {ProfileData} from "./profile";
import {InvalidStateError} from "./error";

const model = genAI.getGenerativeModel({model: "gemini-pro"});
// const visionModel = genAI.getGenerativeModel({model: "gemini-pro-vision"})

const historyPath = "chatHistory.json";

enum Author {
  USER,
  BOT,
}

export interface ChatHistory {
  author: Author;
  message: string;
}

function getInstruction(profile: ProfileData): string {
  const gender = profile.gender.toString();
  return `You are a chatbot for people with various dementia levels. The current patient's name is ${profile.name}, 
  a ${gender.charAt(0) + gender.substring(1).toLowerCase()}, and ${profile.age} years old. Your goal is to retrieve as 
  much information and their events as possible that will be used to personalize a set of questions and answers for 
  their brain exercise (It's not your task though). Set your personality with a name, the same gender and a similar 
  age. Try to hide your actual intention and act as if you want to talk with them rather than retrieve information. Do 
  not include your expression in the message`;
}

export default class Chat {
  private readonly session: Promise<ChatSession>;
  private storage: Storage<string, string>;

  constructor() {
    this.session = this.init();
    this.storage = new FileSystem();
  }

  private async init(): Promise<ChatSession> {
    const profile = new Profile();
    if (!await profile.has()) {
      throw new InvalidStateError("Profile does not exist");
    }

    const history = (await this.getHistory())
      .map(history => {
        return {role: history.author === Author.USER ? "user" : "model", parts: [{text: history.message}]};
      });

    // Always include the instruction at the beginning of the history
    history.unshift({role: "model", parts: [{text: getInstruction(await profile.get())}]});

    return model.startChat({history: history});
  }

  /**
   * Send a message to the chatbot
   * @param message The message to send
   */
  public async sendMessage(message: string): Promise<string> {
    const session = await this.session;

    const response= (await session.sendMessage(message)).response.text();

    const history = await this.getHistory();
    history.push({author: Author.USER, message: message});
    history.push({author: Author.BOT, message: response});
    await this.save();

    return response;
  }

  /**
   * Check if the chat history exists
   * @returns true if the chat history exists, false otherwise
   */
  public async hasHistory(): Promise<boolean> {
    return this.storage.has(historyPath);
  }

  /**
   * Get the chat history
   * @returns The chat history
   * @throws {InvalidArgumentError} If the chat history does not exist
   */
  public async getHistory(): Promise<ChatHistory[]> {
    if (!await this.hasHistory()) {
      throw new InvalidStateError("Chat history does not exist");
    }

    return JSON.parse(await this.storage.get(historyPath));
  }

  /**
   * Delete the chat history
   * @throws {InvalidStateError} If the chat history does not exist
   */
  public async deleteHistory(): Promise<void> {
    if (!await this.hasHistory()) {
      throw new InvalidStateError("Chat history does not exist");
    }

    return this.storage.delete(historyPath);
  }

  private async save(): Promise<void> {
    return this.storage.set(historyPath, JSON.stringify(history));
  }
}
