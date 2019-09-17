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

  // DEV: This is how we know when a change has happened (by injecting an event listener to every component's setState functionality). Will need to create a separate one for useState components
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

  // Helper function to traverse through the memoized state
  function traverseHooks(memoizedState) {
    // Declare variables and assigned to 0th index and an empty object, respectively
    let index = 0;
    const memoizedObj = {};
    // while memoizedState is truthy, save the value to the object
    while (memoizedState) {
      // Increment the index by 1
      memoizedObj[`useState${index += 1}`] = memoizedState.memoizedState;
      // Reassign memoizedState to its next value
      memoizedState = memoizedState.next;
    }
    return memoizedObj;
  }

  function createTree(currentFiber, tree = new Tree('root')) {
    if (!currentFiber) return tree;
    // We have to figure out which properties to destructure from currentFiber
    // To support hooks and Context API
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
      // console.log('The memoizedState is: ', memoizedState);
      const result = traverseHooks(memoizedState);
      console.log('This is the result of calling traverseHooks:', result);
      nextTree = tree.appendChild(result);
    }

    // iterate through siblings
    createTree(sibling, tree);
    // iterate through children
    createTree(child, nextTree);

    return tree;
  }

  function updateSnapShotTree() {
    // console.log('fiberRoot', fiberRoot);
    const { current } = fiberRoot;
    console.log('current', current);
    snap.tree = createTree(current);
  }

  // return container => {
  //   // console.log('Container', container);
  //   const {
  //     _reactRootContainer: { _internalRoot },
  //     _reactRootContainer,
  //   } = container;
  //   // console.log('Root container', _reactRootContainer);
  //   // only assign internal root if it actually exists
  //   fiberRoot = _internalRoot || _reactRootContainer;
  //   updateSnapShotTree();

  //   // send the initial snapshot once the content script has started up
  //   window.addEventListener('message', ({ data: { action } }) => {
  //     if (action === 'contentScriptStarted') sendSnapshot();
  //   });
  // };

  return {
    main(container) {
      // console.log('Container', container);
      const {
        _reactRootContainer: { _internalRoot },
        _reactRootContainer,
      } = container;
      // console.log('Root container', _reactRootContainer);
      // only assign internal root if it actually exists
      fiberRoot = _internalRoot || _reactRootContainer;
      updateSnapShotTree();
  
      // send the initial snapshot once the content script has started up
      window.addEventListener('message', ({ data: { action } }) => {
        if (action === 'contentScriptStarted') sendSnapshot();
      });
    },
    changeUseState(useState) {
      return function (initial) {
        // running the original useState and storing its result (state and dispatch function)
        const toReturn = useState(initial);
        console.log(toReturn);
        // storing the original dispatch function definition somewhere
        const oldDispatch = toReturn[1];
        // redefining the dispatch function so we can inject our code
        toReturn[1] = function (callback) {
          oldDispatch(callback);
          updateSnapShotTree();
          sendSnapshot();
        };
        return toReturn;
      };
    },
  };
};