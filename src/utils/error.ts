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