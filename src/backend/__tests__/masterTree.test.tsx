import createTree from '../controllers/createTree';
import componentActionsRecord from '../models/masterState';
import createComponentActionsRecord from '../controllers/createComponentActionsRecord';
import {
  Fiber,
  FunctionComponent,
  ClassComponent,
  IndeterminateComponent,
  ComponentData,
  WorkTag,
} from '../types/backendTypes';
import { IncrementFuncMultiStates } from './ignore/IncrementFunc';
import Tree from '../models/tree';
import {
  root,
  functionalComponent,
  functionalPayload,
  classComponent,
  classPayload,
} from './ignore/stateComponents-testcases';

import { serializeState } from '../models/tree';
import {
  allowedComponentTypes,
  nextJSDefaultComponent,
  remixDefaultComponents,
  exclude,
} from '../models/filterConditions';
import deepCopy from './ignore/deepCopy';
import { Children } from 'react';
import _ from 'lodash';

describe('master tree tests', () => {
  let treeRoot: Tree;
  let mockFiberNode: Fiber;
  const mockComponentData: ComponentData = {
    actualDuration: 1,
    actualStartTime: 2,
    selfBaseDuration: 3,
    treeBaseDuration: 4,
    key: null,
    context: {},
    hooksIndex: null,
    hooksState: null,
    index: null,
    props: {},
    state: null,
  };
  let mockFiberTree: Tree;
  /** `mockChildNode` is a CLASS COMPONENT*/
  let mockChildNode: Fiber;
  let mockChildTree: Tree;

  /** `mockSibilingNode` is a FUNCTIONAL COMPONENT*/
  let mockSiblingNode: Fiber;
  let mockSiblingTree: Tree;

  beforeEach(() => {
    // create tree root:
    treeRoot = new Tree('root', 'root');
    // create a mock Fiber node with relevant properties
    mockFiberNode = { ...root, tag: IndeterminateComponent };
    mockFiberTree = new Tree('root', 'root');
    mockFiberTree.addChild('stateless', 'nameless', mockComponentData, null);

    // create a mock child Fiber node with relevant properties for class component
    mockChildNode = deepCopy(classComponent);
    // Since payload will have a root then the component, need to extract the child component
    mockChildTree = deepCopy(classPayload.children[0]);

    // create a mock sibling Fiber node with relevant properties for class component
    mockSiblingNode = deepCopy(functionalComponent);
    // Since payload will have a root then the component, need to extract the child component
    mockSiblingTree = deepCopy(functionalPayload.children[0]);

    // clear the saved component actions record
    componentActionsRecord.clear();
  });
  describe('createTree Unit test', () => {
    describe('Filter components that are from NextJS, Remix or not from allowed component types', () => {
      it('should return a Tree if we pass in a empty fiber node', () => {
        const tree = createTree(mockFiberNode);
        expect(tree).toEqual(mockFiberTree);
      });

      it('should filter out NextJS default components with no children or siblings', () => {
        for (let name of nextJSDefaultComponent) {
          mockFiberNode.elementType = { name };
          const tree = createTree(mockFiberNode);
          expect(tree).toEqual(treeRoot);
          expect(tree).not.toEqual(mockFiberTree);
        }
      });
      it('should filter out remix default components with no children or siblings', () => {
        for (let name of remixDefaultComponents) {
          mockFiberNode.elementType = { name };
          const tree = createTree(mockFiberNode);
          expect(tree).toEqual(treeRoot);
          expect(tree).not.toEqual(mockFiberTree);
        }
      });

      it('should only traverse allowed components', () => {
        for (let tag: any = 1; tag <= 24; tag++) {
          mockFiberNode.tag = tag;
          const tree = createTree(mockFiberNode);
          if (allowedComponentTypes.has(tag)) {
            expect(tree).toEqual(mockFiberTree);
          } else {
            expect(tree).toEqual(treeRoot);
          }
        }
      });
      it('should filter out NextJS & Remix default components with children and/or siblings', () => {
        (mockChildTree.componentData as ComponentData).index = 0;
        (mockSiblingTree.componentData as ComponentData).hooksIndex = [1];
        treeRoot.children.push(mockChildTree);
        treeRoot.children.push(mockSiblingTree);
        for (let name of nextJSDefaultComponent) {
          componentActionsRecord.clear(); // reset index counts for component actions
          mockFiberNode.elementType = { name };
          mockFiberNode.child = mockChildNode;
          mockFiberNode.sibling = mockSiblingNode;
          const tree = createTree(mockFiberNode);
          const children = tree.children;
          expect(children.length).toEqual(2);
          expect(children[0]).toEqual(mockChildTree);
          expect(children[1]).toEqual(mockSiblingTree);
          expect(tree).toEqual(treeRoot);
        }
        for (let name of remixDefaultComponents) {
          componentActionsRecord.clear(); // reset index counts for component actions
          mockFiberNode.elementType = { name };
          mockFiberNode.child = mockChildNode;
          mockFiberNode.sibling = mockSiblingNode;
          const tree = createTree(mockFiberNode);
          const children = tree.children;
          expect(children.length).toEqual(2);
          expect(children[0]).toEqual(mockChildTree);
          expect(children[1]).toEqual(mockSiblingTree);
          expect(tree).toEqual(treeRoot);
        }
      });
    });
    describe('Display component props information', () => {
      const memoizedProps = {
        propVal: 0,
        propFunc: jest.fn,
        propObj: { dummy: 'dummy' },
      };
      const props = {
        propVal: 0,
        propFunc: 'function',
        propObj: JSON.stringify({ dummy: 'dummy' }),
      };
      it('should display functional props information', () => {
        mockChildNode.memoizedProps = memoizedProps;
        (mockChildTree.componentData as ComponentData).props = props;
        treeRoot.children.push(mockChildTree);

        const tree = createTree(mockChildNode);
        expect(tree).toEqual(treeRoot);
      });
      it('should display class props information', () => {
        mockSiblingNode.memoizedProps = memoizedProps;
        (mockSiblingTree.componentData as ComponentData).props = props;
        treeRoot.children.push(mockSiblingTree);

        const tree = createTree(mockSiblingNode);
        expect(tree).toEqual(treeRoot);
      });
      it('should display React router props information', () => {
        (mockSiblingTree.componentData as ComponentData) = {
          ...(mockSiblingTree.componentData as ComponentData),
          props: { pathname: '/tictactoe' },
          hooksIndex: null,
          hooksState: null,
        };
        mockSiblingTree.state = 'stateless';

        // For components in react router, there are different way to extract pathname prop
        const reactRouterProp = {
          Router: { location: { pathname: '/tictactoe' } },
          RenderedRoute: { match: { pathname: '/tictactoe' } },
        };

        for (const componentName in reactRouterProp) {
          // Router Component
          mockSiblingNode.memoizedProps = {
            ...memoizedProps,
            ...reactRouterProp[componentName],
          };
          mockSiblingNode.elementType = { name: componentName };
          mockSiblingTree.name = componentName;
          treeRoot.children = [mockSiblingTree];

          const routerTree = createTree(mockSiblingNode);
          expect(routerTree).toEqual(treeRoot);
        }
      });
      it('should exclude reserved props name', () => {
        (mockChildTree.componentData as ComponentData).props = props;
        treeRoot.children.push(mockChildTree);

        for (let propName of exclude) {
          componentActionsRecord.clear(); // reset index counts for component actions
          mockChildNode.memoizedProps = { ...memoizedProps, [propName]: 'anything' };
          const tree = createTree(mockChildNode);
          expect(tree).toEqual(treeRoot);
        }
      });
      it('should skip circular props', () => {
        mockChildNode.memoizedProps = {
          ...memoizedProps,
          cir: mockChildNode,
          noCir: 'Not a circular props',
        };
        (mockChildTree.componentData as ComponentData).props = {
          ...props,
          noCir: 'Not a circular props',
        };
        treeRoot.children.push(mockChildTree);

        const tree = createTree(mockChildNode);
        expect(tree).toEqual(treeRoot);
      });

      it('should display props information of multiple components', () => {
        // Construct Fiber Node (root => FiberNode => child1 => child2 & sibling1)
        mockChildNode.memoizedProps = memoizedProps;
        const child1 = deepCopy(mockChildNode);
        child1.memoizedProps.name = 'child1';
        const child2 = deepCopy(mockChildNode);
        child2.memoizedProps.name = 'child2';
        mockSiblingNode.memoizedProps = memoizedProps;
        const sibling1 = deepCopy(mockSiblingNode);
        sibling1.memoizedProps.name = 'sibling1';
        mockFiberNode.child = child1;
        child1.child = child2;
        child2.sibling = sibling1;
        const tree = createTree(mockFiberNode);

        // Construct result tree (root => FiberTree => childTree1 => childTree2 & siblingTree1)
        (mockChildTree.componentData as ComponentData).props = props;
        const childTree1 = deepCopy(mockChildTree);
        childTree1.name = 'IncrementClass';
        (childTree1.componentData as ComponentData).props.name = 'child1';
        (childTree1.componentData as ComponentData).index = 0;
        const childTree2 = deepCopy(mockChildTree);
        childTree2.name = 'IncrementClass1';
        (childTree2.componentData as ComponentData).props.name = 'child2';
        (childTree2.componentData as ComponentData).index = 1;
        (mockSiblingTree.componentData as ComponentData).props = props;
        const siblingTree1 = deepCopy(mockSiblingTree);
        siblingTree1.name = 'IncrementFunc';
        (siblingTree1.componentData as ComponentData).hooksIndex = [2];
        (siblingTree1.componentData as ComponentData).props.name = 'sibling1';

        mockFiberTree.children[0].children = [childTree1];
        childTree1.children.push(childTree2, siblingTree1);

        // Compare the two trees:
        expect(tree).toEqual(mockFiberTree);
      });
    });
    describe('Display component states information', () => {
      const stateNode = {
        state: {
          propVal: 0,
          propObj: { dummy: 'dummy' },
        },
        setState: function (cb: Function) {
          this.state = cb();
        }.bind(this),
      };
      const classState = stateNode.state;

      const memoizedState = {
        memoizedState: { dummy: 'dummy' },
        next: null,
        queue: {
          dispatch: function (newState) {
            this.memoizedState = newState;
          }.bind(this),
        },
      };
      const memoizedState2 = {
        memoizedState: { dummy2: 'dummy2' },
        next: null,
        queue: {
          dispatch: function (newState) {
            this.memoizedState = newState;
          }.bind(this),
        },
      };
      // Note: the key count is the variable state name within the incrementFunction that is assigned to mockSiblingTree
      const functionalState = { count: memoizedState.memoizedState };
      const functionalState2 = { count1: memoizedState2.memoizedState };
      it('should display stateless if functional state empty', () => {
        // Construct Fiber Node (root => childNode)
        mockChildNode.stateNode = null;
        const tree = createTree(mockChildNode);

        // Construct Result Tree (root => childTree)
        mockChildTree.state = 'stateless';
        (mockChildTree.componentData as ComponentData).state = null;
        (mockChildTree.componentData as ComponentData).index = null;
        treeRoot.children.push(mockChildTree);

        // Compare the two trees:
        expect(tree).toEqual(treeRoot);
      });

      it('should display class state information', () => {
        // Construct Fiber Node (root => childNode)
        mockChildNode.stateNode = stateNode;
        const tree = createTree(mockChildNode);

        // Construct Result Tree (root => childTree)
        mockChildTree.state = classState;
        (mockChildTree.componentData as ComponentData).state = classState;
        treeRoot.children.push(mockChildTree);

        // Compare the two trees:
        expect(tree).toEqual(treeRoot);
      });

      it('should keep track of class state index', () => {
        // Construct Fiber Node (root => FiberNode => child1 => child 2 & 3)
        mockChildNode.stateNode = stateNode;
        const child1 = deepCopy(mockChildNode);
        const child2 = deepCopy(mockChildNode);
        const child3 = deepCopy(mockChildNode);
        mockFiberNode.child = child1;
        child1.child = child2;
        child2.sibling = child3;
        const tree = createTree(mockFiberNode);

        // Construct result tree (root => FiberTree => childTree1 => childTree2 & childTree3)
        (mockChildTree.componentData as ComponentData).state = classState;
        mockChildTree.state = classState;
        const childTree1 = deepCopy(mockChildTree);
        childTree1.name = 'IncrementClass';
        (childTree1.componentData as ComponentData).index = 0;
        const childTree2 = deepCopy(mockChildTree);
        childTree2.name = 'IncrementClass1';
        (childTree2.componentData as ComponentData).index = 1;
        const childTree3 = deepCopy(mockChildTree);
        childTree3.name = 'IncrementClass2';
        (childTree3.componentData as ComponentData).index = 2;
        mockFiberTree.children[0].children = [childTree1];
        childTree1.children.push(childTree2, childTree3);

        // Compare the two trees:
        expect(tree).toEqual(mockFiberTree);
      });

      it('should display stateless if functional state empty', () => {
        // Construct Fiber Node (root => siblingNode)
        mockSiblingNode.memoizedState = null;
        const tree = createTree(mockSiblingNode);
        // Construct Result Tree (root => siblingTree)

        mockSiblingTree.state = 'stateless';
        (mockSiblingTree.componentData as ComponentData).hooksState = null;
        (mockSiblingTree.componentData as ComponentData).hooksIndex = null;
        treeRoot.children.push(mockSiblingTree);

        // Compare the two trees:
        expect(tree).toEqual(treeRoot);
      });

      it('should display functional state information', () => {
        // Construct Fiber Node (root => siblingNode)
        mockSiblingNode.memoizedState = memoizedState;
        const tree = createTree(mockSiblingNode);

        // Construct Result Tree (root => siblingTree)

        mockSiblingTree.state = functionalState;
        (mockSiblingTree.componentData as ComponentData).hooksState = functionalState;
        treeRoot.children.push(mockSiblingTree);

        // Compare the two trees:
        expect(tree).toEqual(treeRoot);
      });

      it('should keep track of functional state index', () => {
        // Construct Fiber Node (root => FiberNode => sibling1 => sibling 2 & 3)
        // sibling 3 will have 2 states
        mockSiblingNode.memoizedState = memoizedState;
        const sibling1 = deepCopy(mockSiblingNode);
        const sibling2 = deepCopy(mockSiblingNode);
        const sibling3 = deepCopy(mockSiblingNode);
        sibling3.memoizedState.next = memoizedState2;
        sibling3.elementType = IncrementFuncMultiStates;
        mockFiberNode.child = sibling1;
        sibling1.child = sibling2;
        sibling2.sibling = sibling3;
        const tree = createTree(mockFiberNode);

        // Construct result tree (root => FiberTree => siblingTree1 => siblingTree2 & siblingTree3)
        // sibling 3 will have 2 states
        mockSiblingTree.state = functionalState;
        (mockSiblingTree.componentData as ComponentData).hooksState = functionalState;
        const siblingTree1 = deepCopy(mockSiblingTree);
        siblingTree1.name = 'IncrementFunc';
        (siblingTree1.componentData as ComponentData).hooksIndex = [0];
        const siblingTree2 = deepCopy(mockSiblingTree);
        siblingTree2.name = 'IncrementFunc1';
        (siblingTree2.componentData as ComponentData).hooksIndex = [1];
        const siblingTree3 = deepCopy(mockSiblingTree);
        siblingTree3.name = 'IncrementFuncMultiStates';
        siblingTree3.state = { ...functionalState, ...functionalState2 };
        Object.assign((siblingTree3.componentData as ComponentData).hooksState!, functionalState2);
        (siblingTree3.componentData as ComponentData).hooksIndex = [2, 3];
        mockFiberTree.children[0].children = [siblingTree1];
        siblingTree1.children.push(siblingTree2, siblingTree3);

        // Compare the two trees:
        expect(tree).toEqual(mockFiberTree);
      });
    });

    describe('Replace fromLinkFiber class value', () => {
      xit('NEED UNDERSTANDING THE PURPOSE OF FROMLINKFIBER FOR FRONTEND, currently unable to replicate DOMTokenList instance', () => {});
    });
  });

  describe('Tree unit test', () => {
    describe('Serialize state unit test', () => {
      it('should create a deep copy of state', () => {
        const dummyState = {
          counter: 1,
          playerOne: 'X',
          board: [
            ['', 'O', 'X'],
            ['', 'O', 'X'],
            ['O', 'X', ''],
          ],
        };
        const serializedState = serializeState(dummyState);

        expect(dummyState).toEqual(serializedState);
        expect(dummyState).not.toBe(serializedState);
      });

      it('should detect circular state', () => {
        const circularState: { [key: string]: any } = {};
        circularState.circ = circularState;
        const serializedCircularState = serializeState(circularState);

        expect(serializedCircularState).toEqual('circularState');
      });
    });

    describe('Constructing a default tree', () => {
      const newTree: Tree = new Tree({});
      it('should be able to create a newTree', () => {
        expect(newTree).toBeInstanceOf(Tree);
        expect(newTree.state).toEqual({});
      });

      it('should have 6 properties', () => {
        expect(newTree).toHaveProperty('state');
        expect(newTree).toHaveProperty('name');
        expect(newTree).toHaveProperty('componentData');
        expect(newTree).toHaveProperty('children');
        expect(newTree).toHaveProperty('isExpanded');
        expect(newTree).toHaveProperty('rtid');
      });

      it('should have default name, componentData, isExpanded and rtid', () => {
        expect(newTree.name).toBe('nameless');
        expect(newTree.componentData).toEqual({});
        expect(newTree.isExpanded).toBe(true);
        expect(newTree.rtid).toBe(null);
      });

      it('should have no children', () => {
        expect(newTree.children).toHaveLength(0);
      });
    });

    describe('Constructing a tree root', () => {
      const root: Tree = new Tree('root', 'root');
      it("should have name as 'root' and state as 'root'", () => {
        expect(root).toBeInstanceOf(Tree);
        expect(root.state).toBe('root');
        expect(root.name).toBe('root');
        expect(root.componentData).toEqual({});
        expect(root.isExpanded).toBe(true);
        expect(root.rtid).toBe(null);
        expect(root.children).toHaveLength(0);
      });
    });

    describe('Adding children', () => {
      let newTree: Tree;
      let child: Tree;
      beforeEach(() => {
        newTree = new Tree('root', 'root');
        child = newTree.addChild('stateful', 'child', {}, null);
      });

      it('should return a new tree child', () => {
        expect(child).toBeInstanceOf(Tree);
        expect(child).toBeInstanceOf(Tree);
        expect(child.state).toBe('stateful');
        expect(child.name).toBe('child');
        expect(child.componentData).toEqual({});
        expect(child.isExpanded).toBe(true);
        expect(child.rtid).toBe(null);
        expect(child.children).toHaveLength(0);
      });

      it("should have the child be in the children's array property", () => {
        expect(newTree.children).toHaveLength(1);
        expect(newTree.children).toContain(child);
        expect(newTree.children[0]).toBe(child);
      });

      it('should have unique name', () => {
        const nextChild1: Tree = child.addChild('stateful', 'child', {}, null);
        const nextChild2: Tree = child.addChild('stateful', 'child', {}, null);
        expect(child.children).toHaveLength(2);
        expect(child.children[0]).toBe(nextChild1);
        expect(child.children[1]).toBe(nextChild2);
        expect(nextChild1.name).toBe('child1');
        expect(nextChild2.name).toBe('child2');
      });

      xit('should be able to add multiple children and sibilings', () => {});
    });
  });

  describe('createComponentActionsRecord unit test', () => {
    it('should save a new component action record if the Fiber node is a stateful class component', () => {
      mockFiberNode.tag = ClassComponent;
      mockFiberNode.stateNode = {
        state: { counter: 0 }, // a mock state object
        setState: jest.fn(), // a mock setState method
      };
      createComponentActionsRecord(mockFiberNode);
      expect(componentActionsRecord.getComponentByIndex(0)).toBe(mockFiberNode.stateNode);
    });

    it('should save a new component action record if the Fiber node is a stateful class component with props', () => {
      mockFiberNode.tag = ClassComponent;
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
      mockFiberNode.tag = FunctionComponent;
      mockFiberNode.memoizedState = {
        queue: [{}, { state: { value: 'test' } }], // a mock memoizedState object
      };
      createComponentActionsRecord(mockFiberNode);
      expect(componentActionsRecord.getComponentByIndex(0)).toBe(mockFiberNode.memoizedState.queue);
    });

    // WE DONT HAVE PROPS IN STATENODE AND WE DON"T STORE PROPS IN COMPONENT ACTIONS RECORD
    // it('should save multiple component action records when called multiple times with different Fiber nodes', () => {
    //   mockFiberNode.tag = 1; // ClassComponent
    //   mockFiberNode.stateNode = {
    //     state: { counter: 0 },
    //     props: { start: 0 }, // a mock state object
    //     setState: jest.fn(), // a mock setState method
    //   };
    //   createComponentActionsRecord(mockFiberNode);
    //   expect(componentActionsRecord.getComponentByIndex(0)).toMatchObject({
    //     state: mockFiberNode.stateNode.state,
    //     props: mockFiberNode.stateNode.props,
    //   });

    //   const mockFiberNode2: Fiber = { ...mockFiberNode };
    //   mockFiberNode2.stateNode.props = { start: 1 }; // a different mock memoizedProps object
    //   createComponentActionsRecord(mockFiberNode2);
    //   expect(componentActionsRecord.getComponentByIndex(1)).toMatchObject({
    //     state: mockFiberNode2.stateNode.state,
    //     props: mockFiberNode2.stateNode.props,
    //   });
    // });

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
