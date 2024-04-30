import {FileStorage, Storage} from "./storage";
import {HttpError, InvalidArgumentError, InvalidStateError} from "./errors";
import {genAI, HttpStatusCode} from "./index";
import Chat, {Message} from "./chat";
import {Participant, UserProfile} from "./profile";
import {rootLogger} from "../index";
import {GoogleGenerativeAIResponseError} from "@google/generative-ai";

const model = genAI.getGenerativeModel({model: "gemini-pro"});

const logger = rootLogger.extend("Quiz");

export enum Difficulty {
  EASY,
  NORMAL,
  HARD,
}

const numDifficulties = 3;

export abstract class Question<Q, A> {
  protected readonly question: Q;
  protected readonly difficulty: Difficulty;
  protected readonly correctAnswer: A;

  protected answer: A | undefined;

  protected constructor(question: Q, difficulty: Difficulty, correctAnswer: A) {
    this.question = question;
    this.difficulty = difficulty;
    this.correctAnswer = correctAnswer;
  }

  /**
   * Get the question
   * @returns The question
   */
  public getQuestion(): Q {
    return this.question;
  }

  /**
   * Get the difficulty
   * @returns The difficulty
   */
  public getDifficulty(): Difficulty {
    return this.difficulty;
  }

  /**
   * Check if the question is answered
   * @returns true if the question is answered, false otherwise
   */
  public isAnswered(): boolean {
    return this.answer !== undefined;
  }

  /**
   * Get the answered value of the question
   * @returns The answered value
   * @throws {InvalidStateError} If the question is not answered
   */
  public getAnswer(): A {
    if (!this.isAnswered()) {
      throw new InvalidStateError("Question is not answered");
    }

    return this.answer!;
  }

  /**
   * Set the answer of the question
   * @param answer The answer
   * @returns This question for method chaining
   * @throws {InvalidStateError} If the question is already answered
   */
  public setAnswer(answer: A): this {
    if (this.isAnswered()) {
      throw new InvalidStateError("Question is already answered");
    }

    this.answer = answer;
    return this;
  }

  /**
   * Check if the answer is correct
   * @returns true if the answer is correct, false otherwise
   * @throws {InvalidStateError} If the question is not answered
   */
  public isCorrect(): boolean {
    if (!this.isAnswered()) {
      throw new InvalidStateError("Question is not answered");
    }
    return this.answer === this.correctAnswer;
  }

  /**
   * Convert the question to JSON
   * @returns The JSON representation of the question
   */
  public toJSON(): object {
    return {
      question: this.question,
      difficulty: this.difficulty,
      correctAnswer: this.correctAnswer,
      answer: this.isAnswered() ? this.answer : undefined,
      isCorrect: this.isAnswered() ? this.isCorrect() : undefined,
    };
  }
}

export class MultipleChoiceQuestion extends Question<string, number> {

  private readonly choices: string[];

  public constructor(question: string, difficulty: Difficulty, choices: string[], correctChoice: number) {
    super(question, difficulty, correctChoice);

    this.choices = choices;
  }

  /**
   * Set the answer of the question
   * @param choice The answer
   * @throws {InvalidStateError} If the answer choice is invalid
   */
  public setAnswer(choice: number) {
    if (!Number.isInteger(choice) || choice < 0 || choice >= this.choices.length) {
      throw new InvalidStateError("Invalid answer choice: " + choice);
    }

    return super.setAnswer(choice);
  }

  /**
   * Get the possible choices of the question
   * @returns The possible choices
   */
  public getChoices(): string[] {
    return this.choices;
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      choices: this.choices,
    };
  }
}

export default class Quiz {
  private static instance: Quiz;

  private static readonly path = "quiz.json";
  private static readonly numQuestions = 10;
  private static readonly numChoices = 4;

  private storage: Storage<string, string>;

  private constructor(storageType: new () => Storage<string, string>) {
    this.storage = new storageType();
  }

  public static getInstance(storageType: new () => Storage<string, string> = FileStorage): Quiz {
    if (Quiz.instance !== undefined) {
      return Quiz.instance;
    }

    Quiz.instance = new Quiz(storageType);

    return Quiz.instance;
  }

  /**
   * Create a quiz and save it to the storage
   * @returns The quiz
   * @throws {InvalidStateError} If no chat history is found
   * @throws {HttpError} If failed to generate the quiz from the model
   */
  public async create(): Promise<MultipleChoiceQuestion[]> {
    const chatHistory = await (await Chat.getInstance()).getHistory();

    const data = {
      chatHistory: chatHistory.map(message => {
        return {author: message.author, text: message.text};
      }).slice(0, -2), // remove the last chat history
      evaluation: this.evaluate(chatHistory),
    };

    const exampleQuestion = {
      question: "What was the name of the flower you like to grow?",
      difficulty: Difficulty.NORMAL,
      correctAnswer: 0,
      choices: ["Tiger lily", "Rose", "Daisy", "Sunflower"],
    }

    const request = JSON.stringify(data) + "\n" +
      "From the chat history between the patient (" + Participant.USER + ") and a consultant (" + Participant.BOT +
      "), create multiple-choice questions for the patient's cognitive exercise from the chat history with " +
      "the proper mixture of difficulties tailored to their dementia level. The questions must be designed to " +
      "stimulate various cognitive functions, ensuring the patient receives targeted and effective cognitive " +
      "stimulation. Do not create questions that can't be answered without guessing. Any ordinary person should be " +
      "able to answer them while reading the chat history. There must be no questions asking the consultant's name. " +
      "The entire output must be formatted as a minified JSON without any additional white spaces, with an array of " +
      Quiz.numQuestions + " questions with exactly " + Quiz.numChoices +
      " choices, its difficulty level between 1 and " + numDifficulties + " and an index to the correct choice. " +
      "Questions must be in past tense and formatted as if the consultant is asking the patient and " +
      "the patient is making a choice. For example, the following is a valid format of a question object: " +
      JSON.stringify(exampleQuestion) + ". Start your output with an open square bracket"

    logger.debug(`Sending request to Gemini: ${request}`);

    let response: string;
    try {
      response = (await model.generateContent(request)).response.text();
    } catch (e) {
      if (e instanceof GoogleGenerativeAIResponseError) {
        throw new HttpError(e.message, e.response.status);
      }
      throw e;
    }

    logger.debug(`Received response from Gemini: ${response}`);

    // sometimes, the response is wrapped with ```json (string)```,
    response = response.replace(/^```json\s*```$/i, "");

    let json;
    try {
      json = JSON.parse(response);
    } catch (e) {
      throw new HttpError("Failed to parse the response into json: " + response, HttpStatusCode.BAD_REQUEST);
    }

    if (!Quiz.isValid(json)) {
      throw new HttpError("Invalid JSON: " + response, HttpStatusCode.BAD_REQUEST);
    }

    const quiz = Quiz.parse(json);
    await this.save(quiz);
    return quiz;
  }

  /**
   * Evaluate the dementia level of the patient
   * @returns The evaluation
   * @throws {HttpError} If failed to generate the evaluation from the model
   */
  private async evaluate(chatHistory: Message[]): Promise<string> {
    const data = {
      chatHistory: chatHistory.map(message => {
        return {author: message.author, text: message.text};
      }),
      previousQuiz: await this.hasSavedQuiz() ? await this.getSavedQuiz() : [],
    };

    const profile = await UserProfile.getInstance().get();
    const request = JSON.stringify(data) + "\n" +
      "From the chat history between the patient and a consultant and the result of the previous quiz, " +
      "try your best to evaluate their dementia level, considering their cognitive abilities, and behavioural and " +
      "psychological symptoms. The patient's age is " + profile.age + "and gender is " +
      profile.gender + ". Your output should consist of paragraphs";

    logger.debug(`Sending request to Gemini: ${request}`);

    let response;
    try {
      response = (await model.generateContent(request)).response.text();
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
   * Check if a saved quiz exists
   * @returns true if a quiz exists, false otherwise
   */
  public async hasSavedQuiz(): Promise<boolean> {
    return this.storage.has(Quiz.path);
  }

  /**
   * Get the saved quiz
   * @returns The quiz
   * @throws {InvalidStateError} If no quiz is found
   */
  public async getSavedQuiz(): Promise<MultipleChoiceQuestion[]> {
    if (!await this.hasSavedQuiz()) {
      throw new InvalidStateError("No saved quiz found");
    }

    return Quiz.parse(JSON.parse(await this.storage.get(Quiz.path)));
  }

  /**
   * Save the quiz
   * @param quiz The quiz
   */
  public async save(quiz: MultipleChoiceQuestion[]): Promise<void> {
    return this.storage.set(Quiz.path, JSON.stringify(quiz));
  }

  /**
   * Delete the saved quiz
   * @throws {InvalidStateError} If no quiz is found
   */
  public async delete(): Promise<void> {
    if (!await this.hasSavedQuiz()) {
      throw new InvalidStateError("No saved quiz found");
    }

    return this.storage.delete(Quiz.path);
  }

  private static isValid(json: object[]): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Array.isArray(json) && json.every((item: any) =>
      typeof item.question === "string" &&
      typeof item.difficulty === "number" &&
      Array.isArray(item.choices) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item.choices.every((choice: any) => typeof choice === "string") &&
      typeof item.correctAnswer === "number" && item.correctAnswer >= 0 && item.correctAnswer < item.choices.length &&
      (item.answer === undefined || typeof item.answer === "number") &&
      (item.isCorrect === undefined || typeof item.isCorrect === "boolean")
    );
  }

  /**
   * Parse the JSON into array of MultipleChoiceQuestion objects
   * @param json The JSON to parse
   * @returns The array of MultipleChoiceQuestion objects
   * @throws {InvalidArgumentError} If the JSON is invalid
   */
  private static parse(json: object[]): MultipleChoiceQuestion[] {
    if (!Quiz.isValid(json)) {
      throw new InvalidArgumentError("Invalid JSON:\n" + JSON.stringify(json, null, 2));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.map((item: any) => {
      const q = new MultipleChoiceQuestion(item.question, item.difficulty, item.choices, item.correctAnswer);
      if (item.answer !== undefined) {
        q.setAnswer(item.answer);
      }

      return q;
    });
  }
}
