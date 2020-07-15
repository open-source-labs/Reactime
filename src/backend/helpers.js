/* eslint-disable linebreak-style */
/* eslint-disable no-inner-declarations, no-loop-func */
// eslint-disable-next-line import/newline-after-import
const acorn = require('acorn');
const jsx = require('acorn-jsx');
// import { acorn } from 'acorn'; // javascript parser
// import { jsx } from 'acorn-jsx';

const JSXParser = acorn.Parser.extend(jsx());

// Returns a throttled version of an input function
// The returned throttled function only executes at most once every t milliseconds
export const throttle = (f, t) => {
  let isOnCooldown = false;
  let isCallQueued = false;
  const throttledFunc = () => {
    if (isOnCooldown && isCallQueued) return;
    if (isOnCooldown) {
      isCallQueued = true;
      console.log('snapshot update already queued');
      return;
    }
    console.log('no queue, updating snapshot from trigger func');
    f();
    isOnCooldown = true;
    isCallQueued = false;

    const runAfterTimeout = () => {
      if (isCallQueued) {
        isCallQueued = false;
        isOnCooldown = true; // not needed I think
        console.log('calling queued call');
        f();
        setTimeout(runAfterTimeout, t);
        return;
      }
      isOnCooldown = false;
    };
    console.log('queueing snapshot update');
    setTimeout(runAfterTimeout, t);
  };
  return throttledFunc;
};

// Helper function to grab the getters/setters from `elementType`
export const getHooksNames = elementType => {

  // Initialize empty object to store the setters and getter
  let ast = JSXParser.parse(elementType);
  const hookState = {};
  const hooksNames = {};

  while (Object.hasOwnProperty.call(ast, 'body')) {
    let tsCount = 0; // Counter for the number of TypeScript hooks seen (to distinguish in masterState)
    ast = ast.body;
    const statements = [];

    /** All module exports always start off as a single 'FunctionDeclaration' type
     * Other types: "BlockStatement" / "ExpressionStatement" / "ReturnStatement"
     * Iterate through AST of every function declaration
     * Check within each function declaration if there are hook declarations */
    ast.forEach(functionDec => {
      let body;
      if (functionDec.expression && functionDec.expression.body) body = functionDec.expression.body.body;
      else body = functionDec.body ? functionDec.body.body : [];
      // Traverse through the function's funcDecs and Expression Statements
      body.forEach(elem => {
        if (elem.type === 'VariableDeclaration') {
          elem.declarations.forEach(hook => {
            // * TypeScript hooks appear to have no "VariableDeclarator"
            // * with id.name of _useState, _useState2, etc...
            // * hook.id.type relevant for TypeScript applications
            // *
            // * Works for useState hooks
            if (hook.id.type === 'ArrayPattern') {
              hook.id.elements.forEach(hook => {
                statements.push(hook.name);
                // * Unshift a wildcard name to achieve similar functionality as before
                statements.unshift(`_useWildcard${tsCount}`);
                tsCount += 1;
              });
            } else {
              if (hook.init.object && hook.init.object.name) {
                const varName = hook.init.object.name;
                if (!hooksNames[varName] && varName.match(/_use/)) {
                  hooksNames[varName] = hook.id.name;
                }
              }
              statements.push(hook.id.name);
            }
          });
        }
      });

      // Iterate array and determine getter/setters based on pattern
      statements.forEach((el, i) => {
        if (el.match(/_use/)) hookState[el] = statements[i + 2];
      });
    });
  }
  return Object.values(hooksNames);
};
