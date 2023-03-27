import createTree from '../controllers/createTree/createTree';
import componentActionsRecord from '../models/masterState';
import createComponentActionsRecord from '../controllers/createTree/createComponentActionsRecord';
import {
  Fiber,
  FunctionComponent,
  ClassComponent,
  IndeterminateComponent,
  ComponentData,
  WorkTag,
} from '../types/backendTypes';
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

describe('master tree tests', () => {
  let treeRoot: Tree;
  let mockFiberNode: Fiber;
  const mockComponentData: ComponentData = {
    actualDuration: 1,
    actualStartTime: 2,
    selfBaseDuration: 3,
    treeBaseDuration: 4,
    context: {},
    hooksIndex: null,
    hooksState: null,
    index: null,
    props: {},
    state: null,
  };
  let mockFiberTree: Tree;
  let mockChildNode: Fiber;
  let mockChildTree: Tree;
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
      const memoizedProps: {
        propVal: number;
        propFunc: Function;
        propObj: { [key: string]: any };
      } = {
        propVal: 0,
        propFunc: jest.fn,
        propObj: { dummy: 'dummy' },
      };
      const props: {
        propVal: number;
        propFunc: 'function';
        propObj: string;
      } = {
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

      xit('should display props information of multiple components', () => {
        // Trim the root to get position of mockFiber for append child and sibiling
        const mockFiberTreeTrimRoot = mockFiberTree.children[0];

        // Add child(class) component with props:
        mockChildNode.memoizedProps = { ...memoizedProps, name: 'child' };
        (mockChildTree.componentData as ComponentData).props = { ...props, name: 'child' };
        (mockChildTree.componentData as ComponentData).index = 0;
        mockFiberTreeTrimRoot.children.push(mockChildTree);

        // Add sibiling(functional) component with props:
        mockSiblingNode.memoizedProps = { ...memoizedProps, name: 'sibling' };
        (mockSiblingTree.componentData as ComponentData).props = { ...props, name: 'sibling' };
        (mockSiblingTree.componentData as ComponentData).hooksIndex = [1];
        mockFiberTreeTrimRoot.children.push(mockSiblingTree);

        // Modify mockFiberNode to have 2 children: mockChildNode & mockSibilngNode
        mockFiberNode.child = mockChildNode;
        mockFiberNode.child.sibling = mockSiblingNode;

        const tree = createTree(mockFiberNode);
        expect(tree).toEqual(mockFiberTree);
      });
    });
    describe('Display component states information', () => {
      it('should display functional state information', () => {
        mockChildNode.stateNode = {
          
        }
      });
      xit('should display class state information', () => {});
    });
    xdescribe('Replace fromLinkFiber class value', () => {
      it('NEED UNDERSTANDING OF WHY FROMLINKFIBER IS NEEDED TO MAKE TESTING', () => {});
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

  describe('createComponentActionsRecord', () => {
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
