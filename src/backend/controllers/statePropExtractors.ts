const acorn = require('acorn');
const jsx = require('acorn-jsx');
const JSXParser = acorn.Parser.extend(jsx());
import { HookStateItem, Fiber } from '../types/backendTypes';
import { exclude } from '../models/filterConditions';

type ReactimeData = {
  [key: string]: any;
};
// ------------FILTER DATA FROM REACT DEV TOOL && CONVERT TO STRING-------------
/**
 * This function receives raw Data from REACT DEV TOOL and filter the Data based on the exclude list. The filterd data is then converted to string (if applicable) before being sent to reacTime front end.
 * NOTE: the formating is important since Chrome will only accept JSON.stringfiable object. Circular object & function are not JSON stringifiable.
 *
 * @param reactDevData - The data object obtained from React Devtool. Ex: memoizedProps, memoizedState
 * @param reactimeData - The cached data from the current component. This can be data about states, context and/or props of the component.
 * @returns The update component data object to send to front end of ReactTime
 */
export function filterAndFormatData(
  reactDevData: { [key: string]: any },
  reactimeData: ReactimeData = {},
): ReactimeData {
  for (const key in reactDevData) {
    try {
      // If key is in exclude set or if there is no value at key, skip
      if (exclude.has(key) || reactDevData[key] === undefined) {
        continue;
      }
      // If value at key is a function, assign key with value 'function' to reactimeData object
      else if (typeof reactDevData[key] === 'function') {
        reactimeData[key] = 'function';
      }
      // If value at key is an object/array and not null => JSON stringify the value
      else if (typeof reactDevData[key] === 'object' && reactDevData[key] !== null) {
        reactimeData[key] = JSON.stringify(reactDevData[key]);
      }
      // Else assign the primitive value
      else {
        reactimeData[key] = reactDevData[key];
      }
    } catch (err) {
      // COMMENT OUT TO AVOID PRINTTING ON THE CONSOLE OF USER - KEEP IT FOR DEBUGGING PURPOSE
      // console.log({
      //   Message: 'Error in createTree during obtaining props information',
      //   potentialRootCause: 'circular component/failed during JSON stringify',
      //   reactDevData,
      //   key,
      //   err,
      // });
      // we will skip any props that cause an error
      continue;
    }
  }
  return reactimeData;
}

// ----------------------GET HOOK STATE AND DISPATCH METHOD---------------------
/**
 * Helper function to:
 * - traverse through memoizedState
 * - extract the state data & the dispatch method, which is stored in memoizedState.queue.
 *
 * During time jump, dispatch method will be used to re-render historical state.
 * @param memoizedState - The current state of the component associated with the current Fiber node.
 * @return An array of array of HookStateItem objects
 *
 */
export function getHooksStateAndUpdateMethod(
  memoizedState: Fiber['memoizedState'],
): Array<HookStateItem> {
  const hooksStates: Array<HookStateItem> = [];
  while (memoizedState) {
    if (memoizedState.queue) {
      hooksStates.push({
        component: memoizedState.queue,
        state: memoizedState.memoizedState,
      });
    }
    memoizedState = memoizedState.next;
  }
  return hooksStates;
}

// ---------------------GET STATE VAR NAME & HOOK NAME--------------------------
/**
 * This function receive a string representation of a functional component. 
 * This function then uses JSX parser to traverse through the function string, 
 * and extract the state variable name and its corresponding setState method.
 * @param elementType - The string representation of a functional component
 * @returns - An array of objects with key: hookName (the name of setState method) | value: varName (the state variable name)
 */
export function getHooksNames(elementType: string): { hookName: string; varName: string }[] {
  // Initialize empty object to store the setters and getter
  // Abstract Syntax Tree
  let AST: any;
  try {
    AST = JSXParser.parse(elementType).body;
    console.log('AST');
    console.log(AST);
    let count = 0;
    // Begin search for hook names, only if ast has a body property.
    // Statements get all the names of the hooks. For example: useCount, useWildcard, ...
    const statements: { hookName: string; varName: string }[] = [];
    /** All module exports always start off as a single 'FunctionDeclaration' type
     * Other types: "BlockStatement" / "ExpressionStatement" / "ReturnStatement"
     * Iterate through AST of every function(al component) declaration
     * Check within each function(al component) declaration if there are hook declarations & variable name declaration */
    AST.forEach((functionDec: any) => {
      // console.log('functionDec');
      // console.log(functionDec);
      let declarationBody: any;
      if (functionDec.expression?.body) declarationBody = functionDec.expression.body.body;
      // check if functionDec.expression.body exists, then set declarationBody to functionDec's body
      else declarationBody = functionDec.body?.body ?? [];
      // Traverse through the function's funcDecs and Expression Statements
      console.log('declarationBody');
      console.log( declarationBody);
      declarationBody.forEach((elem: any) => {
        // Hooks will always be contained in a variable declaration
        console.log('elem type:', count++, elem.type);
        console.log(elem);

        if (elem.type === 'VariableDeclaration') {
          // Obtain the declarations array from elem.
          const { declarations } = elem;
          // Obtain the reactHook:
          // Due to difference in babel transpilation in browser vs for jest test, expression is stored in differen location
          console.log('Found variable declaration, elem declarations:', declarations)
          // console.log('dec[0]', declarations[0]);
          // console.log('init',declarations[0]?.init);
          // console.log('callee',declarations[0]?.init?.callee);
          // console.log('expressions', declarations[0]?.init?.callee?.expressions);
          // console.log('Line 2!');
          // console.log('args', declarations[0]?.init?.arguments);
          // console.log('args[0]', declarations[0]?.init?.arguments?.arguments[0]);
          // console.log('callee', declarations[0]?.init?.arguments?.arguments[0]?.callee);
          // console.log('expression', declarations[0]?.init?.arguments?.arguments[0]?.callee?.expressions);
          const expression =
            declarations[0]?.init?.callee?.expressions || //work for browser
            //Mark's notes: so this was where the app was breaking. ES6 functions (e.g. const handleClick = () => {}) inside functional components were hitting this line and crashing when it tried to access arguments[0] and arguments didn't exist.
            declarations[0]?.init?.arguments?.[0]?.callee?.expressions; //work for jest test; 

          console.log('looked for expression, found:', expression);
          //Mark's Note: for a functional definition that isn't a hook, it won't have the callee being searched for above. This line will cause this forEach execution to stop here in this case.
          if (expression === undefined) return; 
          let reactHook: string;
          reactHook = expression[1].property?.name;
          if (reactHook === 'useState') {
            // Obtain the variable being set:
            //Mark's note: changed to point to second to last element of declarations because webpack adds an extra variable when converting files that use ES6, so the previous pointer wasn't working for this case
            let varName: string =
              declarations[declarations.length - 2]?.id?.name || // work react application; 
              (Array.isArray(declarations[0]?.id?.elements)
                ? declarations[0]?.id?.elements[0]?.name
                : undefined); //work for nextJS application
            // Obtain the setState method:
            //Mark's note: changed to point to last element of declarations because webpack adds an extra variable when converting files that use ES6, so the previous pointer wasn't working for this case
            let hookName: string =
              declarations[declarations.length - 1]?.id?.name || // work react application; 
              (Array.isArray(declarations[0]?.id?.elements)
                ? declarations[0]?.id?.elements[0]?.name
                : undefined); //work for nextJS & Remix
            // Push reactHook & varName to statements array
            /**
             * Mark's notes, I'd like to alter the structure of the data
             * to pass on the reactHook 'useState'. That way the user will 
             * eventually be able to view the difference between variables
             * stored via useState and useContext
             */
            statements.push({ hookName, varName });
          }
        }
      });
    });
    return statements;
  } catch (err) {
    throw new Error('getHooksNameError' + err.message);
  }
}
