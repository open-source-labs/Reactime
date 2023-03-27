import Tree from '../../models/tree';
import routes from '../../models/routes';
import { ComponentData, Fiber } from '../../types/backendTypes';
import { FunctionComponent, ClassComponent, HostRoot } from '../../types/backendTypes';
import IncrementFunc from './IncrementFunc';
import IncrementClass from './IncrementClass';
import componentActionsRecord from '../../models/masterState';
import deepCopy from './deepCopy';

// ----------------------------TEST CASES FOR ROOT------------------------------
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

// ----------------------TEST CASE FOR FUNCTIONAL COMPONENT---------------------
export const functionalComponent: Fiber = {
  tag: FunctionComponent,
  elementType: IncrementFunc,
  sibling: null,
  stateNode: null,
  child: null,
  memoizedState: {
    memoizedState: 0,
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

const functionalComponentData: ComponentData = {
  actualDuration: 1,
  actualStartTime: 2,
  selfBaseDuration: 3,
  treeBaseDuration: 4,
  context: {},
  hooksIndex: [0],
  hooksState: { count: 0 },
  index: null,
  props: {},
  state: null,
};

componentActionsRecord.clear();
export const functionalPayload: Tree = new Tree('root', 'root');
functionalPayload.route = rootPayload.route;
functionalPayload.addChild({ count: 0 }, 'IncrementFunc', functionalComponentData, null);

// -----------------------TEST CASE FOR CLASS COMPONENT-------------------------

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
classComponent.stateNode.setState = classComponent.stateNode.setState.bind(
  classComponent.stateNode,
);

const classComponentData: ComponentData = {
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

componentActionsRecord.clear();
export const classPayload = new Tree('root', 'root');
classPayload.route = rootPayload.route;
classPayload.addChild({ count: 0 }, 'IncrementClass', classComponentData, null);

componentActionsRecord.clear();
export const updateClassPayload = new Tree('root', 'root');
updateClassPayload.route = rootPayload.route;
updateClassPayload.addChild(
  { count: 2 },
  'IncrementClass',
  { ...classComponentData, state: { count: 2 } },
  null,
);

// -----------------------TEST CASE FOR MIX OF COMPONENTS-----------------------
componentActionsRecord.clear();
export const mixComponents: Fiber = deepCopy(root);
mixComponents.child = deepCopy(functionalComponent);
mixComponents.sibling = deepCopy(classComponent);
mixComponents.child!.child = deepCopy(functionalComponent);
mixComponents.child!.child!.sibling = deepCopy(classComponent);
// console.dir(mixComponents, { depth: null });

export const mixPayload = new Tree('root', 'root');
mixPayload.route = rootPayload.route;

// Outer Func Comp
let funcPayloadMix = new Tree({ count: 0 }, 'IncrementFunc', functionalComponentData, null);
funcPayloadMix.componentData = {
  ...funcPayloadMix.componentData,
  hooksState: { count: 0 },
  hooksIndex: [0],
};
mixPayload.children.push(deepCopy(funcPayloadMix));

// Outer Class Comp
let classPayloadMix = new Tree({ count: 0 }, 'IncrementClass', classComponentData, null);
classPayloadMix.componentData = {
  ...classPayloadMix.componentData,
  state: { count: 0 },
  index: 3,
};
mixPayload.children.push(deepCopy(classPayloadMix));

// Inner Func Comp
funcPayloadMix = new Tree({ count: 0 }, 'IncrementFunc', functionalComponentData, null);
funcPayloadMix.componentData = {
  ...funcPayloadMix.componentData,
  hooksState: { count: 0 },
  hooksIndex: [1],
};
funcPayloadMix.name = 'IncrementFunc1';
mixPayload.children[0].children.push(deepCopy(funcPayloadMix));

// Inner Class Comp
classPayloadMix = new Tree({ count: 0 }, 'IncrementClass', classComponentData, null);
classPayloadMix.componentData = {
  ...classPayloadMix.componentData,
  state: { count: 0 },
  index: 2,
};
mixPayload.children[0].children.push(deepCopy(classPayloadMix));

// console.dir(mixPayload, { depth: null });
