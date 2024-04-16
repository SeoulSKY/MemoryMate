import {copyAsync} from "expo-file-system";
import {FileStorage, Storage} from "./storage";
import {HTTPError, InvalidArgumentError} from "./error";
import OpenAI from "openai";
import {ProfileData} from "./profile";
import {ImagesResponse} from "openai/resources";
import {APIError} from "openai/error";

export interface ImageData {
  readonly path: string,
  readonly width: number,
  readonly height: number,
  readonly mimeType: "image/png" | "image/jpeg" | "image/gif",
}

export default class Image {

  private static readonly directory = "images/";

  private static instance: Image;

  // @ts-expect-error it will be assigned in getInstance()
  private storage: Storage<string, string>;

  private constructor() {}

  /**
   * Get the image instance
   * @param storageType The storage type
   * @returns The image instance
   */
  public static getInstance(storageType: new () => Storage<string, string> = FileStorage) {
    if (this.instance !== undefined) {
      return this.instance;
    }

    this.instance = new Image();
    this.instance.storage = new storageType();

    return this.instance;
  }

  /**
   * Create a profile image
   * @param fileName The file name of the image
   * @param data The profile data
   * @returns The image data
   * @throws {HTTPError} If the image generation fails
   */
  public async createProfile(fileName: string, data: ProfileData): Promise<ImageData> {
    const openai = new OpenAI();
    let image: ImagesResponse;

    try {
      image = await openai.images.generate({
        prompt: `A headshot of a friendly person with ${data.age} years old whose gender is ${data.gender}.`,
        size: "256x256",
        style: "natural",
      });
    } catch (e) {
      if (e instanceof APIError) {
        throw new HTTPError(e.message, e.status ? e.status : 500);
      }

      throw e;
    }

    const response = await fetch(image.data[0].url!);
    if (!response.ok) {
      throw new HTTPError("Failed to download image", response.status);
    }

    const stringImage = Buffer.from(await response.arrayBuffer()).toString("base64");
    const imageData: ImageData = {
      mimeType: "image/png",
      height: 256,
      width: 256,
      path: fileName,
    };

    await this.storage.set(Image.directory + fileName + ".png", stringImage);
    await this.storage.set(this.replaceExtension(Image.directory + fileName, ".json"),
      JSON.stringify(imageData));

    return imageData;
  }

  /**
   * Delete the image from the storage
   * @param path The path to the image
   * @throws {InvalidArgumentError} If the image is not found
   */
  public async delete(path: string): Promise<void> {
    if (!await this.has(path)) {
      throw new InvalidArgumentError("Could not find image: " + Image.directory + path);
    }

    return this.storage.delete(Image.directory + path)
      .then(() => this.storage.delete(this.replaceExtension(Image.directory + path, ".json")));
  }

  /**
   * Get the image data from the storage
   * @param path The path to the image
   * @returns The image data
   * @throws {InvalidArgumentError} If the image data is not found
   */
  public async get(path: string): Promise<ImageData> {
    const dataPath = this.replaceExtension(path, ".json");
    if (!await this.has(dataPath)) {
      throw new InvalidArgumentError("Could not find image data: " + dataPath);
    }

    return JSON.parse(await this.storage.get(this.replaceExtension(Image.directory + path, ".json")));
  }

  /**
   * Check if the image exists in the storage
   * @param path The path to the image
   * @returns true if the image exists, false otherwise
   */
  public async has(path: string): Promise<boolean> {
    return this.storage.has(Image.directory + path);
  }

  /**
   * Save the image from the gallery to the storage
   * @param data The image data
   * @returns The new image data
   * @throws {InvalidArgumentError} If the image path is invalid
   */
  public async copyFromGallery(data: ImageData): Promise<ImageData> {
    const fileName = data.path.split("/").pop();
    if (fileName === undefined || fileName.trim() == "" || !this.isImage(fileName)) {
      throw new InvalidArgumentError("Invalid image path");
    }

    return copyAsync({
      from: data.path,
      to: Image.directory + fileName,
    }).then(() => {
      this.storage.set(this.replaceExtension(Image.directory + fileName, ".json"), JSON.stringify(data));
      return {...data, path: fileName};
    });
  }

  /**
   * Load the image from the storage into a base64 string
   * @param data The image data
   * @returns The base64 string of the image
   * @throws {InvalidArgumentError} If the image is not found
   */
  public async load(data: ImageData): Promise<string> {
    if (!await this.has(data.path)) {
      throw new InvalidArgumentError("Could not find image: " + data.path);
    }

    return Buffer.from(await this.storage.get(Image.directory + data.path)).toString("base64");
  }

  /**
   * Check if the path is an image
   * @param path The path to the image
   * @returns true if the path is an image, false otherwise
   */
  private isImage(path: string): boolean {
    return path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".gif");
  }

  /**
   * Replace the extension of the path
   * @param path The path to the image
   * @param extension The new extension
   * @returns The path with the new extension
   */
  private replaceExtension(path: string, extension: string): string {
    return path.replace(/\.[^.]+$/, extension);
  }
}