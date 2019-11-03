/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

// links component state tree to library
// changes the setState method to also update our snapshot

const Tree = require('./tree');
const astParser = require('./astParser');
const { saveState } = require('./masterState'); // saves AST state as array for later use

module.exports = (snap, mode) => {
  // snap is the current tree
  // mode is {jumping: bool, locked: bool, paused: bool

  let fiberRoot = null;
  let astHooks;

  function sendSnapshot() { // send snapshot of current fiber tree to chrome extension ?
    // don't send messages while jumping or while paused
    // DEV: So that when we are jumping to an old snapshot it wouldn't think we want to create new snapshots
    if (mode.jumping || mode.paused) return;
    const payload = snap.tree.getCopy(); // copy of current react fiber tree
    // console.log('payload', payload);
    window.postMessage({ // send to window
      action: 'recordSnap',
      payload,
    });
  }

  function changeSetState(component) { // if invoked, change setState functionality so that it also updates our snapshot
    // console.log("what is component?", component);
    // check that setState hasn't been changed yet
    if (component.setState.linkFiberChanged) {
      // console.log("setState has already been changed for", component);
      return;
    }
    // make a copy of setState
    const oldSetState = component.setState.bind(component);
    // replace component's setState so developer doesn't change syntax
    // component.setState = newSetState.bind(component);
    component.setState = (state, callback = () => { }) => {
      // don't do anything if state is locked
      // UNLESS we are currently jumping through time
      if (mode.locked && !mode.jumping) return;
      // continue normal setState functionality, except add sending message (to chrome extension) middleware
      oldSetState(state, () => {
        updateSnapShotTree(); // this doubles the actions in reactime for star wars app, also invokes changeSetState twice, also invokes changeSetState with Route and Characters
        sendSnapshot(); // runs once on page load, after event listener: message (line 145)
        callback.bind(component)(); // WHY DO WE NEED THIS ?
      });
    };
    component.setState.linkFiberChanged = true; // we changed setState.
  }

  function changeUseState(component) { // if invoked, change useState dispatch functionality so that it also updates our snapshot
    // check that changeUseState hasn't been changed yet
    if (component.queue.dispatch.linkFiberChanged) return;
    // store the original dispatch function definition

    // not sure why we need the bind, seems to work without it
    // const oldDispatch = component.queue.dispatch.bind(component.queue);
    const oldDispatch = component.queue.dispatch;

    // redefine the dispatch function so we can inject our code
    component.queue.dispatch = (fiber, queue, action) => {
      // don't do anything if state is locked, UNLESS we are currently jumping through time
      if (mode.locked && !mode.jumping) return;
      oldDispatch(fiber, queue, action); // hooks sees this and thinks its a side effect, that's why it's throwing an error
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
    while (memoizedState && memoizedState.queue !== null) {
      // we only want to changeUseState (which updates and sends the snapshot)
      // on the last item in the memoizedState chain. This makes sure it doesn't double-push
      // values to the timeline.
      if (astHooks[index + 2] === undefined) {
        changeUseState(memoizedState);
      }
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
    // if there is no current fiber just return the new tree as-is
    if (!currentFiber) return tree;
    // console.log("what is currentFiber", currentFiber);
    const {
      sibling,
      stateNode,
      child,
      memoizedState,
      elementType,
    } = currentFiber; // extract properties of current fiber

    let childTree = tree; // initialize child fiber tree as current fiber tree
    // check if stateful component
    if (stateNode && stateNode.state) {
      // add component to tree
      childTree = tree.appendChild(stateNode); // returns newly appended tree
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
      childTree = tree.appendChild(memoizedState);
    }
    // iterate through siblings
    createTree(sibling, tree);
    // iterate through children
    createTree(child, childTree);

    return tree;
  }

  // runs when page initially loads and on subsequent state changes
  // but skips 1st hook click
  function updateSnapShotTree() {
    const { current } = fiberRoot; // on initial page load, current - fiberNode is tag type HostRoot (entire fiber tree)
    console.log('current', current);
    snap.tree = createTree(current);
  }

  // RUNS ONCE, ON INITIAL PAGE LOAD ?
  return container => {
    // on first page load, container is entire html hierarchy of top level div
    // _reactRootContainer is that invisible top level object which wraps the top level div
    // _reactRootContainer._internalRoot is an object with property .current which includes HostRoot fiberNode (entire fiber tree)
    const {
      _reactRootContainer: { _internalRoot },
      _reactRootContainer,
    } = container;
    // only assign internal root if it actually exists
    fiberRoot = _internalRoot || _reactRootContainer;

    updateSnapShotTree();
    // send the initial snapshot once the content script has started up
    window.addEventListener('message', ({ data: { action } }) => {
      if (action === 'contentScriptStarted') { // runs once on initial page load
        // console.log("in window.addEL")
        console.log('page running');
        sendSnapshot();
      }
    });
  };
};
