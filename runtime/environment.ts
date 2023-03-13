import { MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, RuntimeVal } from "./values.js";

export function createGlobalEnv() {
  const env = new Environment();
  env.declarVar("true", MK_BOOL(true), true);
  env.declarVar("false", MK_BOOL(false), true);
  env.declarVar("null", MK_NULL(), true);

  // define a native method
  env.declarVar("print", MK_NATIVE_FN((args, scope) => {
    console.log(...args);
    return MK_NULL();
  }), true)

  env.declarVar("time", MK_NATIVE_FN((args, scope) => {
    return MK_NUMBER(Date.now());
  }), true);
  return env;
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentENV?: Environment) {
    const global = parentENV ? true : false;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declarVar(varname: string, value: RuntimeVal, constant: boolean): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `Cannot declare variable ${varname}, as its already defined`;
    }

    this.variables.set(varname, value);

    if (constant) {
      this.constants.add(varname);
    }

    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);

    // we cannot reassign a constant
    if (env.constants.has(varname)) {
      throw `Cannot reassign to variable ${varname} as it was constant`;
    }

    env.variables.set(varname, value);
    return value;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent == undefined) {
      throw `Connot resovle ${varname}, as it does not exists`;
    }

    return this.parent.resolve(varname);
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }
}