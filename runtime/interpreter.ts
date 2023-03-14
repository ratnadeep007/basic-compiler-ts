import { RuntimeVal, NumberVal, NullVal } from "./values.js";
import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  FunctionDeclaration,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Stmt,
  VarDeclaration
} from "../frontend/ast.js";
import Environment from "./environment.js";
import { eval_identifier, eval_binary_expr, eval_assignment, eval_object_expr, eval_call_expr } from "./eval/expressions.js";
import { eval_function_decleration, eval_program, eval_var_decleration } from "./eval/statements.js";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  // console.log("astnode", astNode);
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
    case "AssignmentExpr":
      return eval_assignment(astNode as AssignmentExpr, env);
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);
    case "CallExpr":
      return eval_call_expr(astNode as CallExpr, env);
    case "FunctionDeclaration":
      return eval_function_decleration(astNode as FunctionDeclaration, env);
    default:
      console.error("AST not setup for interpretation.", astNode);
      process.exit(0);
      return {} as NullVal;
  }
}