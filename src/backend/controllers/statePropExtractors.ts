import { parse } from '@babel/parser';
import { Node, CallExpression, MemberExpression, Identifier } from '@babel/types';
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
      // Check if this is a reducer hook by looking at the lastRenderedReducer
      const isReducer = memoizedState.queue.lastRenderedReducer?.name !== 'basicStateReducer';

      if (isReducer) {
        // For useReducer hooks, we want to store:
        // 1. The current state
        // 2. The last action that was dispatched (if available)
        // 3. The reducer function itself
        hooksStates.push({
          component: memoizedState.queue,
          state: memoizedState.memoizedState,
          isReducer: true,
          lastAction: memoizedState.queue.lastRenderedAction || null,
          reducer: memoizedState.queue.lastRenderedReducer || null,
        });
      } else {
        // Regular useState hook
        hooksStates.push({
          component: memoizedState.queue,
          state: memoizedState.memoizedState,
          isReducer: false,
        });
      }
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
  try {
    const AST = parse(elementType, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const statements: { hookName: string; varName: string }[] = [];

    const isIdentifierWithName = (node: any, name: string): boolean => {
      return node?.type === 'Identifier' && node.name === name;
    };

    const processArrayPattern = (pattern: any): { setter: string; getter: string } | null => {
      if (pattern.type === 'ArrayPattern' && pattern.elements.length === 2) {
        const result = {
          getter: pattern.elements[0].name,
          setter: pattern.elements[1].name,
        };
        return result;
      }
      return null;
    };

    const extractReducerName = (node: any): string | null => {
      if (node.type === 'Identifier') {
        return node.name;
      }

      if (node.type === 'ArrowFunctionExpression' && node.body.type === 'CallExpression') {
        if (node.body.callee.type === 'Identifier') {
          return node.body.callee.name;
        }
      }

      return null;
    };

    function traverse(node: Node) {
      if (!node) return;

      if (node.type === 'VariableDeclaration') {
        node.declarations.forEach((declaration) => {
          if (declaration.init?.type === 'CallExpression') {
            // Check for Webpack transformed pattern
            const isWebpackPattern =
              declaration.init.callee?.type === 'SequenceExpression' &&
              declaration.init.callee.expressions?.[1]?.type === 'MemberExpression';

            // Get the hook name for Webpack pattern
            let webpackHookName: string | null = null;
            if (isWebpackPattern && declaration.init.callee?.type === 'SequenceExpression') {
              const memberExpr = declaration.init.callee.expressions[1] as any;
              if (memberExpr?.property?.type === 'Identifier') {
                webpackHookName = memberExpr.property.name;
              }
            }

            // Check for direct pattern
            const directCallee = declaration.init.callee as any;
            const isDirectPattern =
              directCallee?.type === 'Identifier' &&
              (directCallee.name === 'useState' || directCallee.name === 'useReducer');

            // Check for namespaced pattern
            const isNamespacedPattern =
              declaration.init.callee?.type === 'MemberExpression' &&
              (declaration.init.callee as any).property?.type === 'Identifier' &&
              ((declaration.init.callee as any).property.name === 'useState' ||
                (declaration.init.callee as any).property.name === 'useReducer');

            if (isWebpackPattern || isDirectPattern || isNamespacedPattern) {
              const arrayPattern = processArrayPattern(declaration.id);
              if (arrayPattern) {
                const isReducer =
                  webpackHookName === 'useReducer' ||
                  (isDirectPattern && directCallee?.name === 'useReducer') ||
                  (isNamespacedPattern &&
                    (declaration.init.callee as any).property?.name === 'useReducer');

                if (isReducer) {
                  // Handle useReducer
                  if (declaration.init.arguments?.length > 0) {
                    const reducerName = extractReducerName(declaration.init.arguments[0]);
                    if (reducerName) {
                      statements.push({
                        hookName: reducerName,
                        varName: arrayPattern.getter,
                      });
                    }
                  }
                } else {
                  // Handle useState
                  statements.push({
                    hookName: arrayPattern.setter,
                    varName: arrayPattern.getter,
                  });
                }
              }
            }
          }
        });
      }

      // Recursively traverse
      for (const key in node) {
        if (node[key] && typeof node[key] === 'object') {
          if (Array.isArray(node[key])) {
            node[key].forEach((child: Node) => traverse(child));
          } else {
            traverse(node[key] as Node);
          }
        }
      }
    }

    traverse(AST);
    return statements;
  } catch (err) {
    console.error('AST Parsing Error:', err);
    throw new Error('getHooksNameError: ' + err.message);
  }
}
