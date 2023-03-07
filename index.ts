import Parser from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";

repl();

function repl() {
  const parser = new Parser();
  console.log("repl v0.1");

  while (true) {
    const input = prompt(">");
    if (!input || input.includes("exit")) {
      process.exit(0);
    }

    const program = parser.produceAST(input || "");
    const result = evaluate(program);
    console.log(result);
  }
}
