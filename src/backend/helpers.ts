/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable linebreak-style */
/* eslint-disable no-inner-declarations, no-loop-func */
// eslint-disable-next-line import/newline-after-import
const acorn = require('acorn');
const jsx = require('acorn-jsx');
// import { acorn } from 'acorn'; // javascript parser
// import { jsx } from 'acorn-jsx';

const JSXParser = acorn.Parser.extend(jsx());

/**
 * @method throttle
 * @param f A function to throttle
 * @param t A number of milliseconds to use as throttling interval
 * @returns A function that limits input function, `f`, from being called more than once every `t` milliseconds
 */
export const throttle = (f: Function, t: number): Function => {
  let isOnCooldown: boolean = false;
  let isCallQueued: boolean = false;
  const throttledFunc = (): any => {
    if (isOnCooldown && isCallQueued) return;
    if (isOnCooldown) {
      isCallQueued = true;
      return;
    }
    f();
    isOnCooldown = true;
    isCallQueued = false;
    const runAfterTimeout = (): any => {
      if (isCallQueued) {
        isCallQueued = false;
        isOnCooldown = true; // not needed I think
        f();
        setTimeout(runAfterTimeout, t);
        return;
      }
      isOnCooldown = false;
    };
    setTimeout(runAfterTimeout, t);
  };
  return throttledFunc;
};

// Helper function to grab the getters/setters from `elementType`

/**
 * @method getHooksNames
 * @param elementType The fiber (whose hooks we want) `type`, A stringified function of the component the Fiber whose hooks we want corresponds to
 * @returns An array of strings 
 */
export const getHooksNames = (elementType: string): Array<string> => {
  // Initialize empty object to store the setters and getter
  let ast: any;
  try {
    ast = JSXParser.parse(elementType);
  } catch (e) {
    console.error(`getHooksNames ERROR: Failed to parse elementType string:\n${elementType}`);
    return ['unknown'];
  }

  const hooksNames: any = {};

  while (Object.hasOwnProperty.call(ast, 'body')) {
    let tsCount: number = 0; // Counter for the number of TypeScript hooks seen (to distinguish in masterState)
    ast = ast.body;
    const statements: Array<string> = [];

    /** All module exports always start off as a single 'FunctionDeclaration' type
     * Other types: "BlockStatement" / "ExpressionStatement" / "ReturnStatement"
     * Iterate through AST of every function declaration
     * Check within each function declaration if there are hook declarations */
    ast.forEach((functionDec) => {
      let body: any;
      if (functionDec.expression && functionDec.expression.body)
        body = functionDec.expression.body.body;
      else body = functionDec.body ? functionDec.body.body : [];
      // Traverse through the function's funcDecs and Expression Statements
      body.forEach((elem: any) => {
        if (elem.type === 'VariableDeclaration') {
          elem.declarations.forEach((hook: any) => {
            // * TypeScript hooks appear to have no "VariableDeclarator"
            // * with id.name of _useState, _useState2, etc...
            // * hook.id.type relevant for TypeScript applications
            // *
            // * Works for useState hooks
            if (hook.id.type === 'ArrayPattern') {
              hook.id.elements.forEach((hook) => {
                statements.push(`_useWildcard${tsCount}`);
                statements.push(hook.name);
                tsCount += 1;
              });
            } else {
              if (hook.init.object && hook.init.object.name) {
                const varName: any = hook.init.object.name;
                if (!hooksNames[varName] && varName.match(/_use/)) {
                  hooksNames[varName] = hook.id.name;
                }
              }
              if (hook.id.name !== undefined) {
                statements.push(hook.id.name);
              }
            }
          });
        }
      });
      statements.forEach((el, i) => {
        if (el.match(/_use/)) hooksNames[el] = statements[i + 1];
      });
    });
  }
  return Object.values(hooksNames);
};
