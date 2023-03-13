const acorn = require('acorn');
const jsx = require('acorn-jsx');
const JSXParser = acorn.Parser.extend(jsx());
import {
  // array of state and component
  HookStates,
  // object with tree structure
  Fiber,
} from '../../types/backendTypes';
// TODO: Determine what Component Data Type we are sending back for state, context, & props
type ReactimeData = {
  [key: string]: any;
};
/**
 * A set of excluded props and variable name
 */
const exclude = new Set([
  'alternate',
  'basename',
  'baseQueue',
  'baseState',
  'child',
  'childLanes',
  'children',
  'Consumer',
  'context',
  'create',
  'deps',
  'dependencies',
  'destroy',
  'dispatch',
  'location',
  'effects',
  'element',
  'elementType',
  'firstBaseUpdate',
  'firstEffect',
  'flags',
  'get key',
  'getState',
  'hash',
  'key',
  'lanes',
  'lastBaseUpdate',
  'lastEffect',
  'liftedStore',
  'navigator',
  'memoizedState',
  'mode',
  'navigationType',
  'next',
  'nextEffect',
  'pending',
  'parentSub',
  'pathnameBase',
  'pendingProps',
  'Provider',
  'updateQueue',
  'ref',
  'replaceReducer',
  'responders',
  'return',
  'route',
  'routeContext',
  'search',
  'shared',
  'sibling',
  'state',
  'store',
  'subscribe',
  'subscription',
  'stateNode',
  'tag',
  'type',
  '_calculateChangedBits',
  '_context',
  '_currentRenderer',
  '_currentRenderer2',
  '_currentValue',
  '_currentValue2',
  '_owner',
  '_self',
  '_source',
  '_store',
  '_threadCount',
  '$$typeof',
  '@@observable',
]);
// ------------FILTER DATA FROM REACT DEV TOOL && CONVERT TO STRING-------------
/**
 * This function receives raw Data from REACT DEV TOOL and filter the Data based on the exclude list. The filterd data is then converted to string (if applicable) before being sent to reacTime front end.
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
      // Skip keys that are in exclude set OR if there is no value at key
      // Falsy values such as 0, false, null are still valid value
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
      console.log('linkFiber', { reactDevData, key });
      throw Error(`Error caught at converDataToString: ${err}`);
    }
  }
  return reactimeData;
}
// ------------------------FILTER STATE & CONTEXT DATA--------------------------
/**
 * This function is used to filter the state data of a component.
 * All propperty name that are in the central `exclude` list would be filtered out.
 * If passed in memoizedState is a not an object (a.k.a a primitive type), a default name would be provided.
 * @param memoizedState - The current state of the component associated with the current Fiber node.
 * @param _debugHookTypes - An array of hooks used for debugging purposes.
 * @param componentName - Name of the evaluated component
 * @returns - The updated state data object to send to front end of ReactTime
 */
export function getStateAndContextData(
  memoizedState: Fiber['memoizedState'],
  componentName: string,
  _debugHookTypes: Fiber['_debugHookTypes'],
) {
  // Initialize a list of componentName that would not be evaluated for State Data:
  const ignoreComponent = new Set(['BrowserRouter', 'Router']);
  if (ignoreComponent.has(componentName)) return;

  // Initialize object to store state and context data of the component
  const reactimeData: ReactimeData = {};
  // Initialize counter for the default naming. If user use reactHook, such as useState, react will only pass in the value, and not the variable name of the state.
  let stateCounter = 1;
  let refCounter = 1;

  // Loop through each hook inside the _debugHookTypes array.
  // NOTE: _debugHookTypes.length === height of memoizedState tree.
  for (const hook of _debugHookTypes) {
    // useContext does not create any state => skip
    if (hook === 'useContext') {
      continue;
    }
    // If user use useState reactHook => React will only pass in the value of state & not the name of the state => create a default name:
    else if (hook === 'useState') {
      const defaultName = `State ${stateCounter}`;
      reactimeData[defaultName] = memoizedState.memoizedState;
      stateCounter++;
    }
    // If user use useRef reactHook => React will store memoizedState in current object:
    else if (hook === 'useRef') {
      const defaultName = `Ref ${refCounter}`;
      reactimeData[defaultName] = memoizedState.memoizedState.current;
      refCounter++;
    }
    // If user use Redux to contain their context => the context object will be stored using useMemo Hook, as of for Rect Dev Tool v4.27.2
    // Note: Provider is not a reserved component name for redux. User may name their component as Provider, which will break this logic. However, it is a good assumption that if user have a custom provider component, it would have a more specific naming such as ThemeProvider.
    else if (hook === 'useMemo' && componentName === 'Provider') {
      filterAndFormatData(memoizedState.memoizedState[0], reactimeData);
    }
    //Move on to the next level of memoizedState tree.
    memoizedState = memoizedState?.next;
  }
  // Return the updated state data object to send to front end of ReactTime
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
export function getHooksStateAndUpdateMethod(memoizedState: Fiber['memoizedState']): HookStates {
  const hooksStates: HookStates = [];
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
 * This function receive a string representation of a functional component. This function then use JSX parser to traverse through the function string, and extract the state variable name and its corresponding setState method.
 * @param elementType - The string representation of a functional component
 * @returns - An array of objects with key: hookName (the name of setState method) | value: varName (the state variable name)
 */
export function getHooksNames(elementType: string): { hookName: string; varName: string }[] {
  // Initialize empty object to store the setters and getter
  let AST: any;
  try {
    AST = JSXParser.parse(elementType);
  } catch (e) {
    console.log('This component was not converted', { elementType });
    throw Error('Error occurs at helpers getHooksName.ts Cannot parse functional component.');
    return;
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
}

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
