/* eslint-disable indent */
/* eslint-disable brace-style */
/* eslint-disable comma-dangle */
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

const { Tree, UnfilteredTreeNode } = require('./tree');
const astParser = require('./astParser');
const { saveState } = require('./masterState');
// import * as reactWorkTags from './reactWorkTags';

module.exports = (snap, mode) => {
  let fiberRoot = null;
  let astHooks;
  let concurrent = false; // flag to check if we are in concurrent mode

  function sendSnapshot() {
    // Don't send messages while jumping or while paused
    // DEV: So that when we are jumping to an old snapshot it
    if (mode.jumping || mode.paused) return;
    const payload = snap.tree.getCopy();
    window.postMessage({
      action: 'recordSnap',
      payload,
    });
  }

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
        sendSnapshot();
        callback.bind(component)();
      });
    };
    // Set a custom property to ensure we don't change this method again
    component.setState.linkFiberChanged = true;
  }

  function changeUseState(component) {
    if (component.queue.dispatch.linkFiberChanged) return;

    // Persist the old dispatch and bind to component so we can continue to dispatch()
    const oldDispatch = component.queue.dispatch.bind(component.queue);

    component.queue.dispatch = (fiber, queue, action) => {
      if (mode.locked && !mode.jumping) return;
      oldDispatch(fiber, queue, action);
      // * Uncomment setTimeout to prevent snapshot lag-effect
      // * (i.e. getting the prior snapshot on each state change)
      // setTimeout(() => {
      updateSnapShotTree();
      sendSnapshot();
      // }, 100);
    };
    // Set a custom property to ensure we don't change this method again
    component.queue.dispatch.linkFiberChanged = true;
  }

  // TODO: WE NEED TO CLEAN IT UP A BIT
  function traverseHooks(memoizedState) {
    // Declare variables and assigned to 0th index and an empty object, respectively
    const memoized = {};
    let index = 0;
    astHooks = Object.values(astHooks);
    // While memoizedState is truthy, save the value to the object
    while (memoizedState && memoizedState.queue) {
      // // prevents useEffect from crashing on load
      // if (memoizedState.next.queue === null) { // prevents double pushing snapshot updates
      changeUseState(memoizedState);
      // }
      // memoized[astHooks[index]] = memoizedState.memoizedState;
      memoized[astHooks[index]] = memoizedState.memoizedState;
      // Reassign memoizedState to its next value
      memoizedState = memoizedState.next;
      // See astParser.js for explanation of this increment
      index += 2;
    }
    return memoized;
  }

  
  function createTree(curFiber, parentNode) {
    // on call from updateSnapShot, no parentNode provided, so create a root node
    if(! parentNode) parentNode = new Tree('root');
    
    // Base case: parentNode's child or sibling pointed to null
    if (!curFiber) return parentNode;
    
    let newChildNode = null;

    // If stateful, add to parentNode's children array, then inject new setState into fiber node
    if (curFiber.stateNode && curFiber.stateNode.state) {
      newChildNode = parentNode.appendChild(curFiber.stateNode);
      changeSetState(curFiber.stateNode);
      newChildNode.isStateful = true;
    }

    // Recurse to sibling; siblings that have state should be added to our parentNode
    createTree(curFiber.sibling, parentNode);  

    // Recurse to child; If this fiber was stateful, then we added a newChildNode here, and we want
    // to attach further children to that. If this fiber wasn't stateful, we want to attach any 
    // children to our existing parentNode.
    createTree(curFiber.child, newChildNode || parentNode);

    return parentNode;
  }


  // function createUnfilteredTree(curFiber, parentNode) {
  //   // on call from updateSnapShot, no parentNode provided, so create a root node
  //   if(! parentNode) parentNode = new Tree('root');
    
  //   // Base case: parentNode's child or sibling pointed to null
  //   if (!curFiber) return parentNode;
    
  //   let newChildNode = null;

  //   // If stateful, add to parentNode's children array, then inject new setState into fiber node
  //   if (curFiber.stateNode && curFiber.stateNode.state) {
  //     newChildNode = parentNode.appendChild(curFiber.stateNode);
  //     // changeSetState(curFiber.stateNode);
  //     newChildNode.isStateful = true;
  //   }
  //   else {

  //   }

  //   // Recurse to sibling; siblings that have state should be added to our parentNode
  //   createTree(curFiber.sibling, parentNode);  

  //   // Recurse to child; If this fiber was stateful, then we added a newChildNode here, and we want
  //   // to attach further children to that. If this fiber wasn't stateful, we want to attach any 
  //   // children to our existing parentNode.
  //   createTree(curFiber.child, newChildNode || parentNode);

  //   return parentNode;
  // }


  // ! BUG: skips 1st hook click
  async function updateSnapShotTree() {
    let current;
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
    }

    snap.tree = createTree(current);
    console.log("updateSnapShotTree -> snap.tree", snap.tree)
    // snap.unfilteredTree = createUnfilteredTree(current);
    // console.log("updateSnapShotTree -> snap.unfilteredTree", snap.unfilteredTree)
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
      console.log('linkFiber.js, fiberRoot:', fiberRoot);
    }

    await updateSnapShotTree();
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




// function createUnfilteredTree(currentFiber, tree = new Tree('root')) {
//   // Base case: child or sibling pointed to null
//   if (!currentFiber) return tree;

//   const { sibling, stateNode, child, memoizedState, elementType,
//           tag, actualDuration, actualStartTime, selfBaseDuration, treeBaseDuration,
//   } = currentFiber;

//   const extraProps = {
//     tag, actualDuration, actualStartTime, selfBaseDuration, treeBaseDuration,
//   };

//   let nextTree = tree;
//   let nextTreeUnfiltered = unfilteredTreeNode = new UnfilteredTreeNode('root');

//   // Check if stateful component
//   if (stateNode && stateNode.state) {
//     nextTree = tree.appendChild(stateNode); // Add component to tree
//     changeSetState(stateNode); // Change setState functionality
//   }
//   nextTreeUnfiltered = unfilteredTreeNode.appendChild(stateNode);

//   // TODO: handle Hooks cases...

//   // Recurse on siblings
//   createTree(sibling, tree);
//   // Recurse on children
//   createTree(child, nextTree);

//   return tree;
// }



// Check if the component uses hooks
// if (memoizedState && Object.hasOwnProperty.call(memoizedState, 'baseState')) {
//   // 'catch-all' for suspense elements (experimental)
//   if (typeof elementType.$$typeof === 'symbol') return;
//   // Traverse through the currentFiber and extract the getters/setters
//   astHooks = astParser(elementType);
//   saveState(astHooks);
//   // Create a traversed property and assign to the evaluated result of
//   // invoking traverseHooks with memoizedState
//   memoizedState.traversed = traverseHooks(memoizedState);
//   nextTree = tree.appendChild(memoizedState);
// }








// function createTree(currentFiber, tree = new Tree('root')) {
//   // Base case: child or sibling pointed to null
//   if (!currentFiber) return tree;

//   const { sibling, stateNode, child, memoizedState, elementType } = currentFiber;

//   let nextTree = tree;

//   // Check if stateful component
//   if (stateNode && stateNode.state) {
//     nextTree = tree.appendChild(stateNode); // Add component to tree
//     changeSetState(stateNode); // Change setState functionality
//   }

//   // Recurse on siblings
//   createTree(sibling, tree);
//   // Recurse on children
//   createTree(child, nextTree);

//   return tree;
// }