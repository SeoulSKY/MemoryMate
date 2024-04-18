import {beforeAll, beforeEach, describe, expect, it} from "@jest/globals";
import {spyOn} from "jest-mock";

import {MockStorage} from "../index";

import Quiz, {Difficulty, MultipleChoiceQuestion} from "../../src/utils/quiz";
import Chat, {Message} from "../../src/utils/chat";
import {BotProfile, Gender, Participant, ProfileData, UserProfile} from "../../src/utils/profile";
import {InvalidStateError} from "../../src/utils/error";
import {FunctionCall, GenerativeModel} from "@google/generative-ai";

const mockProfileData: ProfileData = {
  image: undefined,
  name: "test",
  age: 20,
  gender: Gender.MALE,
};

const mockChatHistory: Message[] = [
  {
    text: "test",
    author: Participant.BOT,
    images: [],
    timestamp: new Date(),
  },
  {
    text: "test",
    author: Participant.USER,
    images: [],
    timestamp: new Date(),
  }
];

describe("MultipleChoiceQuestion", () => {
  let question: MultipleChoiceQuestion;

  beforeEach(() => {
    question = new MultipleChoiceQuestion("What is 1 + 1?", Difficulty.EASY, ["1", "2", "3", "4"], 1);
  });

  describe("getQuestion", () => {
    it("should get the question", () => {
      expect(question.getQuestion()).toEqual("What is 1 + 1?");
    });
  });

  describe("getDifficulty", () => {
    it("should get the difficulty", () => {
      expect(question.getDifficulty()).toEqual(Difficulty.EASY);
    });
  });

  describe("isAnswered", () => {
    it("should return false if the question is not answered", () => {
      expect(question.isAnswered()).toBe(false);
    });

    it("should return true if the question is answered", () => {
      // @ts-expect-error for testing purposes
      question.answer = 1;
      expect(question.isAnswered()).toBe(true);
    });
  });

  describe("getAnswer", () => {
    it("should get the answered value", () => {
      // @ts-expect-error for testing purposes
      question.answer = 1;
      expect(question.getAnswer()).toEqual(1);
    });

    it("should throw InvalidStateError if the question is not answered", () => {
      expect(() => question.getAnswer()).toThrowError(InvalidStateError);
    });
  });

  describe("setAnswer", () => {
    it("should set the answer", () => {
      question.setAnswer(1);
      expect(question.isAnswered()).toBe(true);
      expect(question.getAnswer()).toEqual(1);
    });

    it("should throw InvalidStateError if the question is already answered", () => {
      question.setAnswer(1);
      expect(() => question.setAnswer(1)).toThrowError(InvalidStateError);
    });
  });

  describe("isCorrect", () => {
    it("should return true if the answer is correct", () => {
      question.setAnswer(1);
      expect(question.isCorrect()).toBe(true);
    });

    it("should return false if the answer is incorrect", () => {
      question.setAnswer(2);
      expect(question.isCorrect()).toBe(false);
    });

    it("should throw InvalidStateError if the question is not answered", () => {
      expect(() => question.isCorrect()).toThrowError(InvalidStateError);
    });
  });

  describe("toJSON", () => {
    it("should convert the question to JSON", () => {
      question.setAnswer(1);
      expect(question.toJSON()).toEqual({
        question: "What is 1 + 1?",
        difficulty: Difficulty.EASY,
        correctAnswer: 1,
        choices: ["1", "2", "3", "4"],
        isCorrect: true,
      });
    });
  });
});

describe("Quiz", () => {
  let mockQuiz: MultipleChoiceQuestion[];

  const quiz = Quiz.getInstance(MockStorage);
  const path = Quiz["path"];
  let storage: MockStorage<string, string>;
  let chat: Chat;

  beforeAll(async () => {
    await BotProfile.getInstance(MockStorage).create(mockProfileData);
    await UserProfile.getInstance(MockStorage).create(mockProfileData);

    chat = await Chat.getInstance(MockStorage);
  });

  beforeEach(() => {
    storage = new MockStorage();
    quiz["storage"] = storage;

    mockQuiz = [
      new MultipleChoiceQuestion("What is 1 + 1?", Difficulty.EASY, ["1", "2", "3", "4"], 1),
      new MultipleChoiceQuestion("What is 2 + 2?", Difficulty.NORMAL, ["1", "2", "3", "4"], 3),
    ];
  });

  describe("hasSavedQuiz", () => {
    it("should return true if there is a previous quiz", async () => {
      await storage.set(path, JSON.stringify(mockQuiz.map(q => q.toJSON())));

      expect(await quiz.hasSavedQuiz()).toBe(true);
    });

    it("should return false if there is no previous quiz", async () => {
      expect(await quiz.hasSavedQuiz()).toBe(false);
    });
  });

  describe("getSavedQuiz", () => {
    it("should get the previous quiz", async () => {
      await storage.set(path, JSON.stringify(mockQuiz.map(q => q.toJSON())));

      expect(await quiz.getSavedQuiz()).toEqual(mockQuiz.map(q => q.toJSON()));
    });

    it("should throw InvalidStateError if there is no previous quiz", async () => {
      await expect(quiz.getSavedQuiz()).rejects.toThrow(InvalidStateError);
    });
  });

  describe("save", () => {
    it("should save the quiz", async () => {
      // @ts-expect-error for testing purposes
      await quiz.save(mockQuiz);

      expect(await storage.get(path)).toEqual(JSON.stringify(mockQuiz.map(q => q.toJSON())));
    });
  });

  describe("evaluate", () => {
    it("should evaluate the dementia level", async () => {
      // @ts-expect-error for testing purposes
      await chat.save(mockChatHistory);

      spyOn(GenerativeModel.prototype, "generateContent").mockResolvedValue({
        response: {
          text: () => "test",
          functionCall: function (): FunctionCall | undefined {
            throw new Error("Function not implemented.");
          },
          functionCalls: function (): FunctionCall[] | undefined {
            throw new Error("Function not implemented.");
          }
        },
      });

      // @ts-expect-error for testing purposes
      expect(await quiz.evaluate(mockChatHistory)).toEqual("test");
    });
  });

  describe("create", () => {
    it("should create and save the questions", async () => {
      // @ts-expect-error for testing purposes
      await chat.save(mockChatHistory);

      // @ts-expect-error for testing purposes
      spyOn(quiz, "evaluate").mockResolvedValue("test");

      spyOn(GenerativeModel.prototype, "generateContent").mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockQuiz),
          functionCall: function (): FunctionCall | undefined {
            throw new Error("Function not implemented.");
          },
          functionCalls: function (): FunctionCall[] | undefined {
            throw new Error("Function not implemented.");
          }
        },
      });

      expect(await quiz.create()).toEqual(mockQuiz);
    });
  });
});
