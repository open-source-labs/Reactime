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
    component.setState = (state, callback = () => { }) => {
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
      setTimeout(() => {
        updateSnapShotTree();
        sendSnapshot();
      }, 100);
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
    while (memoizedState) {
      changeUseState(memoizedState);
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
    if (memoizedState && Object.hasOwnProperty.call(memoizedState, 'baseState')) {
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
  function updateSnapShotTree() {
    const { current } = fiberRoot;
    snap.tree = createTree(current);
  }

  return container => {
    const {
      _reactRootContainer: { _internalRoot },
      _reactRootContainer,
    } = container;
    // only assign internal rootp if it actually exists
    fiberRoot = _internalRoot || _reactRootContainer;
  
    updateSnapShotTree();
    // send the initial snapshot once the content script has started up
    window.addEventListener('message', ({ data: { action } }) => {
      if (action === 'contentScriptStarted') sendSnapshot();
    });
    // Testing sending back a function def to client
    // function getNextImport(filePath) {
    // return loadable(() => import(`${filePath}`))
    // Got relative file path to return back to client code
    // return (`myTestString${filePath}`);
    // return getNextImport('./UseStateHook');
    // return 'Testing outside';
    // const OtherComponent = loadable(() => import('./OtherComponent'))
  }
};