import {FileStorage, Storage} from "./storage";
import {InvalidStateError} from "./error";
import {genAI} from "./index";
import Chat from "./chat";

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
   * @throws {InvalidStateError} If the question is already answered
   */
  public setAnswer(answer: A): void {
    if (this.isAnswered()) {
      throw new InvalidStateError("Question is already answered");
    }

    this.answer = answer;
  }

  /**
   * Check if the answer is correct
   * @returns true if the answer is correct, false otherwise
   */
  public isCorrect(): boolean {
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
      isCorrect: this.isCorrect(),
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
   * @param answer The answer
   * @throws {InvalidStateError} If the answer choice is invalid
   */
  public setAnswer(answer: number) {
    if (!Number.isInteger(answer) || answer < 0 || answer >= this.choices.length) {
      throw new InvalidStateError("Invalid answer choice: " + answer);
    }

    super.setAnswer(answer);
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

  private storage: Storage<string, string>;

  private constructor(storageType: new () => Storage<string, string>) {
    this.storage = new storageType();
  }

  public getInstance(storageType: new () => Storage<string, string> = FileStorage): Quiz {
    if (Quiz.instance !== undefined) {
      return Quiz.instance;
    }

    Quiz.instance = new Quiz(storageType);

    return Quiz.instance;
  }

  public async create(): Promise<MultipleChoiceQuestion[]> {
    const chatHistory = await (await Chat.getInstance()).getHistory();

    const data = {
      chatHistory: chatHistory.map(message => {
        return {author: message.author, text: message.text};
      }),
      evaluation: this.evaluate(),
    };

    const request = `${JSON.stringify(data)}\nFrom the chat history between the patient and a chatbot and the 
    evaluation of the patient's dementia level above, create personalized multiple-choice questions for a memory game 
    from the facts or events extracted by the chat history with the proper mixture of difficulties while considering 
    their dementia level. The entire output must be formatted as a JSON, containing a list of 2 questions with 4 
    choices, its difficulty level between 1 and 3 and an index to the correct choice. The object keys must be question, 
    difficulty, choices and answer. Do not start your output with \`\`\`json and start with an open square bracket.`;

    interface Response {
      question: string,
      difficulty: Difficulty,
      choices: string[],
      correctChoice: number,
    }

    const response: Response[] = JSON.parse((await model.generateContent(request)).response.text());

    const quiz = response.map(q =>
      new MultipleChoiceQuestion(q.question, q.difficulty, q.choices, q.correctChoice)
    );

    await this.save(quiz);
    return quiz;
  }

  /**
   * Evaluate the dementia level of the patient
   * @returns The evaluation
   */
  private async evaluate(): Promise<string> {
    const chatHistory = await (await Chat.getInstance()).getHistory();

    const data = {
      chatHistory: chatHistory.map(message => {
        return {author: message.author, text: message.text};
      }),
      previousQuiz: await this.hasPreviousQuiz() ? await this.getPreviousQuiz() : [],
    };

    const request = `${JSON.stringify(data)}\nFrom the chat history between the patient and a chatbot and the 
    result of the previous quiz, try your best to evaluate their dementia level, considering their cognitive abilities, 
    and behavioural and psychological symptoms. Only explain your evaluations and do not suggest any recommendations or 
    things to consider.`;

    return (await model.generateContent(request)).response.text();
  }

  /**
   * Check if a previous quiz exists
   * @returns true if a previous quiz exists, false otherwise
   */
  private async hasPreviousQuiz(): Promise<boolean> {
    return this.storage.has(Quiz.path);
  }

  /**
   * Get the previous quiz
   * @returns The previous quiz
   * @throws {InvalidStateError} If no previous quiz is found
   */
  private async getPreviousQuiz(): Promise<MultipleChoiceQuestion[]> {
    if (!await this.hasPreviousQuiz()) {
      throw new InvalidStateError("No previous quiz found");
    }

    return JSON.parse(await this.storage.get(Quiz.path));
  }

  /**
   * Save the quiz
   * @param quiz The quiz
   */
  private async save(quiz: MultipleChoiceQuestion[]): Promise<void> {
    return this.storage.set(Quiz.path, JSON.stringify(quiz));
  }
}
