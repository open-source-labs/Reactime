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
import { getHooksStateAndUpdateMethod } from './statePropExtractors';

const nextJSDefaultComponent = new Set([
  'Root',
  'Head',
  'AppContainer',
  'Container',
  'ReactDevOverlay',
  'ErrorBoundary',
  'AppRouterContext',
  'SearchParamsContext',
  'PathnameContextProviderAdapter',
  'PathnameContext',
  'RouterContext',
  'HeadManagerContext',
  'ImageConfigContext',
  'RouteAnnouncer',
  'Portal',
]);
// ------------------------CREATE TREE TO SEND TO FRONT END-------------------
/**
 * This is a recursive function that runs after every Fiber commit using the following logic:
 * 1. Traverse from FiberRootNode
 * 2. Create an instance of custom Tree class
 * 3. Build a new state snapshot
 * Every time a state change is made in the accompanying app, the extension creates a Tree “snapshot” of the current state, and adds it to the current “cache” of snapshots in the extension
 * @param currentFiberNode A Fiber object
 * @param tree A Tree object, default initialized to an instance given 'root' and 'root'
 * @param fromSibling A boolean, default initialized to false
 * @return An instance of a Tree object
 */
// TODO: Not sure why the ritd need to be outside of the createTree function. Want to put inside, but in case this need to be keep track for front end.
export default function createComponentActionsRecord(
  currentFiberNode: Fiber,
  circularComponentTable: Set<Fiber> = new Set(),
): Tree {
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
    elementType,
    tag,
  } = currentFiberNode;
  // Obtain component name:
  const componentName =
    elementType?._context?.displayName || //For ContextProvider
    elementType?._result?.name || //For lazy Component
    elementType?.render?.name ||
    elementType?.name ||
    'nameless';
  console.log('LinkFiber', {
    currentFiberNode,
    // tag,
    // elementType,
    componentName:
      elementType?._context?.displayName || //For ContextProvider
      elementType?._result?.name || //For lazy Component
      elementType?.render?.name ||
      elementType?.name ||
      elementType,
    // memoizedState,
    // stateNode,
    // _debugHookTypes,
  });

  // ---------OBTAIN STATE & SET STATE METHODS FROM CLASS COMPONENT-----------
  // Check if node is a stateful class component when user use setState.
  // If user use setState to define/manage state, the state object will be stored in stateNode.state => grab the state object stored in the stateNode.state
  // Example: for tic-tac-toe demo-app: Board is a stateful component that use setState to store state data.
  if (
    !nextJSDefaultComponent.has(componentName) &&
    stateNode?.state &&
    (tag === ClassComponent || tag === IndeterminateComponent)
  ) {
    // Save component's state and setState() function to our record for future
    // time-travel state changing. Add record index to snapshot so we can retrieve.
    componentActionsRecord.saveNew(stateNode);
  }

  // --------OBTAIN STATE & DISPATCH METHODS FROM FUNCTIONAL COMPONENT--------
  // Check if node is a hooks useState function
  if (
    !nextJSDefaultComponent.has(componentName) &&
    memoizedState &&
    (tag === FunctionComponent ||
      // tag === ClassComponent || WE SHOULD NOT BE ABLE TO USE HOOK IN CLASS
      tag === IndeterminateComponent ||
      tag === ContextProvider) //TODOD: Need to figure out why we need context provider
  ) {
    if (memoizedState.queue) {
      try {
        // Hooks states are stored as a linked list using memoizedState.next,
        // so we must traverse through the list and get the states.
        // We then store them along with the corresponding memoizedState.queue,
        // which includes the dispatch() function we use to change their state.
        const hooksStates = getHooksStateAndUpdateMethod(memoizedState);
        hooksStates.forEach(({ component }) => {
          // Save component's state and dispatch() function to our record for future time-travel state changing. Add record index to snapshot so we can retrieve.
          componentActionsRecord.saveNew(component);
        });
      } catch (err) {
        console.log('Failed Element', { component: elementType?.name });
      }
    }
  }

  // ---------------------TRAVERSE TO NEXT FIBERNODE--------------------------
  // If currentFiberNode has children, recurse on children
  if (child) createComponentActionsRecord(child, circularComponentTable);

  // If currentFiberNode has siblings, recurse on siblings
  if (sibling) createComponentActionsRecord(sibling, circularComponentTable);
}
