import {Storage, FileStorage} from "./storage";
import {InvalidArgumentError, InvalidStateError} from "./error";
import {ImageData} from "./image";

export enum Participant {
  USER,
  BOT,
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non-binary",
}

export interface ProfileData {
  readonly image: ImageData | undefined,
  readonly name: string,
  readonly age: number,
  readonly gender: Gender,
}

abstract class Profile {

  private readonly storage: Storage<string, string>;

  private readonly path: string;

  protected constructor(path: string, storageType: new () => Storage<string, string> = FileStorage) {
    this.path = path;
    this.storage = new storageType();
  }

  /**
   * Check if the profile exists
   * @returns true if the profile exists, false otherwise
   */
  public async has(): Promise<boolean> {
    return this.storage.has(this.path);
  }

  /**
   * Create a new profile
   * @param data Profile data
   * @returns The newly created profile data
   * @throws {InvalidArgumentError} If the age is invalid
   */
  async create(data: ProfileData): Promise<ProfileData> {
    if (!this.hasValidAge(data)) {
      throw new InvalidArgumentError(`Given profile data has an invalid age: ${data.age}`);
    }

    await this.update(data);

    return {...data};
  }

  /**
   * Update the profile
   * @param data Profile data
   * @throws {InvalidArgumentError} If the age is invalid
   */
  public async update(data: ProfileData): Promise<void> {
    if (!this.hasValidAge(data)) {
      throw new InvalidArgumentError(`Given profile data has an invalid age: ${data.age}`);
    }

    return this.storage.set(this.path, JSON.stringify(data));
  }

  /**
   * Get the profile data
   * @returns The profile data
   * @throws {InvalidStateError} If the profile does not exist
   */
  public async get(): Promise<ProfileData> {
    if (!await this.has()) {
      throw new InvalidStateError("Profile does not exist");
    }

    return JSON.parse(await this.storage.get(this.path));
  }

  /**
   * Check if the age is valid
   * @param data The profile data
   * @returns true if the age is valid, false otherwise
   */
  protected hasValidAge(data: ProfileData) {
    return data.age >= 0 && Number.isInteger(data.age);
  }
}

export class UserProfile extends Profile {

  private static instance: UserProfile;

  private static readonly path = "userProfile.json";

  private constructor(storageType: new () => Storage<string, string> = FileStorage) {
    super(UserProfile.path, storageType);
  }

  /**
   * Get the user profile instance
   * @param storageType The storage type
   * @returns The user profile instance
   */
  public static getInstance(storageType: new () => Storage<string, string> = FileStorage): Profile {
    if (this.instance !== undefined) {
      return this.instance;
    }

    this.instance = new UserProfile(storageType);

    return this.instance;
  }
}

export class BotProfile extends Profile {

  private static instance: BotProfile;

  private static readonly profileImageDirectory = "assets/profiles/";

  private static readonly path = "botProfile.json";

  private static readonly minAge = 40;

  private static readonly maxAge = 90;

  /**
   * Number of images per age group
   */
  private static readonly numImages = 2;

  private constructor(storageType: new () => Storage<string, string> = FileStorage) {
    super(BotProfile.path, storageType);
  }

  /**
   * Get the bot profile instance
   * @param storageType The storage type
   * @returns The bot profile instance
   */
  public static getInstance(storageType: new () => Storage<string, string> = FileStorage): Profile {
    if (this.instance !== undefined) {
      return this.instance;
    }

    this.instance = new BotProfile(storageType);

    return this.instance;
  }

  public async create(data: ProfileData): Promise<ProfileData> {
    if (!this.hasValidAge(data)) {
      throw new InvalidArgumentError(`Given profile data has an invalid age: ${data.age}`);
    }

    const age = Math.floor(Math.min(Math.max(data.age, BotProfile.minAge), BotProfile.maxAge) / 10) * 10;

    const newData: ProfileData = {
      ...data,
      image: {
        path: `${BotProfile.profileImageDirectory}${data.gender.toString()}/${age}_${this.getRandomInt(0, BotProfile.numImages)}.png`,
        width: 256,
        height: 256,
        mimeType: "image/png",
      },
    };

    await this.update(newData);
    return newData;
  }

  /**
   * Get a random number between min and max (exclusive)
   * @param min The minimum number
   * @param max The maximum number
   * @returns A random number between min and max
   */
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}