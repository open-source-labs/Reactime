/* eslint-disable no-inner-declarations */
const acorn = require('acorn'); // javascript parser
// eslint-disable-next-line import/newline-after-import
const jsx = require('acorn-jsx');
const JSXParser = acorn.Parser.extend(jsx());

// Helper function to grab the getters/setters from `elementType`
module.exports = elementType => {
  // Initialize empty object to store the setters and getter
  let ast = JSXParser.parse(elementType);
  const hookState = {};

  while (Object.hasOwnProperty.call(ast, 'body')) {
    ast = ast.body;
    const statements = [];

    /** All module exports always start off as a single 'FunctionDeclaration' type
     * Other types: "BlockStatement" / "ExpressionStatement" / "ReturnStatement"
     * Iterate through AST of every function declaration
     * Check within each function declaration if there are hook declarations */
    ast.forEach(functionDec => {
      let body;
      if (functionDec.expression) body = functionDec.expression.body.body;
      else body = functionDec.body.body;
      // Traverse through the function's funcDecs and Expression Statements
      body.forEach(elem => {
        if (elem.type === 'VariableDeclaration') {
          elem.declarations.forEach(hook => {
            statements.push(hook.id.name);
          });
        }
      });

      // Iterate array and determine getter/setters based on pattern
      statements.forEach((el, i) => {
        if (el.match(/_use/)) hookState[el] = statements[i + 2];
      });
    });
  }
  return hookState;
};
