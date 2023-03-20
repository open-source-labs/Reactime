import createComponentActionsRecord from '../controllers/createTree/createComponentActionsRecord';
import { Fiber } from '../types/backendTypes';
import componentActionsRecord from '../models/masterState';

describe('master tree tests', () => {
  describe('createComponentActionsRecord', () => {
    let mockFiberNode: Fiber;
    beforeEach(() => {
      // create a mock Fiber node with relevant properties
      mockFiberNode = {
        sibling: null,
        stateNode: {},
        child: null,
        memoizedState: null,
        elementType: {},
        tag: 2, // IndeterminateComponent
        key: null,
        type: null,
        index: 0,
        memoizedProps: null,
        dependencies: null,
        _debugHookTypes: [],
      };
      // clear the saved component actions record
      componentActionsRecord.clear();
    });

    it('should save a new component action record if the Fiber node is a stateful class component', () => {
      mockFiberNode.tag = 1; // ClassComponent
      mockFiberNode.stateNode = {
        state: { counter: 0 }, // a mock state object
        setState: jest.fn(), // a mock setState method
      };
      createComponentActionsRecord(mockFiberNode);
      expect(componentActionsRecord.getComponentByIndex(0)).toBe(mockFiberNode.stateNode);
    });

    it('should save a new component action record if the Fiber node is a stateful class component with props', () => {
      mockFiberNode.tag = 1; // ClassComponent
      // a mock state object
      mockFiberNode.stateNode = {
        state: { counter: 0 },
        props: { start: 0 },
        setState: jest.fn(), // a mock setState method
      };
      createComponentActionsRecord(mockFiberNode);
      expect(componentActionsRecord.getComponentByIndex(0)).toMatchObject({
        props: mockFiberNode.stateNode.props,
        state: mockFiberNode.stateNode.state,
      });
    });

    it('should save a new component action record if the Fiber node is a functional component with state', () => {
      mockFiberNode.tag = 0; // FunctionComponent
      mockFiberNode.memoizedState = {
        queue: [{}, { state: { value: 'test' } }], // a mock memoizedState object
      };
      createComponentActionsRecord(mockFiberNode);
      expect(componentActionsRecord.getComponentByIndex(0)).toBe(mockFiberNode.memoizedState.queue);
    });

    it('should save multiple component action records when called multiple times with different Fiber nodes', () => {
      mockFiberNode.tag = 1; // ClassComponent
      mockFiberNode.stateNode = {
        state: { counter: 0 },
        props: { start: 0 }, // a mock state object
        setState: jest.fn(), // a mock setState method
      };
      createComponentActionsRecord(mockFiberNode);
      expect(componentActionsRecord.getComponentByIndex(0)).toMatchObject({
        state: mockFiberNode.stateNode.state,
        props: mockFiberNode.stateNode.props,
      });

      const mockFiberNode2: Fiber = { ...mockFiberNode };
      mockFiberNode2.stateNode.props = { start: 1 }; // a different mock memoizedProps object
      createComponentActionsRecord(mockFiberNode2);
      expect(componentActionsRecord.getComponentByIndex(1)).toMatchObject({
        state: mockFiberNode2.stateNode.state,
        props: mockFiberNode2.stateNode.props,
      });
    });

    it('should return the correct hooks array for a given component index', () => {
      const component1 = { state: 'dummy state', props: {} };
      const component2 = { state: 'dummy state2', props: {} };
      const component3 = { state: 'dummy state3', props: {} };
      componentActionsRecord.saveNew(component1);
      componentActionsRecord.saveNew(component2);
      componentActionsRecord.saveNew(component3);
      // create a mock component action record
      const mockComponentActionRecord = {
        index: 0,
        hooks: ['mock hook 1', 'mock hook 2', 'mock hook 3'],
      };
      componentActionsRecord.addOrUpdateComponent(mockComponentActionRecord);

      // call the getComponentByIndexHooks function with the mock index
      const hooksArray = componentActionsRecord.getComponentByIndexHooks(0);

      // assert that the returned hooks array matches the expected value
      expect(hooksArray).toEqual(mockComponentActionRecord.hooks);
    });

    it('should not save a new component action record if the Fiber node is not a relevant component type', () => {
      mockFiberNode.tag = 4; // HostRoot
      createComponentActionsRecord(mockFiberNode);
      expect(componentActionsRecord.getAllComponents()).toHaveLength(0);
    });
  });
});
