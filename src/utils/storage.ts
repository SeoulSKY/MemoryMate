import {
  documentDirectory,
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  makeDirectoryAsync
} from "expo-file-system";
import {InvalidArgumentError} from "./errors";

export interface Storage<K, V> {

  /**
   * Check if the storage has a key
   * @param key The key to check
   * @returns true if the key exists, false otherwise
   */
  has(key: K): Promise<boolean>

  /**
   * Get the value of a key from the storage
   * @param key The key to get
   * @returns The value of the key
   * @throws {InvalidArgumentError} If the key does not exist
   */
  get(key: K): Promise<V>

  /**
   * Set the value of a key in the storage
   * @param key The key to set
   * @param value The value to set
   */
  set(key: K, value: V): Promise<void>

  /**
   * Delete a key from the storage
   * @param key The key to delete
   * @throws {InvalidArgumentError} If the key does not exist
   */
  delete(key: K): Promise<void>
}

export class FileStorage implements Storage<string, string> {

  private BASE_PATH = documentDirectory!;

  /**
   * Check if the file storage has the file
   * @param path The path to the file
   * @returns true if the file exists, false otherwise
   */
  public async has(path: string): Promise<boolean> {
    return getInfoAsync(this.BASE_PATH + path).then(info => info.exists);
  }

  /**
   * Get the content of the file
   * @param path The path to the file
   * @returns The content of the file
   * @throws {InvalidArgumentError} If the file does not exist
   */
  public async get(path: string): Promise<string> {
    if (!await this.has(path)) {
      throw new InvalidArgumentError(`File does not exist: ${path}`);
    }

    return readAsStringAsync(this.BASE_PATH + path);
  }

  /**
   * Set the content of the file
   * @param path The path to the file
   * @param value The value to set
   */
  public async set(path: string, value: string): Promise<void> {
    await makeDirectoryAsync(this.BASE_PATH + path, {intermediates: true});
    return writeAsStringAsync(this.BASE_PATH + path, value);
  }

  /**
   * Delete the file
   * @param path The path to the file
   * @throws {InvalidArgumentError} If the file does not exist
   */
  public async delete(path: string): Promise<void> {
    if (!await this.has(path)) {
      throw new InvalidArgumentError(`File does not exist: ${path}`);
    }

    return deleteAsync(this.BASE_PATH + path);
  }
}
