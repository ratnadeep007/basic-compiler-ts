import { RuntimeVal, NumberVal, NullVal } from "./values.js";
import {
  BinaryExpr,
  Identifier,
  NumericLiteral,
  Program,
  Stmt,
  VarDeclaration
} from "../frontend/ast.js";
import Environment from "./environment.js";
import { eval_identifier, eval_binary_expr } from "./eval/expressions.js";
import { eval_program, eval_var_decleration } from "./eval/statements.js";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number"
      } as NumberVal;
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    case "Program":
      return eval_program(astNode as Program, env);
    case "VarDeclaration":
      return eval_var_decleration(astNode as VarDeclaration, env);
    default:
      console.error("AST not setup for interpretation.", astNode);
      process.exit(0);
      return {} as NullVal;
  }
}