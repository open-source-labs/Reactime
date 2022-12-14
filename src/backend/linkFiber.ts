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
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
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
    '*'
  );
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
const exclude = ['alternate', '_owner', '_store', 'get key', 'ref', '_self', '_source', 'firstBaseUpdate', 'updateQueue', 'lastBaseUpdate', 'shared', 'responders', 'pending', 'lanes', 'childLanes', 'effects', 'memoizedState', 'pendingProps', 'lastEffect', 'firstEffect', 'tag', 'baseState', 'baseQueue', 'dependencies', 'Consumer', 'context', '_currentRenderer', '_currentRenderer2', 'mode', 'flags', 'nextEffect', 'sibling', 'create', 'deps', 'next', 'destroy', 'parentSub', 'child', 'key', 'return', 'children', '$$typeof', '_threadCount', '_calculateChangedBits', '_currentValue', '_currentValue2', 'Provider', '_context', 'stateNode', 'elementType', 'type'];

// This recursive function is used to grab the state of children components
// and push them into the parent componenent
// react elements throw errors on client side of application - convert react/functions into string
function convertDataToString(newObj, oldObj, depth = 0) {
  const newPropData = oldObj || {};
  for (const key in newObj) {
    if (typeof newObj[key] === 'function') {
      newPropData[key] = 'function';
    } else if (exclude.includes(key) === true) {
      newPropData[key] = 'reactFiber';
      return newPropData;
    } else if (typeof newObj[key] === 'object' && exclude.includes(key) !== true) {
      newPropData[key] = depth > 10 ? 'convertDataToString reached max depth' : convertDataToString(newObj[key], null, depth + 1);
    } else if (exclude.includes(key) !== true) {
      newPropData[key] = newObj[key];
    }
  }
  return newPropData;
}
// Every time a state change is made in the accompanying app, the extension creates a
// Tree “snapshot” of the current state, and adds it to the current “cache” of snapshots in the extension
function createTree(
  currentFiber: Fiber,
  tree: Tree = new Tree('root', 'root'),
  fromSibling = false
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
  } = currentFiber;


//   if (currentFiber.tag === 10) {
//     const queue = [currentFiber];
//     const result = [];
//     while (queue.length > 0) {
//       const tempFiber = queue.shift();
//       if (tempFiber.tag === 0 && tempFiber._debugHookTypes) result.push(tempFiber);
//       if (tempFiber.sibling) {
//         queue.push(tempFiber.sibling);
//       }
//       if (tempFiber.child) {
//         queue.push(tempFiber.child);
//       }
//   }
//   console.log('test', result);
// }

  // if(currentFiber.tag === 10) {
  //   let stack = [currentFiber];

  //   while(stack > 0) {
  //     let node = stack.pop();


  //   }
  // }
// check to see if we can get the information we were looking for
  if (tag === 5) {
    try {
      if (memoizedProps.children[0]._owner?.memoizedProps !== undefined) {
        const propsData = memoizedProps.children[0]._owner.memoizedProps;
        const newPropData = convertDataToString(propsData, tree.componentData.props ? tree.componentData.props : null);
        tree.componentData = {
          ...tree.componentData,
          props: newPropData
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
    props?: any,
  } = {};
  let componentFound = false;

  // check to see if the parent component has any state/props
  if (memoizedProps) {
    componentData.props = convertDataToString(memoizedProps, null);
  }

  // Check if node is a stateful class component
  if (stateNode && stateNode.state && (tag === 0 || tag === 1 || tag === 2)) {
    // Save component's state and setState() function to our record for future
    // time-travel state changing. Add record index to snapshot so we can retrieve.
    componentData.index = componentActionsRecord.saveNew(
      stateNode.state,
      stateNode,
    );
    newState = stateNode.state;
    componentFound = true;
  }
  let hooksIndex;

  // Check if node is a hooks useState function
  // REGULAR REACT HOOKS
  if (
    memoizedState
    && (tag === 0 || tag === 1 || tag === 2 || tag === 10)
  ) {
    if (memoizedState.queue) {
      // Hooks states are stored as a linked list using memoizedState.next,
      // so we must traverse through the list and get the states.
      // We then store them along with the corresponding memoizedState.queue,
      // which includes the dispatch() function we use to change their state.
      const hooksStates = traverseHooks(memoizedState);
      const hooksNames = getHooksNames(elementType.toString());


      hooksStates.forEach((state, i) => {
        hooksIndex = componentActionsRecord.saveNew(
          state.state,
          state.component,
        );
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

  let newNode = null;

  // We want to add this fiber node to the snapshot
  if (componentFound || newState === 'stateless' && !newState.hooksState) {
      if (currentFiber.child?.stateNode?.setAttribute) {
        rtid = `fromLinkFiber${rtidCounter}`;
        // rtid = rtidCounter;
        // check if rtid is already present
        //  remove existing rtid before adding a new one
        if (currentFiber.child.stateNode.classList.length > 0) {
          const lastClass = currentFiber.child.stateNode.classList[
            currentFiber.child.stateNode.classList.length - 1
          ];
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
 * @method linkFiber
 * @param snap The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @return a function to be invoked by index.js that initiates snapshot monitoring
 * linkFiber contains core module functionality, exported as an anonymous function.
 */
 export default (snap: Snapshot, mode: Mode): (() => void) => {
  // checks for visiblity of document
  function onVisibilityChange(): void {
    // hidden property = background tab/minimized window
    doWork = !document.hidden;
  }
  return () => {
    // react devtools global hook is a global object that was injected by the React Devtools content script, allows access to fiber nodes and react version
    const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    // check if reactDev Tools is installed
    if (!devTools) { return; }
    window.postMessage({
      action: 'devToolsInstalled',
      payload: 'devToolsInstalled'
    }, '*');
    // reactInstance returns an object of the react, 1st element in map
    const reactInstance = devTools.renderers.get(1);
    // if no React Instance found then target is not a compatible app
    if (!reactInstance) { return; }
    window.postMessage({
      action: 'aReactApp',
      payload: 'aReactApp'
    }, '*');

    const throttledUpdateSnapshot = throttle(() => { updateSnapShotTree(snap, mode); }, 70);
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (reactInstance && reactInstance.version) {
      fiberRoot = devTools.getFiberRoots(1).values().next().value;
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
