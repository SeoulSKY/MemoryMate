import * as FileSystem from "expo-file-system";
import {describe, expect, it, afterEach, jest} from "@jest/globals";
import {spyOn} from "jest-mock";
import {FileStorage} from "../../src/utils/storage";
import {InvalidArgumentError} from "../../src/utils/error";

const filePath = "test.json";

async function mockHas(fs: FileStorage, value: boolean) {
  const spy = spyOn(fs, "has").mockResolvedValue(value);
  expect(await fs.has(filePath)).toBe(value);
  return spy;
}

function mockGetInfoAsync(exists: boolean) {
  return spyOn(FileSystem, "getInfoAsync")
    .mockResolvedValue({
      exists: exists,
      uri: "",
      md5: "",
      modificationTime: 0,
      size: 0,
      isDirectory: false,
    });
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("File Storage", () => {
  describe("has", () => {
    it("should return true when the file exists", async () => {
      mockGetInfoAsync(true);
      expect(await new FileStorage().has(filePath)).toBe(true);
    });

    it("should return false when the file does not exist", async () => {
      mockGetInfoAsync(false);
      expect(await new FileStorage().has(filePath + "a")).toBe(false);
    });
  });

  describe("get", () => {
    it("should throw InvalidArgumentError when the file doesn't exist", async () => {
      const fs = new FileStorage();
      await mockHas(fs, false);

      await expect(() => fs.get(filePath)).rejects.toThrow(InvalidArgumentError);
    });

    it("should return the text in the file", async () => {
      const fs = new FileStorage();
      await mockHas(fs, true);

      spyOn(FileSystem, "readAsStringAsync").mockResolvedValue("test");
      expect(await fs.get(filePath)).toBe("test");
    });
  });

  describe("set", () => {
    it("should create a file with the value if the file doesn't exist", async () => {
      const fs = new FileStorage();
      await mockHas(fs, false);
      await fs.set(filePath, "test");
    });

    it("should update the file with the value if the file exists", async () => {
      const fs = new FileStorage();
      await mockHas(fs, true);
      await fs.set(filePath, "test");
    });
  });

  describe("delete", () => {
    it("should throw InvalidArgumentError when the file doesn't exist", async () => {
      const fs = new FileStorage();
      await mockHas(fs, false);

      await expect(() => fs.delete(filePath)).rejects.toThrow(InvalidArgumentError);
    });

    it("should delete the file if it exists", async () => {
      const fs = new FileStorage();
      await mockHas(fs, true);
      await fs.delete(filePath);
    });
  });
});
