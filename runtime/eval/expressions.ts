import { AssignmentExpr, BinaryExpr, Identifier, ObjectLiteral } from "../../frontend/ast.js";
import Environment from "../environment.js";
import { evaluate } from "../interpreter.js";
import { RuntimeVal, NumberVal, MK_NULL, ObjectVal } from "../values.js";

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

export function eval_assignment(node: AssignmentExpr, env: Environment): RuntimeVal {
  if (node.assigne.kind != "Identifier") {
    throw `Invalid assignment for type: ${node.assigne.kind}`;
  }
  const varname = (node.assigne as Identifier).symbol;
  return env.assignVar(varname, evaluate(node.value, env));
}

export function eval_object_expr(obj: ObjectLiteral, env: Environment): RuntimeVal {
  const object = { type: "object", properties: new Map() } as ObjectVal;
  for (const { key, value } of obj.properties) {
    const runtimeVal = (value == undefined) ? env.lookupVar(key) : evaluate(value, env);
    object.properties.set(key, runtimeVal);
  }

  return object;
}
