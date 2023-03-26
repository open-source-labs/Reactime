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
  WorkTag,
} from '../types/backendTypes';

export const allowedComponentTypes: Set<WorkTag> = new Set([
  FunctionComponent,
  ClassComponent,
  ContextProvider,
  IndeterminateComponent,
]);
export const nextJSDefaultComponent = new Set([
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

export const remixDefaultComponents = new Set([
  'RemixBrowser',
  'Remix',
  'RemixErrorBoundary',
  'RouterProvider',
  'DataRouter',
  'DataRouterState',
  'RenderErrorBoundary',
  'Meta',
  'V1Meta',
  'Links',
  'RemixRoute',
  'Outlet',
  'ScrollRestoration2',
  'script',
  'Scripts',
  'LiveReload2',
]);
