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

const Tree = require('./tree');
const { saveState, saveHooksComponent } = require('./masterState');

module.exports = (snap, mode) => {
  let fiberRoot = null;
  let astHooks;
  let concurrent = false; // flag to check if we are in concurrent mode

  async function sendSnapshot() {
    // Don't send messages while jumping or while paused
    if (mode.jumping || mode.paused) return;
    // console.log('PAYLOAD: before cleaning', snap.tree);
    const payload = snap.tree.cleanTreeCopy();// snap.tree.getCopy();
    // console.log('PAYLOAD: after cleaning', payload);
    try {
      await window.postMessage({
        action: 'recordSnap',
        payload,
      });
    } catch (e) {
      console.log('failed to send postMessage:', e);
    }
  }

  // Carlos: Injects instrumentation to update our state tree every time
  // a hooks component changes state
  function traverseHooks(memoizedState) {
    const hooksComponents = [];
    while (memoizedState && memoizedState.queue) {
      // Carlos: these two are legacy comments, we should look into them later
      // prevents useEffect from crashing on load
      // if (memoizedState.next.queue === null) { // prevents double pushing snapshot updates
      if (memoizedState.memoizedState) {
        hooksComponents.push({
          action: memoizedState.queue.dispatch,
          state: memoizedState.memoizedState,
        });
      }
      //console.log('GOT STATE', memoizedState.memoizedState);
      memoizedState = memoizedState.next !== memoizedState
        ? memoizedState.next : null;
    }
    return hooksComponents;
  }

  // Carlos: This runs after EVERY Fiber commit. It creates a new snapshot,
  // 
  function createTree(currentFiber, tree = new Tree('root'), hooksDispatch) {
    // Base case: child or sibling pointed to null
    if (!currentFiber) return tree;

    // These have the newest state. We update state and then
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

    // Check if stateful component 
    if (stateNode && stateNode.state && (tag === 0 || tag === 1)) {
      // Carlos: this is a Tree class object, which has an appendChild
      // method that adds stateNode to an array. We should refactor
      // into variable because there is always at most one element in the array
      tree.appendChild(stateNode.state, elementType.name); // Add component to tree
      Map(currentFiber, UUID) -> UUID
      tree.components[elementType.name] = stateNode.setState;
    } else {
      // grab stateless components here
    }

    // Check if the component uses hooks
    if (
      memoizedState
      && (tag === 0 || tag === 1 || tag === 10)
    ) {

      // Traverse through the currentFiber and extract the getters/setters
      // astHooks = astParser(elementType);
      // console.log('astHooks: ', astHooks);
      // saveState(astHooks);
      // Create a traversed property and assign to the evaluated result of
      // invoking traverseHooks with memoizedState
      // Carlos: try passing new state in updateSnapShotTree instead ****
      // memoizedState.traversed = traverseHooks(memoizedState);
      if (memoizedState.queue) {
        const hooksComponents = traverseHooks(memoizedState);
        hooksComponents.forEach(c => {
          if (elementType.name) {
            const hooksSnapshot = { [elementType.name]: { action: c.action, state: c.state } };
            if (hooksSnapshot) saveHooksComponent(hooksSnapshot);
            tree.appendChild({ state: c.state }, elementType.name ? elementType.name : 'nameless');
            // console.log('GOT STATE, HOOKS SNAPSHOT:', hooksSnapshot);
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
    // console.log("GOT STATE, MOVING TO CHILD/SIBLING, tree:", snap.tree);
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
    updateSnapShotTree();
    // Send the initial snapshot once the content script has started up
    // This message is sent from contentScript.js in chrome extension bundles
    window.addEventListener('message', ({ data: { action } }) => {
      if (action === 'contentScriptStarted') {
        sendSnapshot();
      }
    });
  };
};
