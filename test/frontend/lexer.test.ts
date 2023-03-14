import { describe, expect, test } from "bun:test";
import { tokenize } from "../../frontend/lexer.js";

describe("Lexer Test", () => {
  test("Tokenize Let", () => {
    let src = "let a = 5;";
    const tokens = tokenize(src);
    const expected = [
      {
        value: "let",
        type: 3
      }, {
        value: "a",
        type: 1
      }, {
        value: "=",
        type: 2
      }, {
        value: "5",
        type: 0
      }, {
        value: ";",
        type: 10
      }, {
        type: 9,
        value: "EndOfFile"
      }
    ];
    expect(tokens).toEqual(expected);
  });
  test("Tokenize Const", () => {
    let src = "const a = 15;";
    const tokens = tokenize(src);
    const expected = [
      {
        value: "const",
        type: 4
      }, {
        value: "a",
        type: 1
      }, {
        value: "=",
        type: 2
      }, {
        value: "15",
        type: 0
      }, {
        value: ";",
        type: 10
      }, {
        type: 9,
        value: "EndOfFile"
      }
    ];
    expect(tokens).toEqual(expected);
  })
});