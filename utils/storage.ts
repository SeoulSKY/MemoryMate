import {documentDirectory, getInfoAsync, readAsStringAsync, writeAsStringAsync, deleteAsync} from "expo-file-system";

export default interface Storage<K, V> {

  /**
   * Check if the storage has a key
   * @param key The key to check
   * @returns true if the key exists, false otherwise
   */
  has(key: K): Promise<boolean>;

  /**
   * Get the value of a key from the storage
   * @param key The key to get
   * @returns The value of the key
   */
  get(key: K): Promise<V>;

  /**
   * Set the value of a key in the storage
   * @param key The key to set
   * @param value The value to set
   */
  set(key: K, value: V): Promise<void>;

  /**
   * Delete a key from the storage
   * @param key The key to delete
   */
  delete(key: K): Promise<void>;
}

export class FileSystem implements Storage<string, string> {

  BASE_PATH = documentDirectory!;

  /**
   * Check if the file system has the file
   * @param path The path to the file
   * @returns true if the file exists, false otherwise
   */
  async has(path: string): Promise<boolean> {
    return getInfoAsync(this.BASE_PATH + path).then(info => info.exists);
  }

  /**
   * Get the content of the file
   * @param path The path to the file
   * @returns The content of the file
   */
  async get(path: string): Promise<string> {
    return readAsStringAsync(this.BASE_PATH + path);
  }

  /**
   * Set the content of the file
   * @param path The path to the file
   * @param value The value to set
   */
  async set(path: string, value: string): Promise<void> {
    return writeAsStringAsync(this.BASE_PATH + path, value);
  }

  /**
   * Delete the file
   * @param path The path to the file
   */
  async delete(path: string): Promise<void> {
    return deleteAsync(this.BASE_PATH + path);
  }
}
