import { tokenize } from "./lexer.js";
import { readFile } from "fs/promises";

const source = (await readFile("example.txt")).toString();

for (const token of tokenize(source)) {
    console.log(token);
}
