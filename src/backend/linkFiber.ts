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
  Mode,
  // array of state and component
  HookStates,
  // object with tree structure
  Fiber,
} from './types/backendTypes';
// import function that creates a tree
import Tree from './tree';
// passes the data down to its components
import componentActionsRecord from './masterState';
import routes from './routes';

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

let fiberRoot = null;
let doWork = true;
const circularComponentTable = new Set();
let rtidCounter = 0;
let rtid = null;

/**
 * @method sendSnapshot
 * @param snap The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @return Nothing.
 *
 * Middleware: Gets a copy of the current snap.tree and posts a recordSnap message to the window
 */
function sendSnapshot(snap: Snapshot, mode: Mode): void {
  // Don't send messages while jumping or while paused
  if (mode.jumping || mode.paused) return;
  // If there is no current tree  creates a new one
  if (!snap.tree) {
    snap.tree = new Tree('root', 'root');
  }
  const payload = snap.tree.cleanTreeCopy();
  payload.route = routes.addRoute(window.location.href);
  // method safely enables cross-origin communication between Window objects;
  // e.g., between a page and a pop-up that it spawned, or between a page
  // and an iframe embedded within it.
  // this postMessage will be sending the most up-to-date snapshot of the current React Fiber Tree
  // the postMessage action will be received on the content script to later update the tabsObj
  // this will fire off everytime there is a change in test application

  window.postMessage(
    {
      action: 'recordSnap',
      payload,
    },
    '*',
  );
  console.log('LinkFiber', { payload });
}

/**
 * @function updateSnapShotTree
 * @param snap The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * Middleware: Updates snap object with latest snapshot, using @sendSnapshot
 */
// updating tree depending on current mode on the panel (pause, etc)
function updateSnapShotTree(snap: Snapshot, mode: Mode): void {
  // this is the currently active root fiber(the mutable root of the tree)
  if (fiberRoot) {
    const { current } = fiberRoot;
    // Clears circular component table
    circularComponentTable.clear();
    // creates snapshot that is a tree based on properties in fiberRoot object
    componentActionsRecord.clear();
    snap.tree = createTree(current);
  }
  // sends the updated tree back
  sendSnapshot(snap, mode);
}

/**
 * @method traverseHooks
 * @param memoizedState memoizedState property on a stateful functional component's FiberNode object
 * @return An array of array of HookStateItem objects
 *
 * Helper function to traverse through memoizedState and inject instrumentation to update our state tree
 * every time a hooks component changes state
 */
function traverseHooks(memoizedState: any): HookStates {
  const hooksStates: HookStates = [];
  while (memoizedState?.queue) {
    // the !== null conditional is necessary here for correctly displaying react hooks because TypeScript recognizes 0 and "" as null - DO NOT REMOVE
    if (memoizedState.memoizedState !== null) {
      hooksStates.push({
        component: memoizedState.queue,
        state: memoizedState.memoizedState,
      });
    }
    memoizedState = memoizedState.next !== memoizedState ? memoizedState.next : null;
  }
  return hooksStates;
}

/**
 * @method createTree
 * @param currentFiber A Fiber object
 * @param tree A Tree object, default initialized to an instance given 'root' and 'root'
 * @param fromSibling A boolean, default initialized to false
 * @return An instance of a Tree object
 * This is a recursive function that runs after every Fiber commit using the following logic:
 * 1. Traverse from FiberRootNode
 * 2. Create an instance of custom Tree class
 * 3. Build a new state snapshot
 */
// This runs after every Fiber commit. It creates a new snapshot
const exclude = new Set([
  'alternate',
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
  'effects',
  'element',
  'elementType',
  'firstBaseUpdate',
  'firstEffect',
  'flags',
  'get key',
  'key',
  'lanes',
  'lastBaseUpdate',
  'lastEffect',
  'navigator',
  'memoizedState',
  'mode',
  'next',
  'nextEffect',
  'pending',
  'parentSub',
  'pathnameBase',
  'pendingProps',
  'Provider',
  'updateQueue',
  'ref',
  'responders',
  'return',
  'route',
  'routeContext',
  'shared',
  'sibling',
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
]);
// -------------------CONVERT PROPT DATA TO STRING------------------------------
// This recursive function is used to grab the state of children components
// and push them into the parent componenent
// react elements throw errors on client side of application - convert react/functions into string
function convertDataToString(newObj, newPropData = {}, depth = 0) {
  // const newPropData = oldObj;
  for (const key in newObj) {
    // Skip keys that are in exclude list OR if there is no value at key
    if (exclude.has(key) || !newObj[key]) {
      continue;
      // newPropData[key] = 'reactFiber';
      // return newPropData;
    }
    // If value at key is a function, assign key with value 'function' to newPropData object
    else if (typeof newObj[key] === 'function') {
      newPropData[key] = 'function';
    }
    // If value at key is an object, recusive call convertDataToString to traverse through all keys and append to newPropData object accodingly
    else if (typeof newObj[key] === 'object') {
      // newPropData[key] =
      depth > 10
        ? 'convertDataToString reached max depth'
        : convertDataToString(newObj[key], newPropData, depth + 1);
    } else {
      newPropData[key] = newObj[key];
    }
  }
  return newPropData;
}
// -------------------------CREATE TREE TO SEND TO FRONT END--------------------
/**
 * Every time a state change is made in the accompanying app, the extension creates a Tree “snapshot” of the current state, and adds it to the current “cache” of snapshots in the extension
 */
function createTree(
  currentFiber: Fiber,
  tree: Tree = new Tree('root', 'root'),
  fromSibling = false,
) {
  // Base case: child or sibling pointed to null
  if (!currentFiber) return null;
  if (!tree) return tree;
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
    dependencies,
    _debugHookTypes,
  } = currentFiber;
  console.log('LinkFiber', {
    tag,
    elementType:
      elementType?._context?.displayName ||
      elementType?.render?.name ||
      elementType?.name ||
      elementType,
    memoizedProps,
    memoizedState,
  });

  // Tag === 5 signify this is a React Fragment. Each JSX component return a React fragment => The parent of a React Fragment could be a JSX component
  if (tag === 5) {
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

  let newState: any | { hooksState?: any[] } = {};
  let componentData: {
    hooksState?: any[];
    hooksIndex?: number;
    index?: number;
    actualDuration?: number;
    actualStartTime?: number;
    selfBaseDuration?: number;
    treeBaseDuration?: number;
    props?: any;
    context?: any;
  } = {};
  let componentFound = false;

  // check to see if the parent component has any state/props
  if (memoizedProps && Object.keys(memoizedProps).length) {
    componentData.props = convertDataToString(memoizedProps, {});
  }

  // if the component uses the useContext hook, we want to grab the context object and add it to the componentData object for that fiber
  if (tag === 0 && _debugHookTypes && dependencies?.firstContext?.memoizedValue) {
    componentData.context = convertDataToString(dependencies.firstContext.memoizedValue, null);
  }
  // Check if node is a stateful class component
  if (stateNode && stateNode.state && (tag === 0 || tag === 1 || tag === 2)) {
    // Save component's state and setState() function to our record for future
    // time-travel state changing. Add record index to snapshot so we can retrieve.
    componentData.index = componentActionsRecord.saveNew(stateNode.state, stateNode);
    newState = stateNode.state;
    componentFound = true;
  }
  let hooksIndex;

  // Check if node is a hooks useState function
  // REGULAR REACT HOOKS
  if (memoizedState && (tag === 0 || tag === 1 || tag === 2 || tag === 10)) {
    if (memoizedState.queue) {
      // Hooks states are stored as a linked list using memoizedState.next,
      // so we must traverse through the list and get the states.
      // We then store them along with the corresponding memoizedState.queue,
      // which includes the dispatch() function we use to change their state.
      const hooksStates = traverseHooks(memoizedState);
      const hooksNames = getHooksNames(elementType.toString());

      hooksStates.forEach((state, i) => {
        hooksIndex = componentActionsRecord.saveNew(state.state, state.component);
        componentData.hooksIndex = hooksIndex;
        if (!newState) {
          newState = { hooksState: [] };
        } else if (!newState.hooksState) {
          newState.hooksState = [];
        }
        newState.hooksState.push({ [hooksNames[i]]: state.state });
        componentFound = true;
      });
    }
  }

  // This grabs stateless components
  if (!componentFound && (tag === 0 || tag === 1 || tag === 2)) {
    newState = 'stateless';
  }

  // Adds performance metrics to the component data
  componentData = {
    ...componentData,
    actualDuration,
    actualStartTime,
    selfBaseDuration,
    treeBaseDuration,
  };
  console.log('props', componentData.props);
  let newNode = null;

  // We want to add this fiber node to the snapshot
  if (componentFound || (newState === 'stateless' && !newState.hooksState)) {
    if (currentFiber.child?.stateNode?.setAttribute) {
      rtid = `fromLinkFiber${rtidCounter}`;
      // rtid = rtidCounter;
      // check if rtid is already present
      //  remove existing rtid before adding a new one
      if (currentFiber.child.stateNode.classList.length > 0) {
        const lastClass =
          currentFiber.child.stateNode.classList[currentFiber.child.stateNode.classList.length - 1];
        if (lastClass.includes('fromLinkFiber')) {
          currentFiber.child.stateNode.classList.remove(lastClass);
        }
      }
      currentFiber.child.stateNode.classList.add(rtid);
    }
    rtidCounter += 1;
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

  // Recurse on children

  if (child && !circularComponentTable.has(child)) {
    // If this node had state we appended to the children array,
    // so attach children to the newly appended child.
    // Otherwise, attach children to this same node.
    circularComponentTable.add(child);
    createTree(child, newNode);
  }

  // Recurse on siblings
  if (sibling && !circularComponentTable.has(sibling)) {
    circularComponentTable.add(sibling);
    createTree(sibling, newNode, true);
  }

  return tree;
}
/**
 * @interface DevTools - A global object provided by the React Developer Tools extension. It provides a set of methods that allow developers to inspect and manipulate React components in the browser.
 */
interface DevTools {
  /**
   * @property renderers - an Map object containing information about the React renders that are currently active on the page. The react version being used can be obtained at key = 1.
   */
  renderers: Map<1, undefined | { version: string }>;
  /**
   * @method getFiberRoots - get the Set of fiber roots that are currently mounted for the given rendererID. If not found, initalize a new empty Set at renderID key.
   * @param renderID -  a unique identifier for a specific instance of a React renderer. When a React application is first mounted, it will receive a rendererID. This rendererID will remain the same for the entire lifecycle of the application, even if the state is updated and the components are re-rendered/unmounted/added. However, if the application is unmounted and re-mounted again, it will receive a new rendererID.
   * @return A set of fiberRoot.
   */
  getFiberRoots: (rendererID: number) => Set<number>;

  /**
   * @method onCommitFiberRoot - After the state of a component in a React Application is updated, the virtual DOM will be updated. When a render has been commited for a root, onCommitFiberRoot will be invoked to determine if the component is being mounted, updated, or unmounted. After that, this method will send update information to the React DevTools to update its UI to reflect the change.
   * @param rendererID -  a unique identifier for a specific instance of a React renderer
   * @param root - root of the rendered tree (a.k.a the root of the React Application)
   * @param priorityLevel
   * @return void
   */
  onCommitFiberRoot: (rendererID: number, root: any, priorityLevel: any) => void;
}

/**
 * @method linkFiber
 * @param snap The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @return a function to be invoked by index.js that initiates snapshot monitoring
 * linkFiber contains core module functionality, exported as an anonymous function.
 */
export default (snap: Snapshot, mode: Mode): (() => void) => {
  // Checks for visiblity of document
  function onVisibilityChange() {
    // Hidden property = background tab/minimized window
    doWork = !document.hidden;
  }
  return () => {
    // -------------------CHECK REACT DEVTOOL INSTALLATION----------------------
    // react devtools global hook is a global object that was injected by the React Devtools content script, allows access to fiber nodes and react version
    // Obtain React Devtools Object:
    const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    console.log('linkFiber.ts', { devTools });
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
    // we may want to add try/catch
    // If target application is a React App, send a message to front end.
    window.postMessage(
      {
        action: 'aReactApp',
        payload: 'aReactApp',
      },
      '*',
    );

    const throttledUpdateSnapshot = throttle(() => {
      updateSnapShotTree(snap, mode);
    }, 70);
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (reactInstance && reactInstance.version) {
      // Obtain the FiberRootNode, which is the first value in the FiberRoot Set:
      fiberRoot = devTools.getFiberRoots(1).values().next().value;
      console.log('LinkFiber', { fiberRoot });

      // React has inherent methods that are called with react fiber
      // we attach new functionality without compromising the original work that onCommitFiberRoot does
      const addOneMoreStep = function (original) {
        return function (...args) {
          // eslint-disable-next-line prefer-destructuring
          fiberRoot = args[1];
          // this is the additional functionality we added
          if (doWork) {
            throttledUpdateSnapshot();
          }
          // after our added work is completed we invoke the original function
          return original(...args);
        };
      };
      devTools.onCommitFiberRoot = addOneMoreStep(devTools.onCommitFiberRoot);

      throttledUpdateSnapshot(); // only runs on start up
    }
  };
};
