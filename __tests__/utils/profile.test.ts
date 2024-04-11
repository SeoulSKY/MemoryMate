import {describe, expect, it, beforeEach} from "@jest/globals";

import {MockStorage} from "../index";
import Profile, {Gender, ProfileData} from "../../src/utils/profile";
import {InvalidArgumentError} from "../../src/utils/error";

const mockProfileData: ProfileData = {
  name: "test",
  age: 20,
  gender: Gender.MALE,
};

describe("Profile", () => {
  const profile = new Profile();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const path = (profile as any).path;
  let storage: MockStorage<string, string>;

  beforeEach(() => {
    storage = new MockStorage();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (profile as any).storage = storage;
  });

  describe("has", () => {
    it("should return false when the profile does not exist", async () => {
      expect(await profile.has()).toBe(false);
    });

    it("should return true when the profile exists", async () => {
      await storage.set(path, JSON.stringify(mockProfileData));
      expect(await profile.has()).toBe(true);
    });
  });

  describe("create", () => {
    it("should create a new profile", async () => {
      await profile.create(mockProfileData);

      expect(await storage.get(path)).toBe(JSON.stringify(mockProfileData));
    });

    it("should throw an error when the age is invalid", async () => {
      const invalidAges = [-1, 0.5, -0.5, NaN, Infinity, -Infinity];
      for (const age of invalidAges) {
        await expect(profile.create({...mockProfileData, age})).rejects.toThrow(InvalidArgumentError);
      }
    });
  });

  describe("update", () => {
    it("should update the profile", async () => {
      await profile.update(mockProfileData);

      expect(await storage.get(path)).toEqual(JSON.stringify(mockProfileData));
    });

    it("should throw an error when the age is invalid", async () => {
      const invalidAges = [-1, 0.5, -0.5, NaN, Infinity, -Infinity];
      for (const age of invalidAges) {
        await expect(profile.update({...mockProfileData, age})).rejects.toThrow(InvalidArgumentError);
      }
    });
  });

  describe("get", () => {
    it("should return the profile", async () => {
      await storage.set(path, JSON.stringify(mockProfileData));

      expect(await profile.get()).toEqual(mockProfileData);
    });
  });
});
