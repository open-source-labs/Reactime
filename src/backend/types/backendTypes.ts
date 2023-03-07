/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Tree from '../tree';

/**
 * The snapshot of the current tree
 * @param tree - {Tree} - The tree structure to send to front end
 * @param unfilteredTree - {null} - The current mode (i.e. jumping, time-traveling, or paused)
 */
export interface Snapshot {
  tree: Tree;
  unfilteredTree: null;
}

/**
 * Where we
 * @param jumping - whether we are jumping steps by
 * @param paused - true/false for whether pausing to see the state
 */
export interface Mode {
  jumping: boolean;
  paused: boolean;
}

/**
 *
 */
export interface SnapshotNode {
  name: string;
  state: {
    location?: any;
  };
  children: any[];
}
/**
 * @param data - an object with action & payload properties
 */
export interface MsgData {
  data: {
    action: string;
    payload: any;
  };
}

/**
 *
 * @param index -
 * @param hooksIndex -
 * @param actualDuration -
 * @param actualStartTime -
 * @param selfBaseDuration -
 * @param treeBaseDuration -
 * @param props -
 */
export interface ComponentData {
  index?: number;
  hooksIndex?: number;
  actualDuration?: number;
  actualStartTime?: number;
  selfBaseDuration?: number;
  treeBaseDuration?: number;
  props?: any;
}

/**
 * @param state -
 * @param component -
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

export interface State {
  state?: {} | number;
  hooksState?: HookStates;
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
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
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

export type Fiber = {
  // Tag identifying the type of fiber.
  tag: WorkTag;

  // Unique identifier of this child.
  key: null | string;

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any;

  // The resolved function/class/ associated with this fiber.
  type: any;

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
  index: number;

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

  dependencies: any;

  _debugHookTypes: any;
};
