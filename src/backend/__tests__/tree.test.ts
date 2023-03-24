import Tree from '../models/tree';
import { serializeState } from '../models/tree';

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

describe('Tree unit test', () => {
  
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
    const newTree: Tree = new Tree('root', 'root');
    const child: Tree = newTree.addChild('stateful', 'child', {}, null);

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
  });
});
