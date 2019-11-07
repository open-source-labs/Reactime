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
  // All module exports will always start off as a single 'FunctionDeclaration' type
  while (Object.hasOwnProperty.call(ast, 'body')) {
    // Traverse down .body once before invoking parsing logic and will loop through any .body after
    ast = ast.body;
    const statements = [];

    function stMent(st) {
      st.forEach((el, i) => {
        if (el.match(/_use/)) hookState[el] = statements[i + 2];
      });
    }

    function hookDeclare(astVal) {
      astVal.forEach(elem => {
        if (elem.type === 'VariableDeclaration') {
          elem.declarations.forEach(decClar => {
            statements.push(decClar.id.name);
          });
        }
      });
    }

    // handle useState useContext
    if (ast[0].expression.body.body) {
      ast = ast[0].expression.body.body;
      // Hook Declarations will only be under 'VariableDeclaration' type
      hookDeclare(ast);
      // Iterate array and determine getter/setters based on pattern
      stMent(statements); // add key-value to hookState
    } else {
      // Iterate through AST of every function declaration
      // Check within each function declaration if there are hook declarations
      ast.forEach(functionDec => {
        const { body } = functionDec.body;
        // Traverse through the function's funcDecs and Expression Statements
        hookDeclare(body);
        // Iterate array and determine getter/setters based on pattern
        stMent(statements); // add key-value to hookState
      });
    }
  }
  return hookState;
};
