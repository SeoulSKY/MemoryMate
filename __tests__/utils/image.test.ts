import {beforeEach, describe, expect, it} from "@jest/globals";
import {spyOn} from "jest-mock";
import * as FileSystem from "expo-file-system";

import {MockStorage} from "../index";

import Image, {ImageData} from "../../src/utils/image";
import {InvalidArgumentError} from "../../src/utils/errors";

const directory = Image["directory"];
const mockImagePath = "image.jpg";
const mockImageJsonPath = directory + mockImagePath.replace(".jpg", ".json");

const mockImageData: ImageData = {
  path: directory + mockImagePath,
  width: 100,
  height: 100,
  mimeType: "image/jpeg",
};

describe("Image", () => {
  const image = Image.getInstance(MockStorage);

  let storage: MockStorage<string, string>;

  async function setMockImage(): Promise<ImageData> {
    await storage.set(mockImageData.path as string, "data");
    await storage.set(mockImageJsonPath, JSON.stringify(mockImageData));

    return mockImageData;
  }

  beforeEach(() => {
    storage = new MockStorage();
    image["storage"] = storage;
  });

  describe("delete", () => {
    it("should delete the image", async () => {
      await setMockImage();

      await image.delete(mockImageData);

      expect(await storage.has(mockImageData.path as string)).toBe(false);
      expect(await storage.has(mockImageJsonPath)).toBe(false);
    });

    it("should throw InvalidArgumentError if the image is not found", async () => {
      await expect(image.delete(mockImageData)).rejects.toThrow(InvalidArgumentError);
    });
  });

  describe("copyFromGallery", () => {
    it("should copy the image from gallery", async () => {
      spyOn(FileSystem, "copyAsync").mockImplementation(async () => {
        await storage.set(mockImageData.path as string, "data");
      });

      await image.saveFromGallery(mockImageData);

      expect(await storage.get(mockImageData.path as string)).toBe("data");
      expect(await storage.get(mockImageJsonPath as string)).toBe(JSON.stringify(mockImageData));
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
