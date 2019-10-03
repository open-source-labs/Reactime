const acorn = require('acorn');
// eslint-disable-next-line import/newline-after-import
const jsx = require('acorn-jsx');
const JSXParser = acorn.Parser.extend(jsx());

// Helper function to grab the getters/setters from `elementType`
module.exports = elementType => {
  // Initialize empty object to store the setters and getter
  let ast = JSXParser.parse(elementType);
  const hookState = {};
  // All module exports will always start off as a single 'FunctionDeclaration' type
  while (Object.hasOwnProperty.call(ast, 'body')) {
    // Traverse down .body once before invoking parsing logic and will loop through any .body after
    ast = ast.body;
    // Iterate through AST of every function declaration
    // Check within each function declaration if there are hook declarations
    ast.forEach(functionDec => {
      const { body } = functionDec.body;
      const statements = [];
      // Traverse through the function's funcDecs and Expression Statements
      body.forEach(program => {
        // Hook Declarations will only be under 'VariableDeclaration' type
        if (program.type === 'VariableDeclaration') {
          program.declarations.forEach(dec => {
            statements.push(dec.id.name);
          });
        }
      });
      // Iterate through the array and determine getter/setters based on pattern
      for (let i = 0; i < statements.length; i += 1) {
        if (statements[i].match(/_use/)) {
          hookState[statements[i]] = statements[i + 2];
        }
      }
    });
  }
  return hookState;
};
