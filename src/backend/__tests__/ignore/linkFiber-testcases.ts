import Tree from '../../models/tree';
import routes from '../../models/routes';
import { ComponentData, Fiber } from '../../types/backendTypes';
import { FunctionComponent, ClassComponent, HostRoot } from '../../types/backendTypes';
import IncrementFunc from './IncrementFunc';
import IncrementClass from './IncrementClass';

export const root: Fiber = {
  tag: HostRoot,
  elementType: null,
  sibling: null,
  stateNode: null,
  child: null,
  memoizedState: null,
  memoizedProps: null,
  actualDuration: 1,
  actualStartTime: 2,
  selfBaseDuration: 3,
  treeBaseDuration: 4,
  _debugHookTypes: null,
};
export const rootPayload = new Tree('root', 'root');
rootPayload.route = routes.addRoute('http://localhost/');

export const functionalComponent: Fiber = {
  tag: FunctionComponent,
  elementType: IncrementFunc,
  sibling: null,
  stateNode: null,
  child: null,
  memoizedState: {
    memoizeState: 0,
    queue: {
      dispatch: function (newState) {
        this.memoizedState = newState;
      },
    },
  },
  memoizedProps: {},
  actualDuration: 1,
  actualStartTime: 2,
  selfBaseDuration: 3,
  treeBaseDuration: 4,
  _debugHookTypes: ['useState'],
};

export const classComponent: Fiber = {
  tag: ClassComponent,
  elementType: IncrementClass,
  sibling: null,
  stateNode: {
    state: { count: 0 },
    setState: function (callback) {
      this.state = { ...callback() };
    },
  },
  child: null,
  memoizedState: {
    count: 0,
  },
  memoizedProps: {},
  actualDuration: 1,
  actualStartTime: 2,
  selfBaseDuration: 3,
  treeBaseDuration: 4,
  _debugHookTypes: null,
};

export const classPayload = new Tree('root', 'root');
classPayload.route = rootPayload.route;

// Append increment child to root
const componentData: ComponentData = {
  actualDuration: 1,
  actualStartTime: 2,
  selfBaseDuration: 3,
  treeBaseDuration: 4,
  context: {},
  hooksIndex: null,
  hooksState: null,
  index: 0,
  props: {},
  state: { count: 0 },
};
classPayload.addChild({ count: 0 }, 'IncrementClass', componentData, null);

export const updateClassPayload = new Tree('root', 'root');
updateClassPayload.route = rootPayload.route;
updateClassPayload.addChild(
  { count: 2 },
  'IncrementClass',
  { ...componentData, state: { count: 2 } },
  null,
);
