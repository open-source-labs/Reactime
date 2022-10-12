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

const JSXParser = acorn.Parser.extend(jsx());

/**
 * @method throttle
 * @param callback A function to throttle
 * @param ms A number of milliseconds to use as throttling interval
 * @returns A function that limits input function, `callback`, from being called more than once every `ms` milliseconds
 *
 */
export const throttle = (callback: Function, ms: number): Function => {
  // Initialize boolean flags for callback, throttledFunc
  let isOnCooldown = false;
  let isCallQueued = false;

  // Wrap the passed-in function callback in a callback function that "throttles"
  // (puts a limit on) the number of calls that can be made to function
  // in a given period of time (ms)
  const throttledFunc = (): any => {
    // CASE 1: In cooldown mode and we already have a function waiting to be executed,
    //         so do nothing
    if (isOnCooldown && isCallQueued) return;

    // CASE 2: In cooldown mode, but we have no functions waiting to be executed,
    //         so just make note that we now have a call waiting to be executed and return
    if (isOnCooldown) {
      isCallQueued = true;
      return;
    }

    // CASE 3: If we are ready to "fire":
    // Execute the function callback immediately
    callback();
    // Initiate a new cooldown period and reset the "call queue"
    isOnCooldown = true;
    isCallQueued = false;

    // Declare a function that checks whether we have
    // another function to be executed right after.
    const runAfterTimeout = (): any => {
      if (isCallQueued) {
        isCallQueued = false;
        isOnCooldown = true;
        callback();
        setTimeout(runAfterTimeout, ms);
        return;
      }
      isOnCooldown = false;
    };

    setTimeout(runAfterTimeout, ms);
  };

  return throttledFunc;
};

// Helper function to grab the getters/setters from `elementType`
/**
 * @method getHooksNames
 * @param elementType The fiber `type`, A stringified function of the component, the Fiber whose hooks we want corresponds to
 * @returns An array of strings
 */
export const getHooksNames = (elementType: string): Array<string> => {
  // Initialize empty object to store the setters and getter
  let ast: any;
  try {
    ast = JSXParser.parse(elementType);
  } catch (e) {
    return ['unknown'];
  }

  // hookNames will contain an object with methods (functions)
  const hooksNames: any = {};

  // Begin search for hook names, only if ast has a body property.
  while (Object.hasOwnProperty.call(ast, 'body')) {
    let tsCount = 0; // Counter for the number of TypeScript hooks seen (to distinguish in masterState)
    ast = ast.body;

    // Statements get all the names of the hooks. For example: useCount, useWildcard, ...
    const statements: Array<string> = [];
    /** All module exports always start off as a single 'FunctionDeclaration' type
     * Other types: "BlockStatement" / "ExpressionStatement" / "ReturnStatement"
     * Iterate through AST of every function declaration
     * Check within each function declaration if there are hook declarations */
    ast.forEach(functionDec => {
      let declarationBody: any;
      if (functionDec.expression && functionDec.expression.body) declarationBody = functionDec.expression.body.body; // check if functionDec.expression.body exists, then set declarationBody to functionDec's body
      else declarationBody = functionDec.body ? functionDec.body.body : [];
      // Traverse through the function's funcDecs and Expression Statements
      declarationBody.forEach((elem: any) => {
        // Hooks will always be contained in a variable declaration
        if (elem.type === 'VariableDeclaration') {
          elem.declarations.forEach((hook: any) => {
            // Parse destructured statements pair
            if (hook.id.type === 'ArrayPattern') {
              hook.id.elements.forEach(hook => {
                statements.push(`_useWildcard${tsCount}`);
                statements.push(hook.name);
                tsCount += 1;
              });
              // Process hook function invocation ?
            } else {
              // hook.init.object is '_useState2', '_useState4', etc.
              // eslint-disable-next-line no-lonely-if
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
    return Object.values(hooksNames);
  }
};
