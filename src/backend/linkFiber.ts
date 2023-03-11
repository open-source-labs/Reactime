/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable brace-style */
/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable-next-line no-mixed-operators */

// import typescript types
import {
  // tree
  Snapshot,
  // jump, pause
  Status,
  // array of state and component
  HookStates,
  // object with tree structure
  Fiber,
  // object with tree structure
  FiberRoot,
} from './types/backendTypes';
import { DevTools } from './types/linkFiberTypes';
import {
  FunctionComponent,
  ClassComponent,
  IndeterminateComponent, // Before we know whether it is function or class
  HostRoot, // Root of a host tree. Could be nested inside another node.
  HostPortal, // A subtree. Could be an entry point to a different renderer.
  /**
   * Host Component: a type of component that represents a native DOM element in the browser environment, such as div, span, input, h1 etc.
   */
  HostComponent, // has stateNode of html elements
  HostText,
  Fragment,
  Mode,
  ContextConsumer,
  ContextProvider,
  ForwardRef,
  Profiler,
  SuspenseComponent,
  MemoComponent,
  SimpleMemoComponent, // A higher order component where if the component renders the same result given the same props, react skips rendering the component and uses last rendered result. Has memoizedProps/memoizedState but no stateNode
  LazyComponent,
  IncompleteClassComponent,
  DehydratedFragment,
  SuspenseListComponent,
  FundamentalComponent,
  ScopeComponent,
  Block,
  OffscreenComponent,
  LegacyHiddenComponent,
} from './types/backendTypes';
// import function that creates a tree
import Tree from './tree';
// passes the data down to its components
import componentActionsRecord from './masterState';
import updateSnapShotTree from './snapShot';

// throttle returns a function that can be called any number of times (possibly in quick succession) but will only invoke the callback at most once every x ms
// getHooksNames - helper function to grab the getters/setters from `elementType`
import { throttle, getHooksNames } from './helpers';

// Set global variables to use in exported module and helper functions
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: DevTools;
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

// TODO: Determine what Component Data Type we are sending back for state, context, & props
type ReactimeData = {
  [key: string]: any;
};

let rtidCounter = 0;

/**
 * @function traverseHooks
 * @param memoizedState - The current state of the component associated with the current Fiber node.
 * @return An array of array of HookStateItem objects
 *
 * Helper function to traverse through memoizedState and inject instrumentation to update our state tree
 * every time a hooks component changes state
 */
function traverseHooks(memoizedState: any): HookStates {
  const hooksStates: HookStates = [];
  while (memoizedState) {
    // the !== undefined conditional is necessary here for correctly displaying react hooks because TypeScript recognizes 0 and "" as falsey value - DO NOT REMOVE
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
 * This function receives raw Data from REACT DEV TOOL and filter the Data based on the exclude list. The filterd data is then converted to string (if applicable) before being send to reacTime front end.
 *
 * @param reactDevData - The data object obtained from React Devtool. Ex: memoizedProps, memoizedState
 * @param reactimeData - The cached data from the current component. This can be data about states, context and/or props of the component.
 * @returns The update component data object to send to front end of ReactTime
 */
function convertDataToString(
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
    return reactimeData;
  }
}
// ------------------------FILTER STATE & CONTEXT DATA--------------------------
/**
 * This function is used to trim the state data of a component.
 * All propperty name that are in the central exclude list would be trimmed off.
 * If passed in memoizedState is a not an object (a.k.a a primitive type), a default name would be provided.
 * @param memoizedState - The current state of the component associated with the current Fiber node.
 * @param _debugHookTypes - An array of hooks used for debugging purposes.
 * @param componentName - Name of the evaluated component
 * @returns - The updated state data object to send to front end of ReactTime
 */
function trimContextData(
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
      convertDataToString(memoizedState.memoizedState[0], reactimeData);
    }
    //Move on to the next level of memoizedState tree.
    memoizedState = memoizedState?.next;
  }
  // Return the updated state data object to send to front end of ReactTime
  return reactimeData;
}
// -------------------------CREATE TREE TO SEND TO FRONT END--------------------
/**
 * This is a recursive function that runs after every Fiber commit using the following logic:
 * 1. Traverse from FiberRootNode
 * 2. Create an instance of custom Tree class
 * 3. Build a new state snapshot
 * Every time a state change is made in the accompanying app, the extension creates a Tree “snapshot” of the current state, and adds it to the current “cache” of snapshots in the extension
 * @function createTree
 * @param currentFiberNode A Fiber object
 * @param tree A Tree object, default initialized to an instance given 'root' and 'root'
 * @param fromSibling A boolean, default initialized to false
 * @return An instance of a Tree object
 */
export function createTree(
  currentFiberNode: Fiber,
  circularComponentTable: Set<Fiber> = new Set(),
  tree: Tree = new Tree('root', 'root'),
  fromSibling = false,
): Tree {
  // Base case: child or sibling pointed to null
  // if (!currentFiberNode) return tree; //TO BE DELETE SINCE THIS FUNCTION CAN ONLY BE RECURSIVE CALLED IF THE FIBERNODE HAS A CHILD/SIBILING
  // if (!tree) return tree; //TO BE DELETE: WE HAVE A DEFAULT PARAMETER TREE, THIS WILL NEVER BE TRUE
  // These have the newest state. We update state and then
  // called updateSnapshotTree()
  const {
    sibling,
    stateNode,
    child,
    // with memoizedState we can grab the root type and construct an Abstract Syntax Tree from the hooks structure using Acorn in order to extract the hook getters and match them with their corresponding setters in an object
    memoizedState,
    memoizedProps,
    elementType,
    tag,
    actualDuration,
    actualStartTime,
    selfBaseDuration,
    treeBaseDuration,
    _debugHookTypes,
  } = currentFiberNode;
  // console.log('LinkFiber', {
  //   currentFiberNode,
  //   // tag,
  //   // elementType,
  //   componentName:
  //     elementType?._context?.displayName || //For ContextProvider
  //     elementType?._result?.name || //For lazy Component
  //     elementType?.render?.name ||
  //     elementType?.name ||
  //     elementType,
  //   // memoizedProps,
  //   // memoizedState,
  //   // stateNode,
  //   // dependencies,
  //   // _debugHookTypes,
  // });

  // TODO: Understand this if statement
  if (tag === HostComponent) {
    try {
      // Ensure parent component has memoizedProps property
      if (
        memoizedProps.children &&
        memoizedProps.children[0]?._owner?.memoizedProps !== undefined
      ) {
        // Access the memoizedProps of the parent component
        const propsData = memoizedProps.children[0]._owner.memoizedProps;
        const newPropData = convertDataToString(
          propsData,
          tree.componentData.props ? tree.componentData.props : null,
        );
        tree.componentData = {
          ...tree.componentData,
          props: newPropData,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  // -----------------INITIALIZE OBJECT TO CONTAIN COMPONENT DATA---------------
  let newState: any | { hooksState?: any[] } = {};
  let componentData: {
    actualDuration?: number;
    actualStartTime?: number;
    selfBaseDuration?: number;
    treeBaseDuration?: number;
    props: {};
    context: {};
    state?: {};
    hooksState?: any[];
    hooksIndex?: number;
    index?: number;
  } = {
    actualDuration,
    actualStartTime,
    selfBaseDuration,
    treeBaseDuration,
    props: {},
    context: {},
  };
  let isStatefulComponent = false;

  // ----------------APPEND PROP DATA FROM REACT DEV TOOL-----------------------
  // check to see if the parent component has any state/props
  if (
    (tag === FunctionComponent ||
      tag === ClassComponent ||
      tag === IndeterminateComponent ||
      tag === ContextProvider) &&
    memoizedProps
  ) {
    Object.assign(componentData.props, convertDataToString(memoizedProps));
  }

  // ------------APPEND STATE & CONTEXT DATA FROM REACT DEV TOOL----------------

  // memoizedState
  // Note: if user use ReactHook, memoizedState.memoizedState can be a falsy value such as null, false, ... => need to specify this data is not undefined
  if (
    (tag === FunctionComponent || tag === ClassComponent) &&
    memoizedState?.memoizedState !== undefined
  ) {
    // If user uses Redux, context data will be stored in memoizedState of the Provider component => grab context object stored in the memoizedState
    if (elementType.name === 'Provider') {
      Object.assign(
        componentData.context,
        trimContextData(memoizedState, elementType.name, _debugHookTypes),
      );
    }
    // Else if user use ReactHook to define state => all states will be stored in memoizedState => grab all states stored in the memoizedState
    // else {
    //   Object.assign(
    //     componentData.state,
    //     trimContextData(memoizedState, elementType.name, _debugHookTypes),
    //   );
    // }
  }
  // if user uses useContext hook, context data will be stored in memoizedProps.value of the Context.Provider component => grab context object stored in memoizedprops
  // Different from other provider, such as Routes, BrowswerRouter, ReactRedux, ..., Context.Provider does not have a displayName
  // TODO: need to render this context provider when user use useContext hook.
  if (tag === ContextProvider && !elementType._context.displayName) {
    let stateData = memoizedProps.value;
    if (stateData === null || typeof stateData !== 'object') {
      stateData = { CONTEXT: stateData };
    }
    componentData.context = convertDataToString(stateData);
  }

  // DEPRECATED: This code might have worked previously. However, with the update of React Dev Tool, context can no longer be pulled using this method.
  // Check to see if the component has any context:
  // if the component uses the useContext hook, we want to grab the context object and add it to the componentData object for that fiber
  // if (tag === FunctionComponent && _debugHookTypes && dependencies?.firstContext?.memoizedValue) {
  //   componentData.context = convertDataToString(dependencies.firstContext.memoizedValue);
  // }

  // ----------OBTAIN STATE & SET STATE METHODS FROM CLASS COMPONENT------------
  // Check if node is a stateful class component when user use setState.
  // If user use setState to define/manage state, the state object will be stored in stateNode.state => grab the state object stored in the stateNode.state
  // Example: for tic-tac-toe demo-app: Board is a stateful component that use setState to store state data.
  if (stateNode?.state && (tag === ClassComponent || tag === IndeterminateComponent)) {
    // Save component's state and setState() function to our record for future
    // time-travel state changing. Add record index to snapshot so we can retrieve.
    componentData.index = componentActionsRecord.saveNew(stateNode.state, stateNode);
    // Save state information in componentData.
    componentData.state = stateNode.state;
    // Passess to front end
    newState = stateNode.state;
    isStatefulComponent = true;
  }

  // ---------OBTAIN STATE & DISPATCH METHODS FROM FUNCTIONAL COMPONENT---------
  // REGULAR REACT HOOKS
  let hooksIndex;
  // Check if node is a hooks useState function
  if (
    memoizedState &&
    (tag === FunctionComponent ||
      // tag === ClassComponent || WE SHOULD NOT BE ABLE TO USE HOOK IN CLASS
      tag === IndeterminateComponent ||
      tag === ContextProvider) //TODOD: Need to figure out why we need context provider
  ) {
    if (memoizedState.queue) {
      // Hooks states are stored as a linked list using memoizedState.next,
      // so we must traverse through the list and get the states.
      // We then store them along with the corresponding memoizedState.queue,
      // which includes the dispatch() function we use to change their state.
      const hooksStates = traverseHooks(memoizedState);
      const hooksNames = getHooksNames(elementType.toString());
      console.log({ hooksNames });
      newState.hooksState = [];
      componentData.state = {};
      hooksStates.forEach((state, i) => {
        hooksIndex = componentActionsRecord.saveNew(state.state, state.component);
        componentData.hooksIndex = hooksIndex;
        newState.hooksState.push({ [hooksNames[i].hookName]: state.state });
        componentData.state[hooksNames[i].varName] = state.state;
      });
      isStatefulComponent = true;
    }
  }

  // This grabs stateless components
  if (
    !isStatefulComponent &&
    (tag === FunctionComponent || tag === ClassComponent || tag === IndeterminateComponent)
  ) {
    newState = 'stateless';
  }

  // ------------------ADD COMPONENT DATA TO THE OUTPUT TREE--------------------
  /**
   * The updated tree after adding the `componentData` obtained from `currentFiberNode`
   */
  let newNode: Tree;
  /**
   * `rtid` - The `Root ID` is a unique identifier that is assigned to each React root instance in a React application.
   */
  let rtid: string | null = null;
  // We want to add this fiber node to the snapshot
  // if (componentFound || (newState === 'stateless' && !newState.hooksState)) {
  if (isStatefulComponent || newState === 'stateless') {
    // Grab JSX Component & replace the 'fromLinkFiber' class value
    if (currentFiberNode.child?.stateNode?.setAttribute) {
      rtid = `fromLinkFiber${rtidCounter}`;
      // rtid = rtidCounter;
      // check if rtid is already present
      //  remove existing rtid before adding a new one
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
    rtidCounter += 1; // I THINK THIS SHOULD BE UP IN THE IF STATEMENT. Still unsure the use of rtid
    // checking if tree fromSibling is true
    if (fromSibling) {
      newNode = tree.addSibling(
        newState,
        elementType ? elementType.name : 'nameless',
        componentData,
        rtid,
      );
    } else {
      newNode = tree.addChild(
        newState,
        elementType ? elementType.name : 'nameless',
        componentData,
        rtid,
      );
    }
  } else {
    newNode = tree;
  }

  // ----------------------TRAVERSE TO NEXT FIBERNODE---------------------------
  // Recurse on children
  if (child && !circularComponentTable.has(child)) {
    // If this node had state we appended to the children array,
    // so attach children to the newly appended child.
    // Otherwise, attach children to this same node.
    circularComponentTable.add(child);
    createTree(child, circularComponentTable, newNode);
  }

  // Recurse on siblings
  if (sibling && !circularComponentTable.has(sibling)) {
    circularComponentTable.add(sibling);
    createTree(sibling, circularComponentTable, newNode, true);
  }

  // -------------RETURN THE TREE OUTPUT & PASS TO FRONTEND FOR RENDERING-------
  return tree;
}

/**
 * linkFiber contains core module functionality, exported as an anonymous function, perform the following logic:
 * 1. Check if React Dev Tool is installed.
 * 2. Check if the target application (on the browser) is a valid react application.
 * 3. Initiate a event listener for visibility update of the target React Applicaiton.
 * 4. Obtain the initial fiberRootNode, which is the root node of a tree of React component.
 * 5. Initialize the tree snapShot on Chrome Extension.
 * 6. Monkey patching the onCommitFiberRoot from REACT DEV TOOL to obtain updated data after React Applicaiton is re-rendered.
 * @param snapShot The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @return a function to be invoked by index.js that initiates snapshot monitoring
 */
export default function linkFiber(snapShot: Snapshot, mode: Status): () => void {
  /**
   * A boolean value indicate if the target React Application is visible
   */
  let isVisible: boolean = true;
  /**
   * The `fiberRootNode`, which is the root node of a tree of React component.
   * The `current` property of `fiberRoot` has data structure of a Tree, which can be used to traverse and obtain all child component data.
   */
  let fiberRoot: FiberRoot;
  /**
   * @constant MIN_TIME_BETWEEN_UPDATE - The minimum time (ms) between each re-render/update of the snapShot tree being displayed on the Chrome Extension.
   */
  const MIN_TIME_BETWEEN_UPDATE = 10;
  /**
   * @function throttledUpdateSnapshot - a function that will wait for at least MIN_TIME_BETWEEN_UPDATE ms, before updating the tree snapShot being displayed on the Chrome Extension.
   */
  const throttledUpdateSnapshot = throttle((fiberRoot) => {
    updateSnapShotTree(snapShot, mode, fiberRoot);
  }, MIN_TIME_BETWEEN_UPDATE);

  // Return a function to be invoked by index.js that initiates snapshot monitoring
  // TODO: Convert this into async/await & add try/catch

  return () => {
    // -------------------CHECK REACT DEVTOOL INSTALLATION----------------------
    // react devtools global hook is a global object that was injected by the React Devtools content script, allows access to fiber nodes and react version
    // Obtain React Devtools Object:
    const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    // If React Devtools is not installed, object will be undefined.
    if (!devTools) {
      return;
    }
    // If React Devtools is installed, send a message to front end.
    window.postMessage(
      {
        action: 'devToolsInstalled',
        payload: 'devToolsInstalled',
      },
      '*',
    );

    // --------------------CHECK VALID REACT APPLICATION------------------------
    // Obtain React Application information:
    const reactInstance = devTools.renderers.get(1);
    // If target application is not a React App, this will return undefined.
    if (!reactInstance) {
      return;
    }
    // If target application is a React App, send a message to front end.
    window.postMessage(
      {
        action: 'aReactApp',
        payload: 'aReactApp',
      },
      '*',
    );
    // --------------INITIATE EVENT LISTENER FOR VISIBILITY CHANGE--------------
    /**
     * Initiate an event listener for when there is a change to the visibility of the react target application (the browser tab)
     * @example If tic-tac-toe demo app is loaded on a tab with localhost:8080, whenever user switch tab or switch to another software => 'visibilityChange' => invoke the callback to update doWork boolean value
     */
    document.addEventListener('visibilitychange', () => {
      // Hidden property = background tab/minimized window
      isVisible = !document.hidden;
    });

    // ---------OBTAIN THE INITIAL FIBEROOTNODE FROM REACT DEV TOOL-------------
    // Obtain the FiberRootNode, which is the first value in the FiberRoot Set:
    fiberRoot = devTools.getFiberRoots(1).values().next().value;
    console.log('linkFiber', { fiberRoot });

    // ----------INITIALIZE THE TREE SNAP SHOT ON CHROME EXTENSION--------------
    throttledUpdateSnapshot(fiberRoot); // only runs on start up

    // --------MONKEY PATCHING THE onCommitFiberRoot FROM REACT DEV TOOL--------
    // React has inherent methods that are called with react fiber
    // One of which is the onCommitFiberRoot method, which is invoked after the React application re-render its component(s).
    // we attach new functionality without compromising the original work that onCommitFiberRoot does
    /**
     * @param onCommitFiberRoot -  is a callback provided by React that is automatically invoked by React Fiber after the target React application re-renders its components. This callback is used by REACT DEV TOOL to receive updated data about the component tree and its state. See {@link https://medium.com/@aquinojardim/react-fiber-reactime-4-0-f200f02e7fa8}
     * @returns an anonymous function, which will have the same parameters as onCommitFiberRoot and when invoked will update the fiberRoot value & post a request to update the snapShot tree on Chrome Extension
     */
    function addOneMoreStep(onCommitFiberRoot: DevTools['onCommitFiberRoot']) {
      return function (...args: Parameters<typeof onCommitFiberRoot>) {
        // eslint-disable-next-line prefer-destructuring
        // Obtain the updated FiberRootNode, after the target React application re-renders
        fiberRoot = args[1];
        // If the target React application is visible, send a request to update the snapShot tree displayed on Chrome Extension
        if (isVisible) throttledUpdateSnapshot(fiberRoot);
        // After our added work is completed we invoke the original onComitFiberRoot function
        return onCommitFiberRoot(...args);
      };
    }
    // Money Patching the onCommitFiberRoot method from REACT DEV TOOL
    devTools.onCommitFiberRoot = addOneMoreStep(devTools.onCommitFiberRoot);
  };
}
