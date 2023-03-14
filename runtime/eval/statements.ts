import { FunctionDeclaration, Program, VarDeclaration } from "../../frontend/ast.js";
import Environment from "../environment.js";
import { evaluate } from "../interpreter.js";
import { RuntimeVal, MK_NULL, FunctionCall, FunctionValue } from "../values.js";

export function eval_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }

  return lastEvaluated;
}

export function eval_var_decleration(declaration: VarDeclaration, env: Environment): RuntimeVal {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : MK_NULL();
  return env.declarVar(declaration.identifier, value, declaration.constant);
}

export function eval_function_decleration(declaration: FunctionDeclaration, env: Environment): RuntimeVal {
  const fn = {
    type: "function",
    name: declaration.name,
    parameters: declaration.parameters,
    declerationEnv: env,
    body: declaration.body,
  } as FunctionValue;

  return env.declarVar(declaration.name, fn, true);
}