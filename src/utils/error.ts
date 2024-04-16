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
 * Error for HTTP requests
 */
export class HTTPError extends Error {
  /**
   * The status code of the response
   */
  public status: number;

  constructor(message: string, status: number) {
    super(message);

    this.status = status;
  }
}
