import {describe, expect, it, beforeEach} from "@jest/globals";

import {MockStorage} from "../index";
import {Gender, ProfileData, UserProfile, BotProfile} from "../../src/utils/profile";
import {InvalidArgumentError, InvalidStateError} from "../../src/utils/error";

const mockProfileData: ProfileData = {
  image: undefined,
  name: "test",
  age: 50,
  gender: Gender.MALE,
};

describe("User Profile", () => {
  const userProfile = UserProfile.getInstance();

  const path = UserProfile["path"];
  let storage: MockStorage<string, string>;

  beforeEach(() => {
    storage = new MockStorage();

    // @ts-expect-error testing purposes
    userProfile["storage"] = storage;
  });

  describe("has", () => {
    it("should return false when the user profile does not exist", async () => {
      expect(await userProfile.has()).toBe(false);
    });

    it("should return true when the user profile exists", async () => {
      await storage.set(path, JSON.stringify(mockProfileData));
      expect(await userProfile.has()).toBe(true);
    });
  });

  describe("create", () => {
    it("should create a new user profile", async () => {
      await userProfile.create(mockProfileData);

      expect(await storage.get(path)).toBe(JSON.stringify(mockProfileData));
    });

    it("should throw an error when the age is invalid", async () => {
      const invalidAges = [-1, 0.5, -0.5, NaN, Infinity, -Infinity];
      for (const age of invalidAges) {
        await expect(userProfile.create({...mockProfileData, age})).rejects.toThrow(InvalidArgumentError);
      }
    });
  });

  describe("update", () => {
    it("should update the user profile", async () => {
      await userProfile.update(mockProfileData);

      expect(await storage.get(path)).toEqual(JSON.stringify(mockProfileData));
    });

    it("should throw an error when the age is invalid", async () => {
      const invalidAges = [-1, 0.5, -0.5, NaN, Infinity, -Infinity];
      for (const age of invalidAges) {
        await expect(userProfile.update({...mockProfileData, age})).rejects.toThrow(InvalidArgumentError);
      }
    });
  });

  describe("get", () => {
    it("should throw InvalidStateError when the user profile does not exist", async () => {
      await expect(userProfile.get()).rejects.toThrow(InvalidStateError);
    });

    it("should return the user profile", async () => {
      await storage.set(path, JSON.stringify(mockProfileData));

      expect(await userProfile.get()).toEqual(mockProfileData);
    });
  });
});

describe("Bot Profile", () => {
  const botProfile = BotProfile.getInstance();

  const path = BotProfile["path"];
  const profileDirectory = BotProfile["profileImageDirectory"];
  let storage: MockStorage<string, string>;

  beforeEach(() => {
    storage = new MockStorage();

    // @ts-expect-error testing purposes
    botProfile["storage"] = storage;
  });

  describe("has", () => {
    it("should return false when the bot profile does not exist", async () => {
      expect(await botProfile.has()).toBe(false);
    });

    it("should return true when the bot profile exists", async () => {
      await storage.set(path, JSON.stringify(mockProfileData));
      expect(await botProfile.has()).toBe(true);
    });
  });

  describe("create", () => {
    it("should create a new bot profile", async () => {
      const newProfileData = await botProfile.create(mockProfileData);
      const path = newProfileData.image?.path as string;
      expect(path.startsWith(`${profileDirectory}${mockProfileData.gender.toString()}/`) ||
        path.endsWith(`${mockProfileData.age}_0.png`) || path.endsWith(`${mockProfileData.age}_1.png`))
        .toBe(true);

      expect(newProfileData).toEqual({
        ...mockProfileData,
        image: newProfileData.image,
      });
    });

    it("should throw an error when the age is invalid", async () => {
      const invalidAges = [-1, 0.5, -0.5, NaN, Infinity, -Infinity];
      for (const age of invalidAges) {
        await expect(botProfile.create({...mockProfileData, age})).rejects.toThrow(InvalidArgumentError);
      }
    });
  });

  describe("update", () => {
    it("should update the bot profile", async () => {
      await botProfile.update(mockProfileData);

      expect(await storage.get(path)).toEqual(JSON.stringify(mockProfileData));
    });

    it("should throw an error when the age is invalid", async () => {
      const invalidAges = [-1, 0.5, -0.5, NaN, Infinity, -Infinity];
      for (const age of invalidAges) {
        await expect(botProfile.update({...mockProfileData, age})).rejects.toThrow(InvalidArgumentError);
      }
    });
  });

  describe("get", () => {
    it("should throw InvalidStateError when the bot profile does not exist", async () => {
      await expect(botProfile.get()).rejects.toThrow(InvalidStateError);
    });

    it("should return the bot profile", async () => {
      await storage.set(path, JSON.stringify(mockProfileData));

      expect(await botProfile.get()).toEqual(mockProfileData);
    });
  });
});
