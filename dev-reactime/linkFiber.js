
/**
 * This file contains core module functionality.
 *
 * It exports an anonymous
 * @function
 * that is invoked on
 * @param snap --> Current snapshot
 * @param mode --> Current mode (jumping i.e. time-traveling, locked, or paused)
 * and @returns a function to be invoked on the rootContainer HTMLElement
 *
 * @function updateSnapShotTree
 * --> Middleware #1: Updates snap object with latest snapshot
 *
 * @function sendSnapshot
 * --> Middleware #2: Gets a copy of the current snap.tree and posts a message to the window
 *
 * @function changeSetState
 * @param component : stateNode property on a stateful class component's FiberNode object
 * --> Binds class component setState method to the component
 * --> Injects middleware into class component's setState method
 *
 * @function changeUseState
 * @param component : memoizedState property on a stateful functional component's FiberNode object
 * --> Binds functional component dispatch method to the component
 * --> Injects middleware into component's dispatch method
 * Note: dispatch is hook equivalent to setState()
 *
 * @function traverseHooks
 * @param memoizedState : memoizedState property on a stateful fctnl component's FiberNode object
 * --> Helper function to traverse through memoizedState
 * --> Invokes @changeUseState on each stateful functional component
 *
 * @function createTree
 * @param currentFiber : a FiberNode object
 * --> Recursive function to traverse from FiberRootNode and create
 *     an instance of custom Tree class and build up state snapshot
 */

/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

const { memo } = require('react');
const { fontSettings } = require('sinon-chrome');
const Tree = require('./tree');
const astParser = require('./astParser');
const { saveState, saveHooksComponent } = require('./masterState');
var util = require('util');
const fs = require('fs');

module.exports = (snap, mode) => {
  let fiberRoot = null;
  let astHooks;
  let concurrent = false; // flag to check if we are in concurrent mode

  async function sendSnapshot() {
    // Don't send messages while jumping or while paused
    // DEV: So that when we are jumping to an old snapshot it
    if (mode.jumping || mode.paused) return;
    console.log('PAYLOAD: tree to be sent, before cleaning', JSON.stringify(snap.tree));
    snap.tree.cleanTree();
    const payload = snap.tree;// snap.tree.getCopy();
    console.log('PAYLOAD: after cleaning', payload);
    try {
      await window.postMessage({
        action: 'recordSnap',
        payload,
      });
      console.log('successfully sent postMessage');
    } catch (e) {
      console.log('failed to send postMessage:', e);
    }
  }

  // Carlos: this right here is the secret sauce of the whole thing!
  // Carlos: This is used to change the setState function for
  // all stateful components for another function that updates our
  // snapshot global variable immediately after updating the state
  function changeSetState(component) {
    if (component.setState.linkFiberChanged) return;

    // Persist the old setState and bind to component so we can continue to setState({})
    const oldSetState = component.setState.bind(component);

    component.setState = (state, callback = () => {}) => {
      // Don't do anything if state is locked UNLESS we are currently jumping through time
      if (mode.locked && !mode.jumping) return;
      // Continue normal setState functionality, with middleware in callback
      oldSetState(state, () => {
        updateSnapShotTree();
        console.log('calling sendSnapshot from setState');
        sendSnapshot();
        callback.bind(component)();
      });
    };
    // Set a custom property to ensure we don't change this method again
    component.setState.linkFiberChanged = true;
  }

  // Injects instrumentation to dispatch function of a hooks component
  function changeUseState(component) {
    if (component.queue.dispatch.linkFiberChanged) return;

    // Persist the old dispatch and bind to component so we can continue to dispatch()
    const oldDispatch = component.queue.dispatch.bind(component.queue);

    component.queue.dispatch = (fiber, queue, action) => {
      if (mode.locked && !mode.jumping) return;
      console.log('calling sendSnapshot dispatch, args are: (fiber, queue, action)',
        JSON.parse(JSON.stringify(fiber)),
        JSON.stringify(queue),
        JSON.stringify(action));
      oldDispatch(fiber, queue, action);
      // * Uncomment setTimeout to prevent snapshot lag-effect
      // * (i.e. getting the prior snapshot on each state change)
      // setTimeout(() => {
      updateSnapShotTree({ fiber, queue, action });
      sendSnapshot();
      // }, 100);
    };
    // Set a custom property to ensure we don't change this method again
    component.queue.dispatch.linkFiberChanged = true;
  }

  // TODO: WE NEED TO CLEAN IT UP A BIT
  // Carlos: Injects instrumentation to update our state tree every time
  // a hooks component changes state
  function traverseHooks(memoizedState) {
    // Declare variables and assigned to 0th index and an empty object, respectively
    const hooksComponents = [];
    const index = 0;
    // astHooks = Object.values(astHooks);
    // While memoizedState is truthy, save the value to the object
    // console.log('memoizedState of component:', JSON.parse(JSON.stringify(memoizedState.memoizedState)));
    while (memoizedState && memoizedState.queue) {
      // // prevents useEffect from crashing on load
      // if (memoizedState.next.queue === null) { // prevents double pushing snapshot updates
      // Temp: changeUseState(memoizedState);
      // }
      // memoized[astHooks[index]] = memoizedState.memoizedState;
      // memoized[astHooks[index]] = memoizedState.memoizedState;
      // Reassign memoizedState to its next value
      //console.log('memoizedState: ', memoizedState);
      if (memoizedState.memoizedState) {
        hooksComponents.push({
          action: memoizedState.queue.dispatch,
          state: memoizedState.memoizedState,
        });
      }
      console.log('GOT STATE', memoizedState.memoizedState);
      memoizedState = memoizedState.next !== memoizedState
        ? memoizedState.next : null;
      // See astParser.js for explanation of this increment
      // index += 2;
    }
    // return memoized;
    return hooksComponents;
  }

  // Carlos: This runs after EVERY state update to create a new snapshot,
  // but, only for components for which we have changed the setState/dispatch
  // functions. These are only the components that are loaded when the app
  // starts.
  function createTree(currentFiber, tree = new Tree('root'), hooksDispatch) {
    // Base case: child or sibling pointed to null
    if (!currentFiber) return tree; // Carlos: consider returning null?
    // if (!currentFiber) return null;

    // These have the newest state. We updated state and then
    // called updateSnapshotTree()

    const {
      sibling,
      stateNode,
      child,
      memoizedState,
      elementType,
      tag,
    } = currentFiber;

    let nextTree = tree;

    // if (tree.component && tree.component.state === 'root' && (tag === 0 || tag === 1)) {
    if ((tag === 0 || tag === 1)) {
      //console.log('****current fiber ROOT:', currentFiber);
    }

    // Check if stateful component 
    
    if (stateNode && stateNode.state
      && (tag === 0 || tag === 1)) {
      //&& (tag >= 0)) {
      // Carlos: this is a Tree class object, which has an appendChild
      // method that adds stateNode to an array. We should refactor
      // into variable because there is always at most one element in the array
      // nextTree = tree.appendChild(stateNode); // Add component to tree
      console.log('stateNode: ', stateNode);
      tree.appendSibling(stateNode, elementType.name); // Add component to tree
      //changeSetState(stateNode); // Change setState functionality (first time only)
    }

    // Check if the component uses hooks
    if (
      memoizedState
      // && Object.hasOwnProperty.call(memoizedState, 'queue') && tag === 1
      && (tag === 0 || tag === 1 || tag === 10)
    ) {
      // 'catch-all' for suspense elements (experimental)
      /*
      if (typeof elementType.$$typeof === 'symbol') {
        console.log('node $$typeof is symbol');
        return;
      } */

      //console.log('**** fiber of identified hooks comp:', currentFiber);

      // Traverse through the currentFiber and extract the getters/setters
      // astHooks = astParser(elementType);
      // console.log('astHooks: ', astHooks);
      // saveState(astHooks);
      // Create a traversed property and assign to the evaluated result of
      // invoking traverseHooks with memoizedState
      // Carlos: try passing new state in updateSnapShotTree instead ****
      // memoizedState.traversed = traverseHooks(memoizedState);
      if (memoizedState.queue) {
        console.log('hooks with queue found, calling traverseHooks, fiber is ', currentFiber);
        const hooksComponents = traverseHooks(memoizedState);
        
        hooksComponents.forEach(c => {
          if (elementType.name) {
            const hooksSnapshot = { [elementType.name]: { action: c.action, state: c.state } };
            if (hooksSnapshot) saveHooksComponent(hooksSnapshot);
            // nextTree = tree.appendChild({ name: elementType.name, state: c.state });
            tree.appendSibling({ state: c.state });
            console.log('GOT STATE, HOOKS SNAPSHOT:', hooksSnapshot);
          }
        });
        
      }

      /*
      if (hooksDispatch) {
        memoizedState.component = { hooksDispatch };
        console.log('hooks dispatch args saved:', memoizedState);
        nextTree = tree.appendChild(memoizedState.hooksDispatch);
      } */
    }


    // Recurse on siblings
    createTree(sibling, tree);
    // Recurse on children
    if (tree.children.length > 0) {
      createTree(child, tree.children[0]);
    } else {
      createTree(child, tree);
    }

    return tree;
  }

  // ! BUG: skips 1st hook click
  function updateSnapShotTree(hooksDispatch) {
    /* let current;
    // If concurrent mode, grab current.child
    if (concurrent) {
      // we need a way to wait for current child to populate
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(fiberRoot.current.child), 400);
      });

      current = await promise;

      current = fiberRoot.current.child;
    } else { 
      current = fiberRoot.current;
    } */
    const current = fiberRoot.current; // Carlos: get rid of concurrent mode for now

    // console.log('FIBER COMMITTED, new fiber is:', util.inspect(current, false, 4));
    // fs.appendFile('fiberlog.txt', util.inspect(current, false, 10));
    snap.tree = createTree(current, undefined, hooksDispatch); // Carlos: pass new hooks state here?
    console.log("GOT STATE, MOVING TO CHILD/SIBLING, tree:", snap.tree);
  }

  return async container => {
    // Point fiberRoot to FiberRootNode
    if (container._internalRoot) {
      fiberRoot = container._internalRoot;
      concurrent = true;
    } else {
      const {
        _reactRootContainer: { _internalRoot },
        _reactRootContainer,
      } = container;
      // Only assign internal root if it actually exists
      fiberRoot = _internalRoot || _reactRootContainer;
      // console.log('_reactRootContainer is:', _reactRootContainer);
      // console.log('linkFiber.js, fiberRoot:', fiberRoot);
    }
    const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const reactInstance = devTools ? devTools.renderers.get(1) : null;

    if (reactInstance && reactInstance.version) {
      devTools.onCommitFiberRoot = (function (original) {
        return function (...args) {
          fiberRoot = args[1];
          updateSnapShotTree();
          sendSnapshot();
          return original(...args);
        };
      }(devTools.onCommitFiberRoot));
    }
    //console.log('%%%%%%%%%%%% CONTAINER:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
    updateSnapShotTree();
    // Send the initial snapshot once the content script has started up
    // This message is sent from contentScript.js in chrome extension bundles
    window.addEventListener('message', ({ data: { action } }) => {
      if (action === 'contentScriptStarted') {
        console.log('linkFiber.js received contentScriptStarted message, sending snapshot');
        sendSnapshot();
      }
    });
  };
};
