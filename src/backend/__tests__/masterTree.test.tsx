import createComponentActionsRecord from '../controllers/createTree/createComponentActionsRecord';
import { Fiber } from '../types/backendTypes';
import componentActionsRecord from '../models/masterState';
import createTree from '../controllers/createTree/createTree';
import Tree from '../models/tree';
import React, { useState } from 'react';
import {
  allowedComponentTypes,
  nextJSDefaultComponent,
  remixDefaultComponents,
} from '../models/filterConditions';

describe('master tree tests', () => {
  let mockTree = new Tree('root', 'root');
  let mockFiberNode: Fiber;
  let mockSiblingNode: Fiber;
  let mockChildNode: Fiber;
  function MockFunctionalComponent() {
    const [count, setCount] = useState(0);
    return (
      <div>
        <button className='increment' onClick={() => setCount(count + 1)}>
          You clicked me {count} times.
        </button>
      </div>
    );
  }

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

    // create a mock child Fiber node with relevant properties for class component
    mockChildNode = {
      ...mockFiberNode,
      tag: 1,
      elementType: { name: 'child' },
      stateNode: { state: { counter: 0 }, props: { start: 0 } },
    };

    // create a mock sibling Fiber node with relevant properties for class component
    mockSiblingNode = {
      ...mockFiberNode,
      tag: 0,
      elementType: MockFunctionalComponent,
      memoizedState: { memoizedState: 1, queue: [{}, { state: { value: 'test' } }], next: null },
    };
    // clear the saved component actions record
    componentActionsRecord.clear();
  });
  describe('create tree tests', () => {
    xit('should return a Tree if we pass in a empty fiber node', () => {
      const tree = createTree(mockFiberNode);
      const children = tree.children;

      expect(tree).toBeInstanceOf(Tree);
      expect(tree.name).toEqual('root');
      expect(tree.state).toEqual('root');
      expect(children[0].name).toEqual('nameless');
      expect(children[0].state).toEqual('stateless');
    });

    xit('should filter out NextJS default components with no children or siblings', () => {
      for (let name of nextJSDefaultComponent) {
        mockFiberNode.elementType.name = name;
        const tree = createTree(mockFiberNode);
        const newTree = new Tree('root', 'root');
        expect(tree).toEqual(newTree);
      }
    });

    it('should filter out NextJS default components with children and/or siblings', () => {
      for (let name of nextJSDefaultComponent) {
        mockFiberNode.elementType.name = name;
        mockFiberNode.child = mockChildNode;
        mockFiberNode.sibling = mockSiblingNode;
        const tree = createTree(mockFiberNode);
        const children = tree.children;
        const firstChild = children[0];
        const secondChild = children[1];
        console.log('First Child', firstChild);
        console.log('Second Child', secondChild);
        expect(children.length).toEqual(2);
        expect(firstChild.componentData.state).toEqual({ counter: 0 });
        expect(secondChild.componentData.hooksState);
      }
    });

    xit('should filter out remix default components with no children or siblings', () => {
      for (let name of remixDefaultComponents) {
        mockFiberNode.elementType.name = name;
        const tree = createTree(mockFiberNode);
      }
    });

    xit('should only traverse allowed components', () => {
      for (let tag of allowedComponentTypes) {
        mockFiberNode.elementType.tag = tag;
        const tree = createTree(mockFiberNode);
        const children = tree.children;

        expect(tree.name).toEqual('root');
        expect(tree.state).toEqual('root');
        expect(children[0].name).toEqual('nameless');
        expect(children[0].state).toEqual('stateless');
      }
    });
  });

  xdescribe('add sibling', () => {});

  xdescribe('add children', () => {});

  xdescribe('createComponentActionsRecord', () => {
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
      // create a mock component action record
    });

    it('should not save a new component action record if the Fiber node is not a relevant component type', () => {
      mockFiberNode.tag = 4; // HostRoot
      createComponentActionsRecord(mockFiberNode);
      expect(componentActionsRecord.getAllComponents()).toHaveLength(0);
    });
  });
});
