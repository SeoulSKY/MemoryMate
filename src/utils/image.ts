import {copyAsync, makeDirectoryAsync, readAsStringAsync} from "expo-file-system";
import {FileStorage, Storage} from "./storage";
import {InvalidArgumentError} from "./errors";

export type MimeType = "image/png" | "image/jpeg" | "image/gif";

export interface ImageData {
  readonly path: string | number,
  readonly width: number,
  readonly height: number,
  readonly mimeType: MimeType,
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
   * Delete the image from the storage
   * @param data The image data
   * @throws {InvalidArgumentError} If the image path is invalid
   */
  public async delete(data: ImageData) {
    if (typeof data.path == "number") {
      throw new InvalidArgumentError("Invalid image path: " + data.path);
    }

    await this.storage.delete(data.path);
    return this.storage.delete(this.replaceExtension(data.path, ".json"));
  }

  /**
   * Delete all images from the storage
   */
  public async deleteAll(): Promise<void> {
    return this.storage.delete(Image.directory);
  }


  /**
   * Save the image from the gallery to the storage
   * @param data The image data
   * @returns The new image data
   * @throws {InvalidArgumentError} If the image path is invalid
   */
  public async saveFromGallery(data: ImageData): Promise<ImageData> {
    if (typeof data.path == "number") {
      throw new InvalidArgumentError("Invalid image path: " + data.path);
    }

    const fileName = data.path.split("/").pop();
    if (fileName === undefined || fileName.trim() == "" || !this.isImage(fileName)) {
      throw new InvalidArgumentError("Invalid image path: " + data.path);
    }

    await makeDirectoryAsync(FileStorage.basePath + Image.directory, {intermediates: true});

    await copyAsync({
      from: data.path,
      to: FileStorage.basePath + Image.directory + fileName,
    });

    await this.storage.set(this.replaceExtension(Image.directory + fileName, ".json"),
      JSON.stringify(data));
    return {...data, path: FileStorage.basePath + Image.directory + fileName};
  }

  /**
   * Load the image from the storage into a base64 string
   * @param data The image data
   * @returns The base64 string of the image
   * @throws {InvalidArgumentError} If the image path is invalid
   */
  public async load(data: ImageData): Promise<string> {
    if (typeof data.path == "number") {
      throw new InvalidArgumentError("Invalid image path: " + data.path);
    }

    const result = await readAsStringAsync(data.path, {encoding: "base64"});
    if (result === undefined) {
      throw new InvalidArgumentError("Invalid image path: " + data.path);
    }

    return result;
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
