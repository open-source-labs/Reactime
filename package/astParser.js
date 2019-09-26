const acorn = require('acorn');
const jsx = require('acorn-jsx');
const JSXParser = acorn.Parser.extend(jsx());

// Helper function to recursively traverse through the user's codebase 
// INSERT HERE 

module.exports = file => {
  // Initialize empty object to store the setters and getter
  const hookState = {};
  const ast = JSXParser.parse(file).body;
  // Iterate through AST of every function declaration
  // Check within each function declaration if there are hook declarations
  ast.forEach(func => {
    const { body } = func.body; 
    const statements = [];
    // Traverse through the function's funcDecs and Expression Statements
    body.forEach(program => {
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
  // Return the object with setters and getters
  return hookState;
};
