import { Fiber } from '../../types/backendTypes';
import { FunctionComponent } from '../../types/backendTypes';

// -------------------TEST CASE FOR COMPONENT WITH PROPS-----------------------
export const Router: Fiber = {
  tag: FunctionComponent,
  elementType: { name: 'Router' },
  sibling: null,
  stateNode: null,
  child: null,
  memoizedState: {
    memoizedState: null,
    queue: null,
  },
  memoizedProps: { location: { pathname: '/tictactoe' } },
  actualDuration: 1,
  actualStartTime: 2,
  selfBaseDuration: 3,
  treeBaseDuration: 4,
  _debugHookTypes: ['useContext', 'useMemo', 'useMemo'],
};
export const RenderedRoute: Fiber = {
  tag: FunctionComponent,
  elementType: { name: 'RenderedRoute' },
  sibling: null,
  stateNode: null,
  child: null,
  memoizedState: null,
  memoizedProps: { match: { pathname: '/tictactoe' } },
  actualDuration: 1,
  actualStartTime: 2,
  selfBaseDuration: 3,
  treeBaseDuration: 4,
  _debugHookTypes: ['useContext'],
};
