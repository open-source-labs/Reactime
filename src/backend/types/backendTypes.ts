import Tree from '../models/tree';

/**
 * Contain snapshot of the current ReactFiber tree
 * @member tree - A snapshot of ReactFiber Tree to send to front end
 */
export interface Snapshot {
  /** A snapshot of ReactFiber Tree to send to front end */
  tree: Tree;
}

/**
 * Indicate if mode is jumping/not jumping or navigating during jumping
 * @member jumping - Describe whether we are jumping
 *
 * When `jumping = true`, no new snapShot will be sent to front end.
 * @member navigating - Cache timeJump function to be invoked after ReactFibe tree update with new states from new route
 * @example if user uses click left/right arrow or play button, front end will post a message `jumpToSnap` and a payload of the cached snapShot tree, we will set `jumping = true`
 * @example if during jumping, we navigate to another route, such as from buttons to tictactoe, backend will set `navigating = cache of timeJump function`
 */
export interface Status {
  /**
   * Describe whether we are jumping
   *
   * When `jumping = true`, no new snapShot will be sent to front end.
   */
  jumping: boolean;
  /** Cache timeJump function to be invoked after ReactFibe tree update with new states from new route*/
  navigating?: Function;
}

/**
 * @type MsgData - obj with data object that will be sent to window?
 * @member data - an object with action & payload properties
 */
export interface MsgData {
  data: {
    action: string;
    payload: any;
  };
}

/**
 * @type ComponentData -
 * @member actualDuration - The time taken to render the current Fiber node and its descendants during the previous render cycle. This value is used to optimize the rendering of components and to provide performance metrics to developers.
 * @member actualStartTime - The time at which the rendering of the current Fiber node started during the previous render cycle.
 * @member key - The key a user assigned to the component or null if they didn't assign one
 * @member context - {in experiment} - An object contains all context information of the current component
 * @member index - {class component only} - The index of the bound setState method stored in `componentActionsRecord`
 * @member hooksState - {functional component only} - An object contains all states of the current functional component
 * @member hooksIndex - {functional component only} - An array of index of the bound dispatch method stored in `componentActionsRecord`
 * @member props - An object contains all props of the current component
 * @member selfBaseDuration - The base duration of the current Fiber node's render phase (excluding the time taken to render its children). This field is only set when the enableProfilerTimer flag is enabled.
 * @member state - {class component only} - An object contains all states of the current class component
 * @member treeBaseDuration - The total base duration of the current Fiber node's subtree. This field is only set when the enableProfilerTimer flag is enabled.
 */
export interface ComponentData {
  /** The time taken to render the current Fiber node and its descendants during the previous render cycle. */
  actualDuration?: number;
  /** The time at which the rendering of the current Fiber node started during the previous render cycle. */
  actualStartTime?: number;
  /**The key a user assigned to the component or null if they didn't assign one */
  key: string | null;
  /** {in experiment} - An object contains all context information of the current component */
  context: {};
  /** {class component only} - The index of the bound setState method stored in `componentActionsRecord`  */
  index: number | null;
  /** {functional component only} - An object contains all states of the current functional component */
  hooksState: {} | null;
  reducerStates?: Array<{
    state: any;
    lastAction: any;
    reducerIndex: number;
    hookName: string;
  }> /** {functional component only} - An array of index of the bound dispatch method stored in `componentActionsRecord` */;
  hooksIndex: number[] | null;
  /** An object contains all props of the current component */
  props: { [key: string]: any };
  /** The base duration of the current Fiber node's render phase (excluding the time taken to render its children). */
  selfBaseDuration?: number;
  /** An object contains all states of the current class component */
  state: { [key: string]: any } | null;
  /** The total base duration of the current Fiber node's subtree. */
  treeBaseDuration?: number;
}

/**
 * @member state - states within the current functional component
 * @member component - contains bound dispatch method to update state of the current functional component
 */
export interface HookStateItem {
  component: any;
  state: any;
  isReducer: boolean;
  lastAction?: any;
  reducer?: Function;
}

export type WorkTag =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

export const FunctionComponent = 0;
export const ClassComponent = 1;
/** Before we know whether it is function or class */
export const IndeterminateComponent = 2;
/** Root of a host tree. Could be nested inside another node. */
export const HostRoot = 3;
/** A subtree. Could be an entry point to a different renderer. */
export const HostPortal = 4;
/**
 * Host Component: a type of component that represents a native DOM element in the browser environment, such as div, span, input, h1 etc.
 */
export const HostComponent = 5; // has stateNode of html elements
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15; // A higher order component where if the component renders the same result given the same props, react skips rendering the component and uses last rendered result. Has memoizedProps/memoizedState but no stateNode
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const FundamentalComponent = 20;
export const ScopeComponent = 21;
export const Block = 22;
export const OffscreenComponent = 23;
export const LegacyHiddenComponent = 24;

/**
 * @type Fiber - The internal data structure that represents a `fiberNode` or a component in the React component tree
 *
 * {@link https://indepth.dev/posts/1008/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react}
 * @member actualDuration - The time taken to render the current Fiber node and its descendants during the previous render cycle. This value is used to optimize the rendering of components and to provide performance metrics to developers.
 * @member actualStartTime - The time at which the rendering of the current Fiber node started during the previous render cycle.
 * @member child - Pointer to the first child.
 * @member elementType  - The type of the current Fiber node's element (e.g. the component function or class, or the DOM element type). For class/functional component, elmementType stores the function definition.
 * @member key - The key a user assigned to the component or null if they didn't assign one
 * @member memoizedProps - The current props of the component associated with the current Fiber node.
 * @member memoizedState - The current state of the component associated with the current Fiber node.
 * @member selfBaseDuration - The base duration of the current Fiber node's render phase (excluding the time taken to render its children). This field is only set when the enableProfilerTimer flag is enabled.
 * @member sibling - Pointer to next sibling
 * @member stateNode - The local state associated with this fiber. For classComponent, stateNode contains current state and the bound update methods of the component
 * @member tag - The type of the current Fiber node, such as FunctionComponent, ClassComponent, or HostComponent (for DOM elements).
 * @member treeBaseDuration - The total base duration of the current Fiber node's subtree. This field is only set when the enableProfilerTimer flag is enabled.
 * @member _debugHookTypes - An array of hooks used for debugging purposes.
 */
export type Fiber = {
  /**
   * Time spent rendering this Fiber and its descendants for the current update.
   *
   * This tells us how well the tree makes use of sCU for memoization. It is reset to 0 each time we render and only updated when we don't bailout.
   *
   * This field is only set when the enableProfilerTimer flag is enabled.
   */
  actualDuration?: number;

  /**
   * If the Fiber is currently active in the "render" phase, this marks the time at which the work began.
   *
   * This field is only set when the enableProfilerTimer flag is enabled.
   */
  actualStartTime?: number;

  // Singly Linked List Tree Structure.
  /** Pointer to the first child. */
  child: Fiber | null;

  /**
   * The type of the current Fiber node's element (e.g. the component function or class, or the DOM element type).
   *
   * For class/functional component, elmementType stores the function definition.
   */
  elementType: any;

  /**
   * Unique key string assigned by the user when making component on null if they didn't assign one
   */
  key: string | null;

  /** The current state for a functional component associated with the current Fiber node. */
  memoizedState: any;

  /** The current props of the component associated with the current Fiber node. */
  memoizedProps: any;

  /**
   * Duration of the most recent render time for this Fiber. This value is not updated when we bailout for memoization purposes.
   *
   * This field is only set when the enableProfilerTimer flag is enabled.
   */
  selfBaseDuration?: number;

  // Singly Linked List Tree Structure.
  /**  Pointer to next sibling */
  sibling: Fiber | null;

  /**
   * The local state associated with this fiber.
   *
   * For classComponent, stateNode contains current state and the bound update methods of the component.
   */
  stateNode: any;

  /** The type of the current Fiber node, such as FunctionComponent, ClassComponent, or HostComponent (for DOM elements). */
  tag: WorkTag;

  /**
   * Sum of base times for all descendants of this Fiber. This value bubbles up during the "complete" phase.
   *
   * This field is only set when the enableProfilerTimer flag is enabled.
   */
  treeBaseDuration?: number;

  /** An array of hooks used for debugging purposes. */
  _debugHookTypes: string[] | null;
};

/**
 * @type FiberRoot - The internal data structure that represents a fiberRootNode or the top-level node of a single component tree
 *
 * FiberRoot data structure has several properties. For Reactime, we only access the `current` property which contains the tree structure made of `fiberNode`. Each `fiberNode` contains a component data in the React component tree.
 */
export type FiberRoot = {
  current: Fiber;
};
