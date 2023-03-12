/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable linebreak-style */
/* eslint-disable no-inner-declarations, no-loop-func */

import { string } from 'prop-types';

// eslint-disable-next-line import/newline-after-import
const acorn = require('acorn');
const jsx = require('acorn-jsx');

const JSXParser = acorn.Parser.extend(jsx());

/**
 * @method throttle
 * @param callback A function to throttle
 * @param MIN_TIME_BETWEEN_UPDATE A number of milliseconds to use as throttling interval
 * @returns A function that limits input function, `callback`, from being called more than once every `MIN_TIME_BETWEEN_UPDATE` milliseconds
 *
 */
export const throttle = (
  callback: (...args: any) => void,
  MIN_TIME_BETWEEN_UPDATE: number,
): Function => {
  // Initialize boolean flags for callback, throttledFunc
  /**
   * A boolean variable tracking if MIN_TIME_BETWEEN_UPDATE has passed
   *
   * This value turns TRUE after a callback function is invoked. While this value is true, no additional callback function can be invoked.
   *
   * This value turns FALSE after MIN_TIME_BETWEEN_UPDATE has passed => additional callback can now be invoked.
   *
   * @default false
   */
  let isOnCooldown = false;
  /**
   * A boolean variable tracking if there is a request to invoke the callback in the queue.
   *
   * This value turns TRUE if a request to invoke the callback is sent before the MIN_TIME_BETWEEN_UPDATE passes.
   *
   * This value turns FALSE after the callback is invoked.
   *
   * @default false
   *
   */
  let isCallQueued = false;

  let timeout: NodeJS.Timeout;
  // Wrap the passed-in function callback in a callback function that "throttles" (puts a limit on) the number of calls that can be made to function in a given period of time (ms)
  return function throttledFunc(...args: Parameters<typeof callback>) {
    // CASE 1: In cooldown mode and we already have a function waiting to be executed, so do nothing
    if (isOnCooldown && isCallQueued) return;

    // CASE 2: In cooldown mode, but we have no functions waiting to be executed, so just make note that we now have a call waiting to be executed and return
    if (isOnCooldown) {
      isCallQueued = true;
      return;
    }

    // CASE 3: If we are ready to "fire":
    // Execute the function callback immediately
    callback(...args);
    // Initiate a new cooldown period and reset the "call queue"
    isOnCooldown = true;
    isCallQueued = false;
    // Set timeout to end the cooldown period after MIN_TIME_BETWEEN_UPDATE has passed
    clearTimeout(timeout);
    timeout = setTimeout(runAfterTimeout, MIN_TIME_BETWEEN_UPDATE);

    /**
     * @function runAfterTimeout - a function that end the cooldown mode & checks whether we have another function to be executed right after.
     * @returns void
     */
    function runAfterTimeout() {
      // If there is callback in the queue
      if (isCallQueued) {
        // Execute the function callback immediately
        callback(...args);
        // Initiate a new cooldown period and reset the "call queue"
        isOnCooldown = true;
        isCallQueued = false;
        // End the cooldown period after MIN_TIME_BETWEEN_UPDATE
        clearTimeout(timeout);
        setTimeout(runAfterTimeout, MIN_TIME_BETWEEN_UPDATE);
      }
      // If not callback in queue, end the cooldown period
      else {
        // End cooldown period after MIN_TIME_BETWEEN_UPDATE has passed
        isOnCooldown = false;
      }
    }
  };
};

export const getHooksNames = (
  elementType: string,
): { hookName: string; varName: string }[] | undefined => {
  // Initialize empty object to store the setters and getter
  let AST: any;
  try {
    AST = JSXParser.parse(elementType);
  } catch (e) {
    throw Error('Error occurs at helpers getHooksName.ts Cannot parse functional component.');
  }
  // Begin search for hook names, only if ast has a body property.

  AST = AST.body;

  // Statements get all the names of the hooks. For example: useCount, useWildcard, ...
  const statements: { hookName: string; varName: string }[] = [];
  /** All module exports always start off as a single 'FunctionDeclaration' type
   * Other types: "BlockStatement" / "ExpressionStatement" / "ReturnStatement"
   * Iterate through AST of every function declaration
   * Check within each function declaration if there are hook declarations & variable name declaration */
  AST.forEach((functionDec: any) => {
    let declarationBody: any;
    if (functionDec.expression?.body) declarationBody = functionDec.expression.body.body;
    // check if functionDec.expression.body exists, then set declarationBody to functionDec's body
    else declarationBody = functionDec.body?.body ?? [];
    // Traverse through the function's funcDecs and Expression Statements
    declarationBody.forEach((elem: any) => {
      // Hooks will always be contained in a variable declaration
      if (elem.type === 'VariableDeclaration') {
        // Obtain the declarations array from elem.
        const { declarations } = elem;
        // Obtain the reactHook:
        const reactHook: string = declarations[0]?.init?.callee?.expressions[1]?.property?.name;
        if (reactHook === 'useState') {
          // Obtain the variable being set:
          let varName: string = declarations[1]?.id?.name;
          // Obtain the setState method:
          let hookName: string = declarations[2]?.id?.name;
          // Push reactHook & varName to statements array
          statements.push({ hookName, varName });
        }
      }
    });
  });
  return statements;
};

// DEPERACATED: After React DEV Tool Update. This function no longer works. Keep for history record
// // Helper function to grab the getters/setters from `elementType`
// /**
//  * @method getHooksNames
//  * @param elementType The fiber `type`, A stringified function of the component, the Fiber whose hooks we want corresponds to
//  * @returns An array of strings
//  */
// // TODO: this function has return at the end of loop? Is this intentional?
// export const getHooksNames = (elementType: string): Array<string> | undefined => {
//   // Initialize empty object to store the setters and getter
//   let ast: any;
//   try {
//     ast = JSXParser.parse(elementType);
//   } catch (e) {
//     return ['unknown'];
//   }
//   // hookNames will contain an object with methods (functions)
//   const hooksNames: any = {};

//   // Begin search for hook names, only if ast has a body property.
//   while (Object.hasOwnProperty.call(ast, 'body')) {
//     let tsCount = 0; // Counter for the number of TypeScript hooks seen (to distinguish in masterState)
//     ast = ast.body;

//     // Statements get all the names of the hooks. For example: useCount, useWildcard, ...
//     const statements: Array<string> = [];
//     /** All module exports always start off as a single 'FunctionDeclaration' type
//      * Other types: "BlockStatement" / "ExpressionStatement" / "ReturnStatement"
//      * Iterate through AST of every function declaration
//      * Check within each function declaration if there are hook declarations */
//     ast.forEach((functionDec: any) => {
//       let declarationBody: any;
//       if (functionDec.expression?.body) declarationBody = functionDec.expression.body.body;
//       // check if functionDec.expression.body exists, then set declarationBody to functionDec's body
//       else declarationBody = functionDec.body?.body ?? [];
//       // Traverse through the function's funcDecs and Expression Statements
//       declarationBody.forEach((elem: any) => {
//         // Hooks will always be contained in a variable declaration
//         if (elem.type === 'VariableDeclaration') {
//           elem.declarations.forEach((hook: any) => {
//             // Parse destructured statements pair
//             if (hook.id.type === 'ArrayPattern') {
//               hook.id.elements.forEach((hook: any) => {
//                 statements.push(`_useWildcard${tsCount}`);
//                 statements.push(hook.name);
//                 tsCount += 1;
//               });
//               // Process hook function invocation ?
//             } else {
//               // hook.init.object is '_useState2', '_useState4', etc.
//               // eslint-disable-next-line no-lonely-if
//               if (hook?.init?.object?.name) {
//                 const varName: any = hook.init.object.name;
//                 if (!hooksNames[varName] && varName.match(/_use/)) {
//                   hooksNames[varName] = hook.id.name;
//                 }
//               }
//               if (hook.id.name !== undefined) {
//                 statements.push(hook.id.name);
//               }
//             }
//           });
//         }
//       });
//       statements.forEach((el, i) => {
//         if (el.match(/_use/)) hooksNames[el] = statements[i + 1];
//       });
//     });
//     return Object.values(hooksNames);
//   }
// };
