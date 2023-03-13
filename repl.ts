import Parser from "./frontend/parser.js";
import { createGlobalEnv } from "./runtime/environment.js";
import { evaluate } from "./runtime/interpreter.js";

function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();
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

repl();