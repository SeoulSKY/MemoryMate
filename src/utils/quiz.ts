import {FileStorage, Storage} from "./storage";
import {HttpError, InvalidStateError} from "./errors";
import {genAI, HttpStatusCode, parseStatusCode} from "./index";
import Chat, {Message} from "./chat";
import {UserProfile} from "./profile";

const model = genAI.getGenerativeModel({model: "gemini-pro"});


export enum Difficulty {
  EASY,
  NORMAL,
  HARD,
}

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
      }),
      evaluation: this.evaluate(chatHistory),
    };

    const request = `${JSON.stringify(data)}\nFrom the chat history between the patient and a chatbot and the 
    evaluation of the patient's dementia level above, create personalized multiple-choice questions for a memory game 
    from the patient's facts or events extracted by the chat history with the proper mixture of difficulties while 
    considering their dementia level. The entire output must be formatted as a minified JSON, containing a list of 
    ${Quiz.numQuestions} questions with ${Quiz.numChoices} choices, its difficulty level between 1 and 
    ${Object.keys(Difficulty).length / 2} and an index to the correct choice. The object keys must be question, 
    difficulty, choices and correctAnswer. Do not create questions and choices in the third person point of view. 
    The chatbot is asking the question and the patient is making a choice. 
    Do not start your output with \`\`\`json and start with an open square bracket.`;

    let response: string;
    try {
      response = (await model.generateContent(request)).response.text();
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpError(e.message, parseStatusCode(e));
      }
      throw e;
    }

    // sometimes, the response is wrapped with ```json ```, a markdown syntax
    response = response.replace(/^```json\s*```$/i, "");

    interface Response {
      question: string,
      difficulty: Difficulty,
      choices: string[],
      correctAnswer: number,
    }

    let json: Response[];
    try {
      json = JSON.parse(response);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(Array.isArray(json) && json.every((item: any) =>
        typeof item.question === "string" &&
        typeof item.difficulty === "number" &&
        Array.isArray(item.choices) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        item.choices.every((choice: any) => typeof choice === "string") &&
        typeof item.correctAnswer === "number"
      ))) {
        // noinspection ExceptionCaughtLocallyJS
        throw new TypeError("Parsed JSON does not conform to the Response[] interface");
      }
    } catch (e) {
      if (e instanceof SyntaxError || e instanceof TypeError) {
        throw new HttpError("Failed to parse the response into json: " + response, HttpStatusCode.BAD_REQUEST);
      }
      throw e;
    }

    const quiz = json.map(q =>
      new MultipleChoiceQuestion(q.question, q.difficulty, q.choices, q.correctAnswer)
    );

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

    const request = `${JSON.stringify(data)}\nFrom the chat history between the patient and a chatbot and the 
    result of the previous quiz, try your best to evaluate their dementia level, considering their cognitive abilities, 
    and behavioural and psychological symptoms. The patient's age is ${profile.age} and gender is 
    ${profile.gender.toString()}. Only explain your evaluations and do not suggest any recommendations or things to 
    consider`;

    try {
      return (await model.generateContent(request)).response.text();
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpError(e.message, parseStatusCode(e));
      }
      throw e;
    }
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

    return JSON.parse(await this.storage.get(Quiz.path));
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
}
