// import typescript types
import {
  // object with tree structure
  Fiber,
} from '../../types/backendTypes';
import {
  FunctionComponent,
  ClassComponent,
  IndeterminateComponent, // Before we know whether it is function or class
  HostRoot, // Root of a host tree. Could be nested inside another node.
  HostPortal, // A subtree. Could be an entry point to a different renderer.
  /**
   * Host Component: a type of component that represents a native DOM element in the browser environment, such as div, span, input, h1 etc.
   */
  HostComponent, // has stateNode of html elements
  HostText,
  Fragment,
  Mode,
  ContextConsumer,
  ContextProvider,
  ForwardRef,
  Profiler,
  SuspenseComponent,
  MemoComponent,
  SimpleMemoComponent, // A higher order component where if the component renders the same result given the same props, react skips rendering the component and uses last rendered result. Has memoizedProps/memoizedState but no stateNode
  LazyComponent,
  IncompleteClassComponent,
  DehydratedFragment,
  SuspenseListComponent,
  FundamentalComponent,
  ScopeComponent,
  Block,
  OffscreenComponent,
  LegacyHiddenComponent,
} from '../../types/backendTypes';
// import function that creates a tree
import Tree from '../../models/tree';
// passes the data down to its components
import componentActionsRecord from '../../models/masterState';
import {
  getHooksNames,
  getHooksStateAndUpdateMethod,
  getStateAndContextData,
  filterAndFormatData,
} from '../../controllers/createTree/statePropExtractors';

// -------------------------CREATE TREE TO SEND TO FRONT END--------------------
/**
 * This is a recursive function that runs after every Fiber commit using the following logic:
 * 1. Traverse from FiberRootNode
 * 2. Create an instance of custom Tree class
 * 3. Build a new state snapshot
 * Every time a state change is made in the accompanying app, the extension creates a Tree “snapshot” of the current state, and adds it to the current “cache” of snapshots in the extension
 * @function createTree
 * @param currentFiberNode A Fiber object
 * @param tree A Tree object, default initialized to an instance given 'root' and 'root'
 * @param fromSibling A boolean, default initialized to false
 * @return An instance of a Tree object
 */
// TODO: Not sure why the ritd need to be outside of the createTree function. Want to put inside, but in case this need to be keep track for front end.
let rtidCounter = 0;

export default function createTree(
  currentFiberNode: Fiber,
  circularComponentTable: Set<Fiber> = new Set(),
  tree: Tree = new Tree('root', 'root'),
  fromSibling = false,
): Tree {
  // Base case: child or sibling pointed to null
  // if (!currentFiberNode) return tree; //TO BE DELETE SINCE THIS FUNCTION CAN ONLY BE RECURSIVE CALLED IF THE FIBERNODE HAS A CHILD/SIBILING
  // if (!tree) return tree; //TO BE DELETE: WE HAVE A DEFAULT PARAMETER TREE, THIS WILL NEVER BE TRUE
  // These have the newest state. We update state and then
  // called updateSnapshotTree()

  // Base Case: if has visited, return
  if (circularComponentTable.has(currentFiberNode)) {
    return;
  } else {
    circularComponentTable.add(currentFiberNode);
  }
  const {
    sibling,
    stateNode,
    child,
    // with memoizedState we can grab the root type and construct an Abstract Syntax Tree from the hooks structure using Acorn in order to extract the hook getters and match them with their corresponding setters in an object
    memoizedState,
    memoizedProps,
    elementType,
    tag,
    actualDuration,
    actualStartTime,
    selfBaseDuration,
    treeBaseDuration,
    _debugHookTypes,
  } = currentFiberNode;
  // console.log('LinkFiber', {
  //   currentFiberNode,
  //   // tag,
  //   // elementType,
  //   componentName:
  //     elementType?._context?.displayName || //For ContextProvider
  //     elementType?._result?.name || //For lazy Component
  //     elementType?.render?.name ||
  //     elementType?.name ||
  //     elementType,
  //   // memoizedProps,
  //   // memoizedState,
  //   // stateNode,
  //   // dependencies,
  //   // _debugHookTypes,
  // });

  // TODO: Understand this if statement
  if (tag === HostComponent) {
    try {
      // Ensure parent component has memoizedProps property
      if (
        memoizedProps.children &&
        memoizedProps.children[0]?._owner?.memoizedProps !== undefined
      ) {
        // Access the memoizedProps of the parent component
        const propsData = memoizedProps.children[0]._owner.memoizedProps;
        const newPropData = filterAndFormatData(
          propsData,
          tree.componentData.props ? tree.componentData.props : null,
        );
        tree.componentData = {
          ...tree.componentData,
          props: newPropData,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  // -----------------INITIALIZE OBJECT TO CONTAIN COMPONENT DATA---------------
  let newState: any | { hooksState?: any[] } = {};
  let componentData: {
    actualDuration?: number;
    actualStartTime?: number;
    selfBaseDuration?: number;
    treeBaseDuration?: number;
    props: {};
    context: {};
    state?: {};
    hooksState?: {};
    hooksIndex?: number[];
    index?: number;
  } = {
    actualDuration,
    actualStartTime,
    selfBaseDuration,
    treeBaseDuration,
    props: {},
    context: {},
  };
  let isStatefulComponent = false;

  // ----------------APPEND PROP DATA FROM REACT DEV TOOL-----------------------
  // check to see if the parent component has any state/props
  if (
    (tag === FunctionComponent ||
      tag === ClassComponent ||
      tag === IndeterminateComponent ||
      tag === ContextProvider) &&
    memoizedProps
  ) {
    switch (elementType.name) {
      case 'Router':
        componentData.props = { pathname: memoizedProps?.location?.pathname };
        break;
      case 'RenderedRoute':
        componentData.props = { pathname: memoizedProps?.match?.pathname };
        break;
      default:
        Object.assign(componentData.props, filterAndFormatData(memoizedProps));
    }
  }

  // ------------APPEND STATE & CONTEXT DATA FROM REACT DEV TOOL----------------

  // memoizedState
  // Note: if user use ReactHook, memoizedState.memoizedState can be a falsy value such as null, false, ... => need to specify this data is not undefined
  if (
    (tag === FunctionComponent || tag === ClassComponent) &&
    memoizedState?.memoizedState !== undefined
  ) {
    // If user uses Redux, context data will be stored in memoizedState of the Provider component => grab context object stored in the memoizedState
    if (elementType.name === 'Provider') {
      Object.assign(
        componentData.context,
        getStateAndContextData(memoizedState, elementType.name, _debugHookTypes),
      );
    }
    // Else if user use ReactHook to define state => all states will be stored in memoizedState => grab all states stored in the memoizedState
    // else {
    //   Object.assign(
    //     componentData.state,
    //     getStateAndContextData(memoizedState, elementType.name, _debugHookTypes),
    //   );
    // }
  }
  // if user uses useContext hook, context data will be stored in memoizedProps.value of the Context.Provider component => grab context object stored in memoizedprops
  // Different from other provider, such as Routes, BrowswerRouter, ReactRedux, ..., Context.Provider does not have a displayName
  // TODO: need to render this context provider when user use useContext hook.
  if (tag === ContextProvider && !elementType._context.displayName) {
    let stateData = memoizedProps.value;
    if (stateData === null || typeof stateData !== 'object') {
      stateData = { CONTEXT: stateData };
    }
    componentData.context = filterAndFormatData(stateData);
  }

  // DEPRECATED: This code might have worked previously. However, with the update of React Dev Tool, context can no longer be pulled using this method.
  // Check to see if the component has any context:
  // if the component uses the useContext hook, we want to grab the context object and add it to the componentData object for that fiber
  // if (tag === FunctionComponent && _debugHookTypes && dependencies?.firstContext?.memoizedValue) {
  //   componentData.context = convertDataToString(dependencies.firstContext.memoizedValue);
  // }

  // ----------OBTAIN STATE & SET STATE METHODS FROM CLASS COMPONENT------------
  // Check if node is a stateful class component when user use setState.
  // If user use setState to define/manage state, the state object will be stored in stateNode.state => grab the state object stored in the stateNode.state
  // Example: for tic-tac-toe demo-app: Board is a stateful component that use setState to store state data.
  if (stateNode?.state && (tag === ClassComponent || tag === IndeterminateComponent)) {
    // Save component's state and setState() function to our record for future
    // time-travel state changing. Add record index to snapshot so we can retrieve.
    componentData.index = componentActionsRecord.saveNew(stateNode);
    // Save state information in componentData.
    componentData.state = stateNode.state;
    // Passess to front end
    newState = stateNode.state;
    isStatefulComponent = true;
  }

  // ---------OBTAIN STATE & DISPATCH METHODS FROM FUNCTIONAL COMPONENT---------
  // Check if node is a hooks useState function
  if (
    memoizedState &&
    (tag === FunctionComponent ||
      // tag === ClassComponent || WE SHOULD NOT BE ABLE TO USE HOOK IN CLASS
      tag === IndeterminateComponent ||
      tag === ContextProvider) //TODOD: Need to figure out why we need context provider
  ) {
    if (memoizedState.queue) {
      // Hooks states are stored as a linked list using memoizedState.next,
      // so we must traverse through the list and get the states.
      // We then store them along with the corresponding memoizedState.queue,
      // which includes the dispatch() function we use to change their state.
      const hooksStates = getHooksStateAndUpdateMethod(memoizedState);
      const hooksNames = getHooksNames(elementType.toString());
      // Intialize state & index:
      newState.hooksState = [];
      componentData.hooksState = {};
      componentData.hooksIndex = [];
      hooksStates.forEach(({ state, component }, i) => {
        // Save component's state and dispatch() function to our record for future time-travel state changing. Add record index to snapshot so we can retrieve.
        componentData.hooksIndex.push(componentActionsRecord.saveNew(component));
        // Save state information in componentData.
        newState.hooksState.push({ [hooksNames[i].varName]: state });
        // Passess to front end
        componentData.hooksState[hooksNames[i].varName] = state;
      });
      isStatefulComponent = true;
    }
  }

  // This grabs stateless components
  if (
    !isStatefulComponent &&
    (tag === FunctionComponent || tag === ClassComponent || tag === IndeterminateComponent)
  ) {
    newState = 'stateless';
  }

  // ------------------ADD COMPONENT DATA TO THE OUTPUT TREE--------------------
  /**
   * The updated tree after adding the `componentData` obtained from `currentFiberNode`
   */
  let newNode: Tree;
  /**
   * `rtid` - The `Root ID` is a unique identifier that is assigned to each React root instance in a React application.
   */
  let rtid: string | null = null;
  // We want to add this fiber node to the snapshot
  if (isStatefulComponent || newState === 'stateless') {
    // Grab JSX Component & replace the 'fromLinkFiber' class value
    if (currentFiberNode.child?.stateNode?.setAttribute) {
      rtid = `fromLinkFiber${rtidCounter}`;
      // rtid = rtidCounter;
      // check if rtid is already present
      //  remove existing rtid before adding a new one
      if (currentFiberNode.child.stateNode.classList.length > 0) {
        const lastClass =
          currentFiberNode.child.stateNode.classList[
            currentFiberNode.child.stateNode.classList.length - 1
          ];
        if (lastClass.includes('fromLinkFiber')) {
          currentFiberNode.child.stateNode.classList.remove(lastClass);
        }
      }
      currentFiberNode.child.stateNode.classList.add(rtid);
    }
    rtidCounter += 1; // I THINK THIS SHOULD BE UP IN THE IF STATEMENT. Still unsure the use of rtid

    // Obtain component name:
    const componentName =
      elementType?._context?.displayName || //For ContextProvider
      elementType?._result?.name || //For lazy Component
      elementType?.render?.name ||
      elementType?.name ||
      'nameless';
    // checking if tree fromSibling is true
    if (fromSibling) {
      newNode = tree.addSibling(newState, componentName, componentData, rtid);
    } else {
      newNode = tree.addChild(newState, componentName, componentData, rtid);
    }
  } else {
    newNode = tree;
  }

  // ----------------------TRAVERSE TO NEXT FIBERNODE---------------------------
  // If currentFiberNode has children, recurse on children
  if (child) createTree(child, circularComponentTable, newNode);

  // If currentFiberNode has siblings, recurse on siblings
  if (sibling) createTree(sibling, circularComponentTable, newNode, true);

  // -------------RETURN THE TREE OUTPUT & PASS TO FRONTEND FOR RENDERING-------
  return tree;
}
