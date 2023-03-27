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
 * @member index -
 * @member hooksIndex -
 * @member actualDuration -
 * @member actualStartTime -
 * @member selfBaseDuration -
 * @member treeBaseDuration -
 * @member props -
 */
export interface ComponentData {
  actualDuration?: number;
  actualStartTime?: number;
  selfBaseDuration?: number;
  treeBaseDuration?: number;
  props: { [key: string]: any };
  context: {};
  state: { [key: string]: any } | null;
  hooksState: {} | null;
  hooksIndex: number[] | null;
  index: number | null;
}

/**
 * @type HookStateItem
 * @member state -
 * @member component -
 */
export interface HookStateItem {
  state: any;
  component: any;
}

/**
 * HookeStates is an array of HookeStateItem
 * Each HookStateItem is an object with state & component properties
 */
export type HookStates = Array<HookStateItem>;

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
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
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
 * @member dependencies - An array of values (such as state or props) that the current Fiber node depends on. This is used to determine whether the node needs to be re-rendered.
 * @member elementType  - The type of the current Fiber node's element (e.g. the component function or class, or the DOM element type). Example: div, h1,
 * @member index - Index of the current Fiber node. Ex: if a div has 3 headings. The first child is heading with index = 0. The next sibling is a heading with index = 1 & the last sibling is a heading with index = 2.
 * @member key - Unique identifier of this child, used to identify the node when rendering lists of components.
 * @member memoizedProps - The current props of the component associated with the current Fiber node.
 * @member memoizedState - The current state of the component associated with the current Fiber node.
 * @member selfBaseDuration - The base duration of the current Fiber node's render phase (excluding the time taken to render its children). This field is only set when the enableProfilerTimer flag is enabled.
 * @member sibling - Pointer to next sibling
 * @member stateNode - The local state associated with this fiber.
 * @member tag - The type of the current Fiber node, such as FunctionComponent, ClassComponent, or HostComponent (for DOM elements).
 * @member treeBaseDuration - The total base duration of the current Fiber node's subtree. This field is only set when the enableProfilerTimer flag is enabled.
 * @member type - Same as elementType.
 * @member _debugHookTypes - An array of hooks used for debugging purposes.
 */
export type Fiber = {
  // Tag identifying the type of fiber.
  tag: WorkTag;

  // Unique identifier of this child.
  // key: null | string;

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any;

  // The resolved function/class/ associated with this fiber.
  // type: any;

  // The local state associated with this fiber.
  stateNode: any;

  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  // return: Fiber | null,

  // Singly Linked List Tree Structure.
  child: Fiber | null;
  sibling: Fiber | null;
  // index: number;

  // Input is the data coming into process this fiber. Arguments. Props.
  // pendingProps: any, // This type will be more specific once we overload the tag.
  // memoizedProps: any, // The props used to create the output.

  // The state used to create the output
  memoizedState: any;

  memoizedProps: any;

  // Singly linked list fast path to the next fiber with side-effects.
  // nextEffect: Fiber | null,

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  // alternate: Fiber | null,

  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number;

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number;

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number;

  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number;

  // dependencies: any;

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
