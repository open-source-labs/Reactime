/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// links component state tree to library
// changes the setState method to also update our snapshot
const Tree = require('./tree');

module.exports = (snap, mode) => {
  let fiberRoot = null;

  function sendSnapshot() {
    // don't send messages while jumping or while paused
    // DEV: So that when we are jumping to an old snapshot it wouldn't think we want to create new snapshots
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
      // dont do anything if state is locked
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

  function changeUseState (component) {
    if (component.queue.dispatch.linkFiberChanged) return;
    // running the original useState and storing its result (state and dispatch function)
    const oldDispatch = component.queue.dispatch.bind(component.queue);
    // storing the original dispatch function definition somewhere
    console.log('inside changeusestate', oldDispatch);

    // redefining the dispatch function so we can inject our code
    component.queue.dispatch = function (fiber, queue, action) {
      console.log('mode', mode);
      if (mode.locked && !mode.jumping) return;
      oldDispatch(fiber, queue, action);
      setTimeout(() => {
        console.log('Updating the snapshot tree after an action has been dispatched');
        updateSnapShotTree();
        sendSnapshot();
      }, 100);
    };
    component.queue.dispatch.linkFiberChanged = true;
  };
  
  // Helper function to traverse through the memoized state
  function traverseHooks(memoizedState) {
    // Declare variables and assigned to 0th index and an empty object, respectively
    let index = 0;
    const memoizedObj = {};
    // while memoizedState is truthy, save the value to the object
    while (memoizedState) {
      changeUseState(memoizedState);
      // Increment the index by 1
      memoizedObj[`state${index += 1}`] = memoizedState.memoizedState;
      // Reassign memoizedState to its next value
      memoizedState = memoizedState.next;
    }
    return memoizedObj;
  }

  function createTree(currentFiber, tree = new Tree('root')) {
    if (!currentFiber) return tree;
  
    const {
      sibling,
      stateNode,
      child,
      memoizedState,
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
    // TODO: Refactor the conditionals - think about the edge case where a stateful
    // component might have a key called 'baseState' in the state
    if (memoizedState && memoizedState.hasOwnProperty('baseState')) {
      memoizedState.traversed = traverseHooks(memoizedState);
      nextTree = tree.appendChild(memoizedState);
    }
    // iterate through siblings
    createTree(sibling, tree);
    // iterate through children
    createTree(child, nextTree);

    return tree;
  }

  function updateSnapShotTree() {
    const { current } = fiberRoot;
    snap.tree = createTree(current);
  }

  return {
    _(container) {
      const {
        _reactRootContainer: { _internalRoot },
        _reactRootContainer,
      } = container;
      // only assign internal root if it actually exists
      fiberRoot = _internalRoot || _reactRootContainer;
      updateSnapShotTree();
      // send the initial snapshot once the content script has started up
      window.addEventListener('message', ({ data: { action } }) => {
        if (action === 'contentScriptStarted') sendSnapshot();
      });
    },
    // testHooks(react) {
    //   return {
    //     useState: initialState => {
    //       // running the original useState and storing its result (state and dispatch function)
    //       const toReturn = react.useState(initialState);
    //       // storing the original dispatch function definition somewhere
    //       const oldDispatch = toReturn[1];
    //       console.log('old dispatch', oldDispatch)
    //       // redefining the dispatch function so we can inject our code
    //       toReturn[1] = function (newVal) {
    //         oldDispatch(newVal);
    //         setTimeout(() => {
    //           updateSnapShotTree();
    //           sendSnapshot();
    //         }, 100);
    //       };
    //       return toReturn;
    //     },
    //     useReducer: (reducer, initialState, init) => {
    //       // Declare a constant and initialize to the built-in useReducer method
    //       // Which returns an array with the state and dispatch
    //       const reduced = react.useReducer(reducer, initialState, init);
    //       // Save the dispatch method
    //       const oldDispatch = reduced[1];
    //       // reassign the dispatch method with the additional methods
    //       reduced[1] = function (type) {
    //         oldDispatch(type);
    //         setTimeout(() => {
    //           updateSnapShotTree();
    //           sendSnapshot();
    //         }, 100);
    //       };
    //       return reduced;
    //     },
    //   };
    // },
  };
};
