// import typescript types
import {
  // object with tree structure
  Fiber,
  ComponentData,
} from '../../types/backendTypes';
import {
  FunctionComponent,
  ClassComponent,
  IndeterminateComponent, // Before we know whether it is function or class
  ContextProvider,
} from '../../types/backendTypes';
// import function that creates a tree
import Tree from '../../models/tree';
// passes the data down to its components
import componentActionsRecord from '../../models/masterState';
import {
  getHooksNames,
  getHooksStateAndUpdateMethod,
  // getStateAndContextData, //COMMENT OUT SINCE EXTRACTING CONTEXT IS STILL IN EXPERIMENT
  filterAndFormatData,
} from './statePropExtractors';
import {
  nextJSDefaultComponent,
  remixDefaultComponents,
  allowedComponentTypes,
} from '../../models/filterConditions';

// -------------------------CREATE TREE TO SEND TO FRONT END--------------------
/**
 * This is a function that runs after every Fiber commit using the following logic:
 * 1. Traverse from FiberRootNode
 * 2. Create an instance of custom Tree class
 * 3. Build a new state snapshot
 * Every time a state change is made in the accompanying app, the extension creates a Tree “snapshot” of the current state, and adds it to the current “cache” of snapshots in the extension
 * @param currentFiberNode A Fiber object
 * @return An instance of a Tree object
 */
// TODO: Not sure why the ritd need to be outside of the createTree function. Want to put inside, but in case this need to be keep track for front end.
export default function createTree(currentFiberNode: Fiber): Tree {
  let rtidCounter = 0;
  return _createTree(currentFiberNode, new Tree('root', 'root'));

  /**
   * This is a helper function to recursively traverse the React Fiber Tree and craft the snapshot tree to send to front end
   * @param currentFiberNode A Fiber object
   * @param tree A Tree object, default initialized to an instance given 'root' and 'root'
   * @returns An instance of a Tree Object
   */
  function _createTree(currentFiberNode: Fiber, tree: Tree): Tree {
    // ------------------OBTAIN DATA FROM THE CURRENT FIBER NODE----------------
    // Destructure the current fiber node:
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

    // Obtain component name:
    let componentName =
      elementType?._context?.displayName || //For ContextProvider
      elementType?._result?.name || //For lazy Component
      elementType?.render?.name ||
      elementType?.name ||
      'nameless';

    // console.log('CREATE TREE', {
    //   currentFiberNode,
    //   tag,
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
    // --------------------FILTER COMPONENTS/FIBER NODE-------------------------
    /**
     * For the snapshot tree,
     * 1. We will only interested in components that are one of these types: Function Component, Class Component, Indeterminate Component or Context Provider.
     * NOTE: this list of components may change depending on future use
     * 2. If user use Next JS, filter out default NextJS components
     * 3. If user use Remix JS, filter out default Remix components
     */

    if (
      !allowedComponentTypes.has(tag) ||
      nextJSDefaultComponent.has(componentName) ||
      remixDefaultComponents.has(componentName)
    ) {
      // -------------------TRAVERSE TO NEXT FIBERNODE------------------------
      // If currentFiberNode has children, recurse on children
      if (child) _createTree(child, tree);

      // If currentFiberNode has siblings, recurse on siblings
      if (sibling) {
        _createTree(sibling, tree);
      }
      // ---------RETURN THE TREE OUTPUT & PASS TO FRONTEND FOR RENDERING-------
      return tree;
    }

    // --------------INITIALIZE OBJECT TO CONTAIN COMPONENT DATA---------------
    let newState: 'stateless' | object = 'stateless';
    let componentData: ComponentData = {
      actualDuration,
      actualStartTime,
      selfBaseDuration,
      treeBaseDuration,
      props: {},
      context: {},
      state: null,
      index: null,
      hooksState: null,
      hooksIndex: null,
    };

    // ---------------APPEND PROP DATA FROM REACT DEV TOOL----------------------
    // Check to see if the parent component has any props
    if (memoizedProps) {
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

    // COMMENT OUT SINCE EXTRACTING CONTEXT IS STILL IN EXPERIMENT
    // // ------------APPEND CONTEXT DATA FROM REACT DEV TOOL----------------
    // // memoizedState
    // // Note: if user use ReactHook, memoizedState.memoizedState can be a falsy value such as null, false, ... => need to specify this data is not undefined
    // if (
    //   (tag === FunctionComponent || tag === ClassComponent || tag === IndeterminateComponent) &&
    //   memoizedState?.memoizedState !== undefined
    // ) {
    //   // If user uses Redux, context data will be stored in memoizedState of the Provider component => grab context object stored in the memoizedState
    //   if (elementType.name === 'Provider') {
    //     Object.assign(
    //       componentData.context,
    //       getStateAndContextData(memoizedState, elementType.name, _debugHookTypes),
    //     );
    //   }
    //   // Else if user use ReactHook to define state => all states will be stored in memoizedState => grab all states stored in the memoizedState
    //   // else {
    //   //   Object.assign(
    //   //     componentData.state,
    //   //     getStateAndContextData(memoizedState, elementType.name, _debugHookTypes),
    //   //   );
    //   // }
    // }
    // // if user uses useContext hook, context data will be stored in memoizedProps.value of the Context.Provider component => grab context object stored in memoizedprops
    // // Different from other provider, such as Routes, BrowswerRouter, ReactRedux, ..., Context.Provider does not have a displayName
    // // TODO: need to render this context provider when user use useContext hook.
    // if (tag === ContextProvider && !elementType._context.displayName) {
    //   let stateData = memoizedProps.value;
    //   if (stateData === null || typeof stateData !== 'object') {
    //     stateData = { CONTEXT: stateData };
    //   }
    //   componentData.context = filterAndFormatData(stateData);
    //   componentName = 'Context';
    // }

    // // DEPRECATED: This code might have worked previously. However, with the update of React Dev Tool, context can no longer be pulled using this method.
    // // Check to see if the component has any context:
    // // if the component uses the useContext hook, we want to grab the context object and add it to the componentData object for that fiber
    // // if (tag === FunctionComponent && _debugHookTypes && dependencies?.firstContext?.memoizedValue) {
    // //   componentData.context = convertDataToString(dependencies.firstContext.memoizedValue);
    // // }

    // ---------OBTAIN STATE & SET STATE METHODS FROM CLASS COMPONENT-----------
    // Check if node is a stateful class component when user use setState.
    // If user use setState to define/manage state, the state object will be stored in stateNode.state => grab the state object stored in the stateNode.state
    // Example: for tic-tac-toe demo-app: Board is a stateful component that use setState to store state data.
    if ((tag === ClassComponent || tag === IndeterminateComponent) && stateNode?.state) {
      // Save component's state and setState() function to our record for future
      // time-travel state changing. Add record index to snapshot so we can retrieve.
      componentData.index = componentActionsRecord.saveNew(stateNode);
      // Save state information in componentData.
      componentData.state = stateNode.state;
      // Passess to front end
      // TODO: Refactor this, this is currently being used for Tree & Diff tabs
      newState = componentData.state;
    }

    // --------OBTAIN STATE & DISPATCH METHODS FROM FUNCTIONAL COMPONENT--------
    // Check if node is a hooks useState function
    if (
      (tag === FunctionComponent ||
        tag === IndeterminateComponent ||
        //TODO: Need to figure out why we need context provider
        tag === ContextProvider) &&
      memoizedState
    ) {
      if (memoizedState.queue) {
        try {
          // Hooks states are stored as a linked list using memoizedState.next,
          // so we must traverse through the list and get the states.
          // We then store them along with the corresponding memoizedState.queue,
          // which includes the dispatch() function we use to change their state.
          const hooksStates = getHooksStateAndUpdateMethod(memoizedState);
          const hooksNames = getHooksNames(elementType.toString());
          // Intialize state & index:
          // newState.hooksState = [];
          componentData.hooksState = {};
          componentData.hooksIndex = [];
          hooksStates.forEach(({ state, component }, i) => {
            // Save component's state and dispatch() function to our record for future time-travel state changing. Add record index to snapshot so we can retrieve.
            componentData.hooksIndex.push(componentActionsRecord.saveNew(component));
            // Passess to front end
            componentData.hooksState[hooksNames[i].varName] = state;
          });
          // Passess to front end
          // TODO: Refactor this, this is currently being used for Tree & Diff tabs
          newState = componentData.hooksState;
        } catch (err) {
          console.log({
            Message: 'Error in createTree during obtaining state from functionalComponent',
            componentName,
            err,
          });
        }
      }
    }

    // -----------------ADD COMPONENT DATA TO THE OUTPUT TREE-------------------

    /**
     * `rtid` - The `Root ID` is a unique identifier that is assigned to each React root instance in a React application.
     */
    let rtid: string | null = null;
    /**
     * The updated tree after adding the `componentData` obtained from `currentFiberNode`
     */
    let childNode: Tree = tree;
    // We want to add this fiber node to the snapshot

    // Grab JSX Component & replace the 'fromLinkFiber' class value
    if (currentFiberNode.child?.stateNode?.setAttribute) {
      rtid = `fromLinkFiber${rtidCounter}`;
      // rtid = rtidCounter;
      // check if rtid is already present
      // remove existing rtid before adding a new one
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

    // Append the childNode to the tree
    childNode = tree.addChild(newState, componentName, componentData, rtid);

    // ---------------------TRAVERSE TO NEXT FIBERNODE--------------------------
    // If currentFiberNode has children, recurse on children
    if (child) _createTree(child, childNode);

    // If currentFiberNode has siblings, recurse on siblings
    if (sibling) {
      _createTree(sibling, tree);
    }

    // ------------RETURN THE TREE OUTPUT & PASS TO FRONTEND FOR RENDERING------
    return tree;
  }
}
