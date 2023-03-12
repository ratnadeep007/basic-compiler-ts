import { BinaryExpr, Identifier } from "../../frontend/ast.js";
import Environment from "../environment.js";
import { evaluate } from "../interpreter.js";
import { RuntimeVal, NumberVal, MK_NULL } from "../values.js";

export function eval_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);

  if (lhs.type == "number" && rhs.type == "number") {
    return eval_number_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator
    );
  }

  return MK_NULL();
}

export function eval_number_binary_expr(
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

export function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(ident.symbol);
  return val;
}