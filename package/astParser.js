const acorn = require('acorn');
const jsx = require('acorn-jsx');

const JSXParser = acorn.Parser.extend(jsx());

const hookState = {};

module.exports = jsFile => {
  // console.log('ast inside', jsFile);
  const ast = JSXParser.parse(jsFile).body;
  // Iterating through AST of every function declaration
  ast.forEach(astFuncDec => {
    // Checking within each function declaration if there are hook declarations
    // console.log('App.js', astFuncDec.body.body);
    const fd = astFuncDec.body.body;
    // console.log(astFuncDec.body.body);
    // Traversing through the function's funcDecs and Expression Statements
    const allVarDeclarations = [];
    fd.forEach(astProgramBody => {
      if (astProgramBody.type === 'VariableDeclaration') {
        astProgramBody.declarations.forEach(declarations => {
          allVarDeclarations.push(declarations.id.name);
        });
      }
    });
    // console.log(allVarDeclarations);
    // Iterate through the array
    for (let varDec = 0; varDec < allVarDeclarations.length; varDec += 1) {
      // Determine getter/setters based on pattern
      if (allVarDeclarations[varDec].match(/_useState/)) {
        // Map the 4 elements together
        hookState[allVarDeclarations[varDec]] = allVarDeclarations[varDec + 2];
        // hookState[allVarDeclarations[varDec + 1]] = allVarDeclarations[varDec + 2];
      }
    }
  });
  return hookState;
};
