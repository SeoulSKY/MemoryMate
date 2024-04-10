import {Storage, FileSystem} from "./storage";
import {InvalidArgumentError} from "./error";

const profilePath = "profile.json";

enum Gender {
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

  private storage: Storage<string, string>;

  constructor() {
    this.storage = new FileSystem();
  }

  /**
   * Check if the profile exists
   * @returns true if the profile exists, false otherwise
   */
  public async has(): Promise<boolean> {
    return this.storage.has(profilePath);
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

    return this.storage.set(profilePath, JSON.stringify(data));
  }

  public async get(): Promise<ProfileData> {
    return JSON.parse(await this.storage.get(profilePath));
  }
}
