/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
// import 'core-js';
/* eslint-disable indent */
/* eslint-disable brace-style */
/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

//import typescript types
import {
  
  //tree
  Snapshot,
  //jump, pause
  Mode,
  ComponentData,
  // array of state and component
  HookStates,
  // object with tree structure
  Fiber,
} from './types/backendTypes';
//import function that creates a tree
import Tree from './tree';
//passes the data down to its components ?
import componentActionsRecord from './masterState';

// throttle returns a function that can be called any number of times (possibly in quick succession) but will only invoke the callback at most once every x ms
//getHooksNames - helper function to grab the getters/setters from `elementType`
import { throttle, getHooksNames } from './helpers';
// import { Console } from 'console';
import AtomsRelationship from '../app/components/AtomsRelationship';
// import { isNull } from 'util';

// Set global variables to use in exported module and helper functions
declare global {
    interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}
let fiberRoot = null;
let doWork = true;
const circularComponentTable = new Set();
let isRecoil = false;
let allAtomsRelationship = [];
let initialstart = false;
let rtidCounter = 0;
let rtid = null;
let recoilDomNode = {};

// Simple check for whether our target app uses Recoil
// can these be regular 
if (window[`$recoilDebugStates`]) {
  isRecoil = true;
}
// function for recoil apps (unused as of 11.22.2020) 
/*
function getRecoilState(): any {
  const RecoilSnapshotsLength = window[`$recoilDebugStates`].length;
  const lastRecoilSnapshot =
    window[`$recoilDebugStates`][RecoilSnapshotsLength - 1];
  const nodeToNodeSubs = lastRecoilSnapshot.nodeToNodeSubscriptions;
  const nodeToNodeSubsKeys = lastRecoilSnapshot.nodeToNodeSubscriptions.keys();
  nodeToNodeSubsKeys.forEach((node) => {
    nodeToNodeSubs
      .get(node)
      .forEach((nodeSubs) =>
        allAtomsRelationship.push([node, nodeSubs, 'atoms and selectors'])
      );
  });
}
*/
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
 // if it's Recoil - run different actions?
  if (isRecoil) {
    // getRecoilState()
    payload.atomsComponents = atomsComponents;
    payload.atomSelectors = atomsSelectors;
    payload.recoilDomNode = recoilDomNode
  }
//method safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.
  window.postMessage(
    {
      action: 'recordSnap',
      payload,
    },
    '*'
  );
  allAtomsRelationship = [];
}

/**
 * @function updateSnapShotTree
 * @param snap The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * Middleware: Updates snap object with latest snapshot, using @sendSnapshot
 */

 //updating tree depending on current mode on the panel (pause, etc) 
function updateSnapShotTree(snap: Snapshot, mode: Mode): void {
  // this is the currently active root fiber(the mutable root of the tree)

  if (fiberRoot) {
    const { current } = fiberRoot;
    //Clears circular component table
    circularComponentTable.clear();
    //creates snapshot that is a tree based on properties in fiberRoot object
    snap.tree = createTree(current);
  }
  //sends the updated tree back
  sendSnapshot(snap, mode);
}

/**
 * @method traverseRecoilHooks
 * @param memoizedState  Property containing state on a stateful fctnl component's FiberNode object
 * @param memoizedProps Property containing props on a stateful fctnl component's FiberNode object
 * @return An array of array of HookStateItem objects (state and component properties)
 */

// if type of state - Recoil hooks
function traverseRecoilHooks(
  //State of the fiber that was used to create the output. When processing updates it reflects the state that’s currently rendered on the screen.
  memoizedState: any,
  //Props of the fiber that were used to create the output during the previous render.
  memoizedProps: any
): HookStates {
  const hooksStates: HookStates = [];
  while (memoizedState && memoizedState.queue) {
    if (
      memoizedState.memoizedState &&
      memoizedState.queue.lastRenderedReducer &&
      memoizedState.queue.lastRenderedReducer.name === 'basicStateReducer'
    ) {
      if (Object.entries(memoizedProps).length !== 0) {
        hooksStates.push({
          component: memoizedState.queue,
          state: memoizedProps,
        });
      }
    }
    memoizedState =
      memoizedState.next !== memoizedState ? memoizedState.next : null;
  }

  return hooksStates;
}

/**
 * @method traverseHooks
 * @param memoizedState memoizedState property on a stateful fctnl component's FiberNode object
 * @return An array of array of HookStateItem objects
 *
 * Helper function to traverse through memoizedState and inject instrumentation to update our state tree
 * every time a hooks component changes state
 */
function traverseHooks(memoizedState: any): HookStates {
  const hooksStates: HookStates = [];
  while (memoizedState && memoizedState.queue) {
    if (memoizedState.memoizedState) {
      hooksStates.push({
        component: memoizedState.queue,
        state: memoizedState.memoizedState,
      });
    }
    memoizedState = (memoizedState.next !== memoizedState) ?  memoizedState.next : null;
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
let atomsSelectors = {};
let atomsComponents = {};

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
    //with memoizedState we can grab the root type and construct an Abstract Syntax Tree from the hooks structure using Acorn in order to extract the hook getters and match them with their corresponding setters in an object
    memoizedState,
    memoizedProps,
    elementType,
    tag,
    actualDuration,
    actualStartTime,
    selfBaseDuration,
    treeBaseDuration,
  } = currentFiber;

  //Checks Recoil Atom and Selector Relationships
  if (
    currentFiber.memoizedState
    && currentFiber.memoizedState.next
    && currentFiber.memoizedState.next.memoizedState
    && currentFiber.memoizedState.next.memoizedState.deps
    && isRecoil
    && currentFiber.tag === 0
    && currentFiber.key === null
    // prevents capturing the same Fiber nodes but different key values that result from being changed
  ) {
    let pointer = currentFiber.memoizedState.next;
    let componentName = currentFiber.elementType.name;

    if (!atomsComponents[componentName]) {
      atomsComponents[componentName] = [];
      while (pointer !== null) {
        if (!Array.isArray(pointer.memoizedState)) {
          let atomName = pointer.memoizedState.deps[0]['key'];
          atomsComponents[componentName].push(atomName);
        }
        pointer = pointer.next;
      }
    }

    if (
      currentFiber.memoizedState.next.memoizedState.deps[1].current &&
      !initialstart
    ) {
      let getState = currentFiber.memoizedState.next.memoizedState.deps[1].current.getState()
        .graphsByVersion;
        getState.entries().forEach((value) => {
        value[1].nodeDeps.entries().forEach((obj) => {
          if (!atomsSelectors[obj[0]]) {
            atomsSelectors[obj[0]] = [];
          }
          obj[1].values().forEach((selector) => {
            if (!atomsSelectors[obj[0]].includes(selector)) {
              atomsSelectors[obj[0]].push(selector);
            }
          });
        });
      });
      initialstart = true;
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
  } = {};
  let componentFound = false;

  // Check if node is a stateful class component
  if (stateNode && stateNode.state && (tag === 0 || tag === 1 || tag === 2)) {
    // Save component's state and setState() function to our record for future
    // time-travel state changing. Add record index to snapshot so we can retrieve.
    componentData.index = componentActionsRecord.saveNew(
      stateNode.state,
      stateNode
    );
    newState = stateNode.state;
    componentFound = true;
  }
  let hooksIndex;
  const atomArray = [];
  atomArray.push(memoizedProps);

  // RECOIL HOOKS
  if (
    memoizedState
    && (tag === 0 || tag === 1 || tag === 2 || tag === 10) &&
    isRecoil === true
  ) {
    if (memoizedState.queue) {
      // Hooks states are stored as a linked list using memoizedState.next,
      // so we must traverse through the list and get the states.
      // We then store them along with the corresponding memoizedState.queue,
      // which includes the dispatch() function we use to change their state.
      const hooksStates = traverseRecoilHooks(memoizedState, memoizedProps);
      // console.log("hookStates: ", hooksStates);
      hooksStates.forEach((state, i) => {
        hooksIndex = componentActionsRecord.saveNew(
          state.state,
          state.component
        );
        componentData.hooksIndex = hooksIndex;

        // Improves tree visualization but breaks jump ?
        // if (!newState) {
          
        // }
        // newState.push(state.state);
          // console.log('newState in Recoil: ', newState);
          // console.log('state.state: ', state.state);
        /* what is this supposed to do??? currently doesn't work?? and makes no sense, newState is an object, how can you push state.state into an object?? */
        // if (newState && newState.hooksState) {
        //   newState.push(state.state);
        // } else if (newState) {
        //   newState = [state.state];
        // } else {
        //   newState.push(state.state);
        // }
        // componentFound = true;
        if (!newState) {
          newState = { hooksState: [] };
        } else if (!newState.hooksState) {
          newState.hooksState = [];
        }
        newState.hooksState.push({ [i]: state.state });
        componentFound = true;
      });
    }
  }

  // Check if node is a hooks useState function
  // REGULAR REACT HOOKS
  if (
    memoizedState
    && (tag === 0 || tag === 1 || tag === 2 || tag === 10) &&
    isRecoil === false
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
          state.component
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
  if (componentFound || newState === 'stateless') {
    // where does this get changed to true?
    if (isRecoil) {
      // do this down below too
      if(currentFiber.elementType.name){
        if(!recoilDomNode[currentFiber.elementType.name]){
          recoilDomNode[currentFiber.elementType.name] = [];
        }
      }
      let pointer = currentFiber
      // end of repeat code 

      while (pointer !== null) {
          if(pointer.stateNode !== null){
            rtid = "fromLinkFiber" + rtidCounter++;
            recoilDomNode[currentFiber.elementType.name].push(rtid)
            // check if rtid is already present
            //  remove existing rtid before adding a new one
            if (pointer.stateNode.classList.length > 0) {
              let lastClass = pointer.stateNode.classList[pointer.stateNode.classList.length -1];
              // console.log("last class: ", lastClass, "linkFiber class? ",    lastClass.includes("fromLinkFiber"));
              if (lastClass.includes("fromLinkFiber")) {
                pointer.stateNode.classList.remove(lastClass);
              }
            }
            
            pointer.stateNode.classList.add(rtid)
        }
          pointer = pointer.child
        }
    } else {
      if (currentFiber.child && currentFiber.child.stateNode && currentFiber.child.stateNode.setAttribute) {

        rtid = "fromLinkFiber" + rtidCounter;
        // check if rtid is already present
        //  remove existing rtid before adding a new one
        if (currentFiber.child.stateNode.classList.length > 0) {
          let lastClass = currentFiber.child.stateNode.classList[currentFiber.child.stateNode.classList.length -1];
          // console.log("lastClass: ", lastClass, "linkFiber class? ", lastClass.includes("fromLinkFiber"));
          if (lastClass.includes("fromLinkFiber")) {
            currentFiber.child.stateNode.classList.remove(lastClass);
          }
        }
        currentFiber.child.stateNode.classList.add(rtid);
      }
        rtidCounter++;
    }
    // checking if tree fromSibling is true
    if (fromSibling) {
      // tree object from tree.ts, with addSibling
      newNode = tree.addSibling(
        newState,
        elementType ? elementType.name : 'nameless',
        componentData,
        rtid,
        recoilDomNode
      );
    } else {      
      newNode = tree.addChild(
        newState,
        elementType ? elementType.name : 'nameless',
        componentData,
        rtid, 
        recoilDomNode
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
  function onVisibilityChange(): void {
    doWork = !document.hidden;
  }
  // this code hasnt changed since reactime 4.0
  // https://medium.com/@aquinojardim/react-fiber-reactime-4-0-f200f02e7fa8
  return () => {
    // react devtools global hook is a global object that was injected by the React Devtools content script, allows access to fiber nodes and react version
    const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const reactInstance = devTools ? devTools.renderers.get(1) : null;
    fiberRoot = devTools.getFiberRoots(1).values().next().value;
  //  console.log("fiberRoot in export default: " + Object.entries(fiberRoot));
    const throttledUpdateSnapshot = throttle(() => updateSnapShotTree(snap, mode), 70);
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (reactInstance && reactInstance.version) {
      // when is this being called...
      devTools.onCommitFiberRoot = (function (original) {
        return function (...args) {
          // console.log("args in onCommitFiberRoot: ", args)
          // eslint-disable-next-line prefer-destructuring

          fiberRoot = args[1];
          if (doWork) {
            throttledUpdateSnapshot();
          }
          return original(...args);
        };
      })(devTools.onCommitFiberRoot);
    }
    throttledUpdateSnapshot();
  };
};
