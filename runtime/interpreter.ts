import { RuntimeVal, NumberVal, NullVal } from "./values.js";
import {
  BinaryExpr,
  NodeType,
  NumericLiteral,
  Program,
  Stmt
} from "../frontend/ast.js";

function eval_program(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }

  return lastEvaluated;
}

function eval_binary_expr(binop: BinaryExpr): RuntimeVal {
  const lhs = evaluate(binop.left);
  const rhs = evaluate(binop.right);

  if (lhs.type == "number" && rhs.type == "number") {
    return eval_number_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator
    );
  }

  return { type: "null", value: "null" } as NullVal;
}

function eval_number_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): NumberVal {
  let result: number = 0;
  if (operator == "+") result = lhs.value + rhs.value;
  else if (operator == "-") result = lhs.value - rhs.value;
  else if (operator == "*") result = lhs.value * rhs.value;
  else if (operator == "/")
    // no division by zero check
    result = lhs.value / rhs.value;
  else if (operator == "%") result = lhs.value % rhs.value;

  return { type: "number", value: result };
}

export function evaluate(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number"
      } as NumberVal;
    case "NullLiteral":
      return { value: "null", type: "null" } as NullVal;
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr);
    case "Program":
      return eval_program(astNode as Program);
    default:
      console.error("AST not setup for interpretation.", astNode);
      process.exit(0);
      return {} as NullVal;
  }
}
