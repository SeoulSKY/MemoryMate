import {beforeEach, describe, expect, it} from "@jest/globals";
import {spyOn} from "jest-mock";
import * as FileSystem from "expo-file-system";

import {MockStorage} from "../index";

import Image, {ImageData} from "../../src/utils/image";
import {InvalidArgumentError} from "../../src/utils/error";

const mockImageData: ImageData = {
  path: "image.jpg",
  width: 100,
  height: 100,
  mimeType: "image/jpeg",
};

const mockImageJsonPath = mockImageData.path.replace(".jpg", ".json");

describe("Image", () => {
  const image = Image.getInstance(MockStorage);
  const directory = Image["directory"];
  let storage: MockStorage<string, string>;

  async function setMockImage(): Promise<ImageData> {
    await storage.set(directory + mockImageData.path, "data");
    await storage.set(directory + mockImageJsonPath, JSON.stringify(mockImageData));

    return mockImageData;
  }

  beforeEach(() => {
    storage = new MockStorage();
    image["storage"] = storage;
  });

  describe("delete", () => {
    it("should delete the image", async () => {
      await setMockImage();

      await image.delete(mockImageData.path);

      expect(await storage.has(directory + mockImageData.path)).toBe(false);
      expect(await storage.has(directory + mockImageJsonPath)).toBe(false);
    });

    it("should throw InvalidArgumentError if the image is not found", async () => {
      await expect(image.delete(mockImageData.path)).rejects.toThrow(InvalidArgumentError);
    });
  });

  describe("get", () => {
    it("should get the image data", async () => {
      await setMockImage();

      expect(await image.get(mockImageData.path)).toEqual(mockImageData);
    });

    it("should throw InvalidArgumentError if the image data is not found", async () => {
      await expect(image.get(mockImageData.path)).rejects.toThrow(InvalidArgumentError);
    });
  });

  describe("has", () => {
    it("should return true if the image exists", async () => {
      await setMockImage();

      expect(await image.has(mockImageData.path)).toBe(true);
    });

    it("should return false if the image does not exist", async () => {
      expect(await image.has(mockImageData.path)).toBe(false);
    });
  });

  describe("copyFromGallery", () => {
    it("should copy the image from gallery", async () => {
      spyOn(FileSystem, "copyAsync").mockImplementation(async () => {
        await storage.set(directory + mockImageData.path, "data");
      });

      await image.saveFromGallery(mockImageData);

      expect(await storage.get(directory + mockImageData.path)).toBe("data");
      expect(await storage.get(directory + mockImageJsonPath)).toBe(JSON.stringify(mockImageData));
    });

    it("should throw InvalidArgumentError if the image path is invalid", async () => {
      const invalidPaths = ["", "image", "image/"];
      for (const path of invalidPaths) {
        await expect(image.saveFromGallery({...mockImageData, path})).rejects.toThrow(InvalidArgumentError);
      }
    });
  });

  describe("load", () => {
    it("should throw InvalidArgumentError if the image is not found", async () => {
      await expect(image.load(mockImageData)).rejects.toThrow(InvalidArgumentError);
    });
  });
});
