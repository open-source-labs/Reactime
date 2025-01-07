// --------------------------START OF IMPORT------------------------------------
import {
  getHooksNames,
  getHooksStateAndUpdateMethod,
  // getStateAndContextData, //COMMENT OUT SINCE EXTRACTING CONTEXT IS STILL IN EXPERIMENT
  filterAndFormatData,
} from './statePropExtractors';

import { Fiber, ComponentData } from '../types/backendTypes';
import {
  FunctionComponent,
  ClassComponent,
  IndeterminateComponent,
  ContextProvider,
} from '../types/backendTypes';

import Tree from '../models/tree';
import componentActionsRecord from '../models/masterState';
import {
  nextJSDefaultComponent,
  remixDefaultComponents,
  allowedComponentTypes,
} from '../models/filterConditions';

// -------------------------CREATE TREE TO SEND TO FRONT END--------------------
/**
 * This is a function that runs after every Fiber commit using the following logic:
 * 1. Traverse from FiberRootNode
 * 2. Create an instance of custom Tree class
 * 3. Build a new state snapshot
 * Every time a state change is made in the accompanying app, the extension creates a Tree “snapshot” of the current state, and adds it to the current “cache” of snapshots in the extension
 * @param currentFiberNode A Fiber object
 * @return An instance of a Tree object
 */
// TODO: Not sure why the ritd need to be outside of the _createTree function. Want to put inside, but in case this need to be keep track for front end.
export default function createTree(currentFiberNode: Fiber): Tree {
  let rtidCounter: number = 0;
  return _createTree(currentFiberNode, new Tree('root', 'root'));

  /**
   * This is a helper function to recursively traverse the React Fiber Tree and craft the snapshot tree to send to front end
   * @param currentFiberNode A Fiber object
   * @param tree A Tree object, default initialized to an instance given 'root' and 'root'
   * @returns An instance of a Tree Object
   */
  function _createTree(currentFiberNode: Fiber, tree: Tree): Tree {
    // ------------------OBTAIN DATA FROM THE CURRENT FIBER NODE----------------
    // Destructure the current fiber node:
    const {
      sibling,
      stateNode,
      child,
      memoizedState,
      memoizedProps,
      elementType,
      key,
      tag,
      actualDuration,
      actualStartTime,
      selfBaseDuration,
      treeBaseDuration,
      // _debugHookTypes, //COMMENT OUT SINCE EXTRACTING CONTEXT IS STILL IN EXPERIMENT
    } = currentFiberNode;

    // Obtain component name:
    /** Name of the current component */
    let componentName: string =
      elementType?._context?.displayName || //For ContextProviders like Route, Navigation, Location
      (elementType?._context && 'ContextProvider') || //Mark's note: useContext providers weren't showing up the way listed in the line above, I actually couldn't find the name of the context provider on the react dev tools fiber tree.
      elementType?._result?.name || //For lazy Component
      elementType?.render?.name ||
      elementType?.name || //For Functional/Class Component
      'nameless';

    // --------------------FILTER COMPONENTS/FIBER NODE-------------------------
    /**
     * For the snapshot tree,
     * 1. We will only interested in components that are one of these types: Function Component, Class Component, Indeterminate Component or Context Provider.
     * NOTE: this list of components may change depending on future use
     * 2. If user use Next JS, filter out default NextJS components
     * 3. If user use Remix JS, filter out default Remix components
     */

    if (
      !allowedComponentTypes.has(tag) ||
      nextJSDefaultComponent.has(componentName) ||
      remixDefaultComponents.has(componentName)
    ) {
      // -------------------TRAVERSE TO NEXT FIBERNODE------------------------
      // If currentFiberNode has children, recurse on children
      if (child) _createTree(child, tree);

      // If currentFiberNode has siblings, recurse on siblings
      if (sibling) {
        _createTree(sibling, tree);
      }
      // ---------RETURN THE TREE OUTPUT & PASS TO FRONTEND FOR RENDERING-------
      return tree;
    }

    // --------------INITIALIZE OBJECT TO CONTAIN COMPONENT DATA---------------
    let newState: 'stateless' | object = 'stateless';
    let componentData: ComponentData = {
      actualDuration,
      actualStartTime,
      selfBaseDuration,
      treeBaseDuration,
      key,
      props: {},
      context: {},
      state: null,
      index: null,
      hooksState: null,
      hooksIndex: null,
    };

    // ---------------APPEND PROP DATA FROM REACT DEV TOOL----------------------
    // Check to see if the currentFiberNode has any props
    if (memoizedProps) {
      switch (elementType.name) {
        // If component comes from React Router, extract only pathname:
        case 'Router': {
          componentData.props = { pathname: memoizedProps?.location?.pathname };
          break;
        }
        case 'RenderedRoute': {
          componentData.props = { pathname: memoizedProps?.match?.pathname };
          break;
        }
        // For react-router components Route, Navigation, or Location, the elementType won't have a name property, so elementType.name will be undefined.
        // The following switch case will be entered and will pass limited info to these element's props, but if none of the
        // "if" statements are entered and a break statements isn't executed, the default case will still be entered
        case undefined: {
          if (elementType._context?.displayName === 'Route') {
            componentData.props = { pathname: memoizedProps?.value?.matches?.[0]?.pathname };
            break;
          }
          if (elementType._context?.displayName === 'Navigation') {
            componentData.props = { basename: memoizedProps?.value?.basename };
            break;
          }
          if (elementType._context?.displayName === 'Location') {
            componentData.props = { pathname: memoizedProps?.value?.location?.pathname };
            break;
          }
        }
        // Else filter & format props data to ensure they are JSON stringify-able, before sending to front end
        default: {
          componentData.props = filterAndFormatData(memoizedProps);
        }
      }
    }

    // COMMENT OUT SINCE EXTRACTING CONTEXT IS STILL IN EXPERIMENT
    // // ------------APPEND CONTEXT DATA FROM REACT DEV TOOL----------------
    // // memoizedState
    // // Note: if user use ReactHook, memoizedState.memoizedState can be a falsy value such as null, false, ... => need to specify this data is not undefined
    // if (
    //   (tag === FunctionComponent || tag === ClassComponent || tag === IndeterminateComponent) &&
    //   memoizedState?.memoizedState !== undefined
    // ) {
    //   // If user uses Redux, context data will be stored in memoizedState of the Provider component => grab context object stored in the memoizedState
    //   if (elementType.name === 'Provider') {
    //     Object.assign(
    //       componentData.context,
    //       getStateAndContextData(memoizedState, elementType.name, _debugHookTypes),
    //     );
    //   }
    //   // Else if user use ReactHook to define state => all states will be stored in memoizedState => grab all states stored in the memoizedState
    //   // else {
    //   //   Object.assign(
    //   //     componentData.state,
    //   //     getStateAndContextData(memoizedState, elementType.name, _debugHookTypes),
    //   //   );
    //   // }
    // }
    // // if user uses useContext hook, context data will be stored in memoizedProps.value of the Context.Provider component => grab context object stored in memoizedprops
    // // Different from other provider, such as Routes, BrowserRouter, ReactRedux, ..., Context.Provider does not have a displayName
    // // TODO: need to render this context provider when user use useContext hook.
    //
    //
    // if (tag === ContextProvider && !elementType._context.displayName) {
    //   let stateData = memoizedProps.value;
    //   if (stateData === null || typeof stateData !== 'object') {
    //     stateData = { CONTEXT: stateData };
    //   }
    //   componentData.context = filterAndFormatData(stateData);
    //   componentName = 'Context';
    // }

    // ---------OBTAIN STATE & SET STATE METHODS FROM CLASS COMPONENT-----------
    // Check if currentFiberNode is a stateful class component when user use setState.
    // If user use setState to define/manage state, the state object will be stored in stateNode.state => grab the state object stored in the stateNode.state
    // Example: for tic-tac-toe demo-app: Board is a stateful component that use setState to store state data.
    if ((tag === ClassComponent || tag === IndeterminateComponent) && stateNode?.state) {
      componentData.index = componentActionsRecord.saveNew(stateNode);
      componentData.state = stateNode.state;
      newState = componentData.state;
    }

    // --------OBTAIN STATE & DISPATCH METHODS FROM FUNCTIONAL COMPONENT--------
    // Check if currentFiberNode is a stateful functional component when user use useState hook.
    // If user use useState to define/manage state, the state object will be stored in memoizedState => grab the state object & its update method (dispatch) from memoizedState
    // Example: for Stateful buttons demo-app: Increment is a stateful component that use useState hook to store state data.
    // Inside the _createTree function where we handle functional components
    if ((tag === FunctionComponent || tag === IndeterminateComponent) && memoizedState) {
      if (memoizedState.queue) {
        try {
          const hooksStates = getHooksStateAndUpdateMethod(memoizedState);
          const hooksNames = getHooksNames(elementType.toString());

          componentData.hooksState = {};
          componentData.reducerStates = []; // New array to store reducer states
          componentData.hooksIndex = [];

          hooksStates.forEach(({ state, component, isReducer, lastAction, reducer }, i) => {
            componentData.hooksIndex.push(componentActionsRecord.saveNew(component));

            if (isReducer) {
              // Store reducer-specific information
              componentData.reducerStates.push({
                state,
                lastAction,
                reducerIndex: i,
                hookName: hooksNames[i]?.hookName || `Reducer ${i}`,
              });
            } else {
              // Regular useState hook
              componentData.hooksState[hooksNames[i]?.varName || `State: ${i}`] = state;
            }
          });
          newState = {
            ...componentData.hooksState,
            reducers: componentData.reducerStates,
          };
        } catch (err) {
          console.log('Error extracting component state:', {
            componentName,
            memoizedState,
            error: err,
          });
        }
      }
    }
    if (tag === ContextProvider && !elementType._context.displayName) {
      let stateData = memoizedProps.value;
      if (stateData === null || typeof stateData !== 'object') {
        stateData = { CONTEXT: stateData };
      }
      componentData.context = filterAndFormatData(stateData);
      componentName = 'Context';
    }

    // -----------------ADD COMPONENT DATA TO THE OUTPUT TREE-------------------

    /**
     * `rtid` - The `Root ID` is a unique identifier that is assigned to each React root instance in a React application.
     */
    let rtid: string | null = null;

    // Grab JSX Component & replace the 'fromLinkFiber' class value
    if (currentFiberNode.child?.stateNode?.setAttribute) {
      rtid = `fromLinkFiber${rtidCounter}`;
      // rtid = rtidCounter;
      // check if rtid is already present
      // remove existing rtid before adding a new one
      if (currentFiberNode.child.stateNode.classList.length > 0) {
        const lastClass =
          currentFiberNode.child.stateNode.classList[
            currentFiberNode.child.stateNode.classList.length - 1
          ];
        if (lastClass.includes('fromLinkFiber')) {
          currentFiberNode.child.stateNode.classList.remove(lastClass);
        }
      }
      currentFiberNode.child.stateNode.classList.add(rtid);
    }
    rtidCounter += 1;

    /**
     * The updated tree after adding the `componentData` obtained from `currentFiberNode`
     */
    const childNode = tree.addChild(newState, componentName, componentData, rtid);

    // ---------------------TRAVERSE TO NEXT FIBERNODE--------------------------
    // If currentFiberNode has children, recurse on children
    if (child) _createTree(child, childNode);

    // If currentFiberNode has siblings, recurse on siblings
    if (sibling) {
      _createTree(sibling, tree);
    }

    // ------------RETURN THE TREE OUTPUT & PASS TO FRONTEND FOR RENDERING------

    return tree;
  }
}
