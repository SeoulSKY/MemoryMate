import {Storage, FileStorage} from "./storage";
import {InvalidArgumentError, InvalidStateError} from "./error";

export enum Gender {
  MALE,
  FEMALE,
  NON_BINARY,
}

export interface ProfileData {
  name: string;
  age: number;
  gender: Gender;
}

export default class Profile {

  private static instance: Profile;
  private static readonly path = "profile.json";

  // @ts-expect-error it will be assigned in getInstance()
  private storage: Storage<string, string>;

  private constructor() {}

  /**
   * Get the profile instance
   * @returns The profile instance
   */
  public static getInstance(storageType: new () => Storage<string, string> = FileStorage): Profile {
    if (this.instance !== undefined) {
      return this.instance;
    }

    this.instance = new Profile();
    this.instance.storage = new storageType();

    return this.instance;
  }

  /**
   * Check if the profile exists
   * @returns true if the profile exists, false otherwise
   */
  public async has(): Promise<boolean> {
    return this.storage.has(Profile.path);
  }

  /**
   * Create a new profile
   * @param data Profile data
   * @throws {InvalidArgumentError} If the age is invalid
   */
  public async create(data: ProfileData): Promise<void> {
    return this.update(data);
  }

  /**
   * Update the profile
   * @param data Profile data
   * @throws {InvalidArgumentError} If the age is invalid
   */
  public async update(data: ProfileData): Promise<void> {
    if (data.age < 0 || !Number.isInteger(data.age)) {
      throw new InvalidArgumentError(`Given profile data has an invalid age: ${data.age}`);
    }

    return this.storage.set(Profile.path, JSON.stringify(data));
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

    return JSON.parse(await this.storage.get(Profile.path));
  }
}
