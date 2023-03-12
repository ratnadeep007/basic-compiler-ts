import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VarDeclaration } from "./ast.js";
import { tokenize, Token, TokenType } from "./lexer.js";

export default class Parser {
  private tokens: Token[] = [];


  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private at() {
    return this.tokens[0] as Token;
  }

  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect(type: TokenType, err: string) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type !== type) {
      console.log("Parser Error:\n", err, prev, "Expecting: ", type);
      process.exit(1);
    }
    return prev;
  }

  private parse_stmt(): Stmt {
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_decleration();
      default:
        return this.parse_expr();
    }
  }

  parse_var_decleration(): Stmt {
    const isConstant = this.eat().type === TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expected identifier name following let | const keywords"
    ).value;

    if (this.at().type === TokenType.SemiColon) {
      this.eat();
      if (isConstant) {
        throw "Must assign value to a constant expression. No value provided";
      }
      return {
        kind: "VarDeclaration",
        identifier,
        constant: false
      } as VarDeclaration;
    }

    this.expect(TokenType.Equals, "Expected equals token following identifier in varibale declaration");
    const declaration = {
      kind: "VarDeclaration",
      value: this.parse_expr(),
      identifier,
      constant: isConstant
    } as VarDeclaration;
    // this.expect(TokenType.SemiColon, "Variable decleration statment must end with semicolon");
    return declaration;
  }

  private parse_expr(): Expr {
    return this.parse_additive_expr();
  }

  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        left, right, operator
      } as BinaryExpr;
    }

    return left;
  }


  private parse_multiplicative_expr(): Expr {
    let left = this.parse_primary_expr();

    while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: "BinaryExpr",
        left, right, operator
      } as BinaryExpr;
    }

    return left;
  }

  private parse_primary_expr(): Expr {
    const tk = this.at().type;
    switch (tk) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      case TokenType.Number:
        return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;
      case TokenType.OpenParen:
        this.eat(); // eat opening paren
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesised expression. Expected closing parenthesis"
        ); // eat closing paren
        return value;
      default:
        console.log("Unexpected token found during parsing: ", this.at());
        process.exit(1);
        return {} as Stmt
    }
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }
}
