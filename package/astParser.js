const acorn = require('acorn');
const jsx = require('acorn-jsx');

const JSXParser = acorn.Parser.extend(jsx());

const hookState = {};

function getHookNames()

module.exports = file => {
  // Initialize empty object to store the setters and getter
  let ast = JSXParser.parse(file);
  while (Object.hasOwnProperty.call(ast, 'body')) {
    // All module exports will always start off as a single 'FunctionDeclaration' type
    // Traverse down .body once before invoking parsing logic and will loop through any .body after
    ast = ast.body;
    console.log('AST Tree', ast);
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
  // Return the object with setters and getters
  return hookState;
};
