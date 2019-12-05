/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// links component state tree to library
// changes the setState method to also update our snapshot
const Tree = require('./tree');
const astParser = require('./astParser');
const { saveState } = require('./masterState');

module.exports = (snap, mode) => {
  let fiberRoot = null;
  let astHooks;
  let concurrent = false; // flag to check if we are in concurrent mode

  function sendSnapshot() {
    // don't send messages while jumping or while paused
    // DEV: So that when we are jumping to an old snapshot it
    // wouldn't think we want to create new snapshots
    if (mode.jumping || mode.paused) return;
    const payload = snap.tree.getCopy();
    // console.log('payload', payload);
    window.postMessage({
      action: 'recordSnap',
      payload,
    });
  }

  function changeSetState(component) {
    // check that setState hasn't been changed yet
    if (component.setState.linkFiberChanged) return;
    // make a copy of setState
    const oldSetState = component.setState.bind(component);
    // replace component's setState so developer doesn't change syntax
    // component.setState = newSetState.bind(component);
    component.setState = (state, callback = () => {}) => {
      // don't do anything if state is locked
      // UNLESS we are currently jumping through time
      if (mode.locked && !mode.jumping) return;
      // continue normal setState functionality, except add sending message middleware
      oldSetState(state, () => {
        updateSnapShotTree();
        sendSnapshot();
        callback.bind(component)();
      });
    };
    component.setState.linkFiberChanged = true;
  }

  function changeUseState(component) {
    if (component.queue.dispatch.linkFiberChanged) return;
    // store the original dispatch function definition
    const oldDispatch = component.queue.dispatch.bind(component.queue);
    // redefine the dispatch function so we can inject our code
    component.queue.dispatch = (fiber, queue, action) => {
      // don't do anything if state is locked
      if (mode.locked && !mode.jumping) return;
      oldDispatch(fiber, queue, action);
      // setTimeout(() => {
      updateSnapShotTree();
      sendSnapshot();
      // }, 100);
    };
    component.queue.dispatch.linkFiberChanged = true;
  }

  // Helper function to traverse through the memoized state
  // TODO: WE NEED TO CLEAN IT UP A BIT
  function traverseHooks(memoizedState) {
    // Declare variables and assigned to 0th index and an empty object, respectively
    const memoized = {};
    let index = 0;
    astHooks = Object.values(astHooks);
    // while memoizedState is truthy, save the value to the object
    while (memoizedState && memoizedState.queue) {
      // prevents useEffect from crashing on load
      // if (memoizedState.next.queue === null) { // prevents double pushing snapshot updates
      changeUseState(memoizedState);
      // }
      // memoized[astHooks[index]] = memoizedState.memoizedState;
      memoized[astHooks[index]] = memoizedState.memoizedState;
      // Reassign memoizedState to its next value
      memoizedState = memoizedState.next;
      // Increment the index by 2
      index += 2;
    }
    return memoized;
  }

  function createTree(currentFiber, tree = new Tree('root')) {
    if (!currentFiber) return tree;

    const {
      sibling,
      stateNode,
      child,
      memoizedState,
      elementType,
    } = currentFiber;

    let nextTree = tree;
    // check if stateful component
    if (stateNode && stateNode.state) {
      // add component to tree
      nextTree = tree.appendChild(stateNode);
      // change setState functionality
      changeSetState(stateNode);
    }
    // Check if the component uses hooks
    // console.log("memoizedState", memoizedState);

    if (
      memoizedState &&
      Object.hasOwnProperty.call(memoizedState, 'baseState')
    ) {
      // 'catch-all' for suspense elements (experimental)
      if (typeof elementType.$$typeof === 'symbol') return;
      // Traverse through the currentFiber and extract the getters/setters
      astHooks = astParser(elementType);
      saveState(astHooks);
      // Create a traversed property and assign to the evaluated result of
      // invoking traverseHooks with memoizedState
      memoizedState.traversed = traverseHooks(memoizedState);
      nextTree = tree.appendChild(memoizedState);
    }
    // iterate through siblings
    createTree(sibling, tree);
    // iterate through children
    createTree(child, nextTree);

    return tree;
  }
  // runs when page initially loads
  // but skips 1st hook click
  async function updateSnapShotTree() {
    let current;
    // if concurrent mode, grab current.child'
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
  }

  return async container => {
    if (container._internalRoot) {
      fiberRoot = container._internalRoot;
      concurrent = true;
    } else {
      const {
        _reactRootContainer: { _internalRoot },
        _reactRootContainer,
      } = container;
      // only assign internal root if it actually exists
      fiberRoot = _internalRoot || _reactRootContainer;
    }

    await updateSnapShotTree();
    // send the initial snapshot once the content script has started up
    window.addEventListener('message', ({ data: { action } }) => {
      if (action === 'contentScriptStarted') sendSnapshot();
    });
  };
};
