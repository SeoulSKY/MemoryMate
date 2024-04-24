import {HttpStatusCode} from "./index";

/**
 * Error for invalid arguments
 */
export class InvalidArgumentError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Error for invalid state
 */
export class InvalidStateError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Error for http requests
 */
export class HttpError extends Error {
  /**
   * The status code of the response
   */
  public readonly status: HttpStatusCode;

  constructor(message: string, status: HttpStatusCode) {
    super(message);

    this.status = status;
  }
}
