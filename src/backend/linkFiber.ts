/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import 'core-js';
/* eslint-disable indent */
/* eslint-disable brace-style */
/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Snapshot,
  Mode,
  ComponentData,
  HookStates,
  Fiber,
} from './types/backendTypes';
import Tree from './tree';
import componentActionsRecord from './masterState';
import { throttle, getHooksNames } from './helpers';
import { Console } from 'console';
import AtomsRelationship from '../app/components/AtomsRelationship';
import { isNull } from 'util';

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
let recoilStateNode = {};

// Simple check for whether our target app uses Recoil
if (window[`$recoilDebugStates`]) {
  isRecoil = true;
}

// function getRecoilState(): any {
//   const RecoilSnapshotsLength = window[`$recoilDebugStates`].length;
//   const lastRecoilSnapshot =
//     window[`$recoilDebugStates`][RecoilSnapshotsLength - 1];
//   const nodeToNodeSubs = lastRecoilSnapshot.nodeToNodeSubscriptions;
//   const nodeToNodeSubsKeys = lastRecoilSnapshot.nodeToNodeSubscriptions.keys();
//   nodeToNodeSubsKeys.forEach((node) => {
//     nodeToNodeSubs
//       .get(node)
//       .forEach((nodeSubs) =>
//         allAtomsRelationship.push([node, nodeSubs, 'atoms and selectors'])
//       );
//   });
// }

/**
 * @method sendSnapshot
 * @param snap The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, locked, or paused)
 * @return Nothing.
 *
 * Middleware: Gets a copy of the current snap.tree and posts a recordSnap message to the window
 */
function sendSnapshot(snap: Snapshot, mode: Mode): void {
  // Don't send messages while jumping or while paused
  if (mode.jumping || mode.paused) return;
  if (!snap.tree) {
    snap.tree = new Tree('root', 'root');
  }
  const payload = snap.tree.cleanTreeCopy();

  if (isRecoil) {
    // getRecoilState();
    payload.atomsComponents = atomsComponents;
    payload.atomSelectors = atomsSelectors;
  }

  console.log(recoilStateNode)
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
 * @param mode The current mode (i.e. jumping, time-traveling, locked, or paused)
 * Middleware: Updates snap object with latest snapshot, using @sendSnapshot
 */
function updateSnapShotTree(snap: Snapshot, mode: Mode): void {
  if (fiberRoot) {
    const { current } = fiberRoot;
    circularComponentTable.clear();
    snap.tree = createTree(current);
  }
  sendSnapshot(snap, mode);
}

/**
 * @method traverseRecoilHooks
 * @param memoizedState  Property containing state on a stateful fctnl component's FiberNode object
 * @param memoizedProps Property containing props on a stateful fctnl component's FiberNode object
 * @return An array of array of HookStateItem objects (state and component properties)
 */
function traverseRecoilHooks(
  memoizedState: any,
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
    memoizedState =
      memoizedState.next !== memoizedState ? memoizedState.next : null;
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

function createTree(
  currentFiber: Fiber,
  tree: Tree = new Tree('root', 'root'),
  fromSibling = false
) {
  // Base case: child or sibling pointed to null

  if (!currentFiber) return null;
  if (!tree) return tree;

    if (currentFiber.tag === 0 || currentFiber.tag === 1 || currentFiber.tag === 2) {
      if (currentFiber.child && currentFiber.child.stateNode) {
          // console.log('Sanjays algo', currentFiber)
          rtid = "fromLinkFiber" + rtidCounter
          // if (currentFiber.child.stateNode.setAttribute) {
            currentFiber.child.stateNode.setAttribute("id", rtid);
          // }
      }
      rtidCounter++;
  }
    
  // These have the newest state. We update state and then
  // called updateSnapshotTree()

  const {
    sibling,
    stateNode,
    child,
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
    currentFiber.memoizedState &&
    currentFiber.memoizedState.next &&
    currentFiber.memoizedState.next.memoizedState &&
    currentFiber.memoizedState.next.memoizedState.deps &&
    isRecoil &&
    currentFiber.tag === 0 &&
    currentFiber.key === null //prevents capturing the same Fiber nodes but different key values that result from being changed
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

  // Check if node is a stateful setState component
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
    memoizedState &&
    (tag === 0 || tag === 1 || tag === 2 || tag === 10) &&
    isRecoil === true
  ) {
    // console.log('Recoil Hooks Algo', currentFiber)
    if (memoizedState.queue) {
      // Hooks states are stored as a linked list using memoizedState.next,
      // so we must traverse through the list and get the states.
      // We then store them along with the corresponding memoizedState.queue,
      // which includes the dispatch() function we use to change their state.
      const hooksStates = traverseRecoilHooks(memoizedState, memoizedProps);
      hooksStates.forEach((state) => {
        hooksIndex = componentActionsRecord.saveNew(
          state.state,
          state.component
        );
        componentData.hooksIndex = hooksIndex;

        // Improves tree visualization but breaks jump ?
        if (newState && newState.hooksState) {
          newState.push(state.state);
        } else if (newState) {
          newState = [state.state];
        } else {
          newState.push(state.state);
        }
        componentFound = true;
      });
    }
  }

  // Check if node is a hooks useState function
  // REGULAR REACT HOOKS
  if (
    memoizedState &&
    (tag === 0 || tag === 1 || tag === 2 || tag === 10) &&
    isRecoil === false
  ) {
    // console.log('Regular Hooks Algo', currentFiber)
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
        if (newState && newState.hooksState) {
          newState.hooksState.push({ [hooksNames[i]]: state.state });
        } else if (newState) {
          newState.hooksState = [{ [hooksNames[i]]: state.state }];
        } else {
          newState = { hooksState: [] };
          newState.hooksState.push({ [hooksNames[i]]: state.state });
        }
        componentFound = true;
      });
    }
  }

  // This grabs stateless components
  if (!componentFound && (tag === 0 || tag === 1 || tag === 2)) {
    // console.log('Stateless Algo', currentFiber)
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
    if (fromSibling) {
      
      if(isRecoil){
        if(currentFiber.elementType.name){
          if(!recoilStateNode[currentFiber.elementType.name]){
            recoilStateNode[currentFiber.elementType.name] = [];
          }
        }
        let pointer = currentFiber
        while(pointer !== null){
            if(pointer.stateNode !== null){
            rtid = "fromLinkFiber" + rtidCounter++
            recoilStateNode[currentFiber.elementType.name].push(pointer.stateNode)
            pointer.stateNode.setAttribute("id", rtid)
          }
            
            pointer = pointer.child
          }
      }
      newNode = tree.addSibling(
        newState,
        elementType ? elementType.name : 'nameless',
        componentData,
        rtid
      );
    } else {
      
      if(isRecoil){
        if(currentFiber.elementType.name){
          if(!recoilStateNode[currentFiber.elementType.name]){
            recoilStateNode[currentFiber.elementType.name] = [];
          }
        }
        let pointer = currentFiber
        while(pointer !== null){
            if(pointer.stateNode !== null){
            rtid = "fromLinkFiber" + rtidCounter++
            recoilStateNode[currentFiber.elementType.name].push(pointer.stateNode)
            pointer.stateNode.setAttribute("id", rtid)        
          }          
            pointer = pointer.child
          }
      }
      newNode = tree.addChild(
        newState,
        elementType ? elementType.name : 'nameless',
        componentData,
        rtid
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
 * @param mode The current mode (i.e. jumping, time-traveling, locked, or paused)
 * @return a function to be invoked by index.js that initiates snapshot monitoring
 * linkFiber contains core module functionality, exported as an anonymous function.
 */
export default (snap: Snapshot, mode: Mode): (() => void) => {
  function onVisibilityChange(): void {
    doWork = !document.hidden;
  }

  return () => {
    const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const reactInstance = devTools ? devTools.renderers.get(1) : null;
    fiberRoot = devTools.getFiberRoots(1).values().next().value;
    
    const throttledUpdateSnapshot = throttle(() => updateSnapShotTree(snap, mode), 70);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (reactInstance && reactInstance.version) {
      devTools.onCommitFiberRoot = (function (original) {
        return function (...args) {
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
