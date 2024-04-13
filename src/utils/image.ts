import {copyAsync} from "expo-file-system";
import {FileStorage, Storage} from "./storage";
import {InvalidArgumentError} from "./error";

export interface ImageData {
  path: string;
  width: number;
  height: number;
  mimeType: string;
}

export default class Image {

  private static readonly path = "images/";

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
   * Delete the image from the storage
   * @param path The path to the image
   * @throws {InvalidArgumentError} If the image is not found
   */
  public async delete(path: string): Promise<void> {
    if (!await this.has(path)) {
      throw new InvalidArgumentError("Could not find image: " + path);
    }

    return this.storage.delete(Image.path + path)
      .then(() => this.storage.delete(this.replaceExtension(Image.path + path, ".json")));
  }

  /**
   * Get the image data from the storage
   * @param path The path to the image
   * @returns The image data
   * @throws {InvalidArgumentError} If the image data is not found
   */
  public async get(path: string): Promise<ImageData> {
    const dataPath = this.replaceExtension(Image.path + path, ".json");
    if (!await this.has(dataPath)) {
      throw new InvalidArgumentError("Could not find image data: " + dataPath);
    }

    return JSON.parse(await this.storage.get(this.replaceExtension(Image.path + path, ".json")));
  }

  /**
   * Check if the image exists in the storage
   * @param path The path to the image
   * @returns true if the image exists, false otherwise
   */
  public async has(path: string): Promise<boolean> {
    return this.storage.has(Image.path + path);
  }

  /**
   * Save the image from the galley to the storage
   * @param data The image data
   * @throws {InvalidArgumentError} If the image path is invalid
   */
  public async save(data: ImageData): Promise<void> {
    const fileName = data.path.split("/").pop();
    if (fileName === undefined) {
      throw new InvalidArgumentError("Invalid image path");
    }

    return copyAsync({
      from: data.path,
      to: Image.path + fileName,
    }).then(() => {
      data.path = Image.path + fileName;
      this.storage.set(this.replaceExtension(data.path, ".json"), JSON.stringify(data));
    });
  }

  /**
   * Load the image from the storage into a base64 string
   * @param data The image data
   * @returns The base64 string of the image
   */
  public async load(data: ImageData): Promise<string> {
    return Buffer.from(await this.storage.get(data.path)).toString("base64");
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