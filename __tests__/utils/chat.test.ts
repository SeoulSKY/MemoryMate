import {beforeAll, beforeEach, describe, expect, it} from "@jest/globals";
import {spyOn} from "jest-mock";

import {MockStorage} from "../index";

import Chat, {Author, Message} from "../../src/utils/chat";
import {InvalidArgumentError, InvalidStateError} from "../../src/utils/error";
import Profile, {Gender} from "../../src/utils/profile";
import { FunctionCall } from "@google/generative-ai";

const mockChatHistory: Message[] = [
  {author: Author.USER, text: "request", timestamp: new Date("1970-01-01T00:00:00Z")},
  {author: Author.BOT, text: "response", timestamp: new Date("1970-01-01T00:00:01Z")},
];

const stringMockChatHistory = JSON.stringify(mockChatHistory, (key, value) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
});

describe("Chat", () => {
  const historyPath = Chat["historyPath"];
  let chat: Chat;
  let storage: MockStorage<string, string>;

  beforeAll(async () => {
    const profile = Profile.getInstance(MockStorage);
    profile["storage"] = new MockStorage<string, string>();
    await profile.create({name: "test", age: 20, gender: Gender.MALE});

    chat = await Chat.getInstance(MockStorage);

    storage = new MockStorage();
    chat["storage"] = storage;
  });

  beforeEach(async () => {
    if (await storage.has(historyPath)) {
      await storage.delete(historyPath);
    }
  });

  describe("sendMessage", () => {
    it("should throw InvalidArgumentError when the message is empty", async () => {
      const emptyMessages = ["", " ", "\n", "\t"];
      for (const message of emptyMessages) {
        await expect(chat.sendMessage(message)).rejects.toThrow(InvalidArgumentError);
      }
    });

    it("should save the message to the chat history", async () => {
      spyOn(chat["session"], "sendMessage")
        .mockResolvedValue({
          response: {
            text: () => "response",
            functionCalls: function (): FunctionCall[] | undefined {
              throw new Error("Function not implemented.");
            },
            functionCall: function (): FunctionCall | undefined {
              throw new Error("Function not implemented.");
            }
          }});

      for (let i = 0; i < 3; i++) {
        await chat.sendMessage("request");

        const history = await chat.getHistory();
        expect(history).toHaveLength((i + 1) * 2);

        for (let j = 0; j <= i; j++) {
          expect(history[j * 2]).toEqual({author: Author.USER, text: "request", timestamp: expect.any(Date)});
          expect(history[j * 2 + 1]).toEqual({author: Author.BOT, text: "response",
            timestamp: expect.any(Date)});
        }
      }
    });
  });

  describe("hasHistory", () => {
    it("should return false when the chat history does not exist", async () => {
      expect(await chat.hasHistory()).toBe(false);
    });

    it("should return true when the chat history exists", async () => {
      await storage.set(historyPath, stringMockChatHistory);
      expect(await chat.hasHistory()).toBe(true);
    });
  });

  describe("getHistory", () => {
    it("should get the chat history", async () => {
      await storage.set(historyPath, stringMockChatHistory);

      expect(await chat.getHistory()).toEqual(mockChatHistory);
    });

    it("should throw an error when the chat history does not exist", async () => {
      await expect(chat.getHistory()).rejects.toThrow(InvalidStateError);
    });
  });

  describe("deleteHistory", () => {
    it("should delete the chat history", async () => {
      await storage.set(historyPath, stringMockChatHistory);
      await chat.deleteHistory();

      expect(await storage.has(historyPath)).toBe(false);
    });

    it("should throw an error when the chat history does not exist", async () => {
      await expect(chat.deleteHistory()).rejects.toThrow(InvalidStateError);
    });
  });
});