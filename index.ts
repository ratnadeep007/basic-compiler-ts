import Parser from "./frontend/parser.js";
import Environment, { createGlobalEnv } from "./runtime/environment.js";
import { evaluate } from "./runtime/interpreter.js";
import * as fs from "fs/promises";

run_file(process.argv.at(-1) || "");

async function run_file(filepath: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = (await fs.readFile(filepath)).toString();
  const program = parser.produceAST(input || "");
  const result = evaluate(program, env);
  // console.log(result);
}
