import {InvalidArgumentError} from "../src/utils/error";
import {Storage} from "../src/utils/storage";

export class MockStorage<K, V> implements Storage<K, V> {

  private data: Map<K, V> = new Map();

  public async has(key: K): Promise<boolean> {
    return this.data.has(key);
  }

  public async get(key: K): Promise<V> {
    const data = this.data.get(key);
    if (data === undefined) {
      throw new InvalidArgumentError(`key does not exist: ${key}`);
    }

    return data;
  }

  public async set(key: K, value: V): Promise<void> {
    this.data.set(key, value);
  }

  public async delete(key: K): Promise<void> {
    if (!this.data.delete(key)) {
      throw new InvalidArgumentError(`Key does not exist: ${key}`);
    }
  }
}
