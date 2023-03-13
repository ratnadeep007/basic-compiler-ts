import Parser from "./frontend/parser.js";
import Environment from "./runtime/environment.js";
import { evaluate } from "./runtime/interpreter.js";
import { MK_BOOL, MK_NULL, MK_NUMBER, NumberVal } from "./runtime/values.js";

repl();

function repl() {
  const parser = new Parser();
  const env = new Environment();
  env.declarVar("true", MK_BOOL(true), true);
  env.declarVar("false", MK_BOOL(false), true);
  env.declarVar("null", MK_NULL(), true);
  console.log("repl v0.1");

  while (true) {
    const input = prompt(">");
    if (!input || input.includes("exit")) {
      process.exit(0);
    }

    const program = parser.produceAST(input || "");
    const result = evaluate(program, env);
    console.log(result);
  }
}
