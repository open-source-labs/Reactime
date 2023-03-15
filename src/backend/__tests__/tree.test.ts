import Tree from '../models/tree';
import { serializeState, scrubUnserializableMembers } from '../models/tree';

xdescribe('Serialize state unit test', () => {
  const dummyState = {
    counter: 1,
    playerOne: 'X',
    board: [
      ['', 'O', 'X'],
      ['', 'O', 'X'],
      ['O', 'X', ''],
    ],
  };

  const circularState: { [key: string]: any } = {};
  circularState.circ = circularState;

  const serializedState = serializeState(dummyState);
  const serializedCircularState = serializeState(circularState);

  it('should create a deep copy of state', () => {
    expect(dummyState).toEqual(serializedState);
    expect(dummyState).not.toBe(serializedState);
  });

  it('should detect circular state', () => {
    expect(serializedCircularState).toEqual('circularState');
  });
});

xdescribe('Scrub unserialized members unit test', () => {
  const dummyState = {
    counter: 1,
    playerOne: 'X',
    board: [
      ['', 'O', 'X'],
      ['', 'O', 'X'],
      ['O', 'X', ''],
    ],
    increment: function () {
      this.counter++;
    },
  };
  const newTree = new Tree(dummyState);
  const scrubbedTree = scrubUnserializableMembers(newTree);
  // make sure return type is tree
  it('should be instance of tree', () => {
    expect(newTree).toBeInstanceOf(Tree);
  });
  // make sure function is scrubbed
});

xdescribe('Tree unit test', () => {
  const newTree = new Tree({});
  describe('Constructor', () => {
    it('should be able to create a newTree', () => {
      expect(newTree.state).toEqual({});
    });

    it('should have 7 properties', () => {
      expect(newTree).toHaveProperty('state');
      expect(newTree).toHaveProperty('name');
      expect(newTree).toHaveProperty('componentData');
      expect(newTree).toHaveProperty('children');
      expect(newTree).toHaveProperty('parent');
      expect(newTree).toHaveProperty('isExpanded');
      expect(newTree).toHaveProperty('rtid');
    });

    it('has name default value as stateless', () => {
      expect(newTree.name).toBe('nameless');
    });
  });

  xdescribe('Adding children', () => {
    const returnChild = newTree.addChild('stateful', 'child', {}, null);

    it("should have the child be in the children's array property", () => {
      // check if returnChild is in the children array property of tree that invoked addChild
      expect(newTree.children).toContain(returnChild);
    });

    it("should have the object that invoked it be it's parent", () => {
      // checking parent to be the tree that invoked addChild
      expect(returnChild.parent).toEqual(newTree);
    });

    it('parent now contains an array of children and each children is a valid tree', () => {
      expect(newTree.children[0]).toHaveProperty('state');
      expect(newTree.children[0]).toHaveProperty('name');
      expect(newTree.children[0]).toHaveProperty('componentData');
    });
  });

  xdescribe('Adding sibling', () => {
    const newTreeCopy = new Tree({});
    const returnChild = newTreeCopy.addChild('stateful', 'child', {}, null);
    const returnSibling = returnChild.addSibling('stateful', 'child', {}, null);

    it('the tree now has 2 children', () => {
      expect(newTreeCopy.children.length).toBe(2);
    });

    it('both of the children has the parent as this tree', () => {
      expect(returnChild.parent).toEqual(newTreeCopy);
      expect(returnSibling.parent).toEqual(newTreeCopy);
    });
  });

  // TO DO- add serializing state tests
  xdescribe('Serializing state unit test', () => {});
  // review this test
  // returnSibling not used?
  // Check Test

  xdescribe('Copy & clean tree', () => {
    const newTreeLastCopy = new Tree({});
    const returnChild = newTreeLastCopy.addChild('stateful', 'child', {}, null);
    returnChild.addSibling('stateful', 'child', {}, null);
    const copy = newTreeLastCopy.cleanTreeCopy();
    it('its copy has 2 children', () => {
      expect(copy.children.length).toEqual(2);
    });
  });
});
