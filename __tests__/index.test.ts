import {describe, expect, it} from "@jest/globals";
import {parseStatusCode} from "../src/utils";

describe("parseStatusCode", () => {
  it("should parse the status code from the error message", () => {
    const messages = [
      "[400 Bad Request]",
      "[404 Not Found]",
      "\nHello\n [500 Internal Server Error] \nWorld\n",
    ];

    expect(messages.map(message => parseStatusCode(new Error(message)))).toEqual([400, 404, 500]);
  });

  it("should throw SyntaxError if the status code cannot be parsed", () => {
    const messages = [
      "Hello World",
      "[400.0 Bad Request]",
    ];

    messages.forEach(message => {
      expect(() => parseStatusCode(new Error(message))).toThrow(SyntaxError);
    });
  });
});
