import Tree from '../tree';

describe('Tree unit test', () => {
  const newTree = new Tree({});

  describe('Constructor', () => {
    it('should be able to create a newTree', () => {
      expect(newTree.state).toEqual({});
    });

    it('should have 8 properties', () => {
      expect(newTree).toHaveProperty('state');
      expect(newTree).toHaveProperty('name');
      expect(newTree).toHaveProperty('componentData');
      expect(newTree).toHaveProperty('children');
      expect(newTree).toHaveProperty('parent');
      expect(newTree).toHaveProperty('isExpanded');
      expect(newTree).toHaveProperty('rtid');
      expect(newTree).toHaveProperty('route');
    });

    it('has name default value as stateless', () => {
      expect(newTree.name).toBe('nameless');
    });

    it('has children as an empty array', () => {
      expect(newTree.children).toEqual([]);
    });
  });

  /**
   *
   * making sure to adhere to ts practices when goign through tests
   *
   * ^^
   * the tree should have initial values of state,
   * name, etc to be default as per newly created tree
   * update the add child and add sibling tests
   *
   * update the clean tree copy test to make it test for deep equaltiy? (note:
   * this test may always fail if we make it so because there is no way to have deep equalituy
   * with some shit that isn't allowed)
   */

  describe('Adding children', () => {
    const returnChild = newTree.addChild('stateful', 'child', {}, null);

    it('should have the child be in the children\'s array property', () => {
      // check if returnChild is in the children array property of tree that invoked addChild
      expect(newTree.children).toContain(returnChild);
    });

    it('should have the object that invoked it be it\'s parent', () => {
      // checking parent to be the tree that invoked addChild
      expect(returnChild.parent).toEqual(newTree);
    });

    it('parent now contains an array of children and each children is a valid tree', () => {
      expect(newTree.children[0]).toHaveProperty('state');
      expect(newTree.children[0]).toHaveProperty('name');
      expect(newTree.children[0]).toHaveProperty('componentData');
    });
  });

  describe('Adding sibling', () => {
    // const newTree = new Tree({});
    const returnChild = newTree.addChild('stateful', 'child', {}, null);
    const returnSibling = returnChild.addSibling('stateful', 'child', {}, null);

    it('the tree now has 2 children', () => {
      expect(newTree.children.length).toBe(2);
    });

    it('both of the children has the parent as this tree', () => {
      expect(newTree.children[0]).toEqual(returnChild);
      expect(newTree.children[1]).toEqual(returnSibling);
    });

    it('both of the children has the parent as this tree', () => {
      expect(returnChild.parent).toEqual(newTree);
      expect(returnSibling.parent).toEqual(newTree);
    });
  });

  // review this test
  // returnSibling not used?
  // Check Test

  describe('Copy & clean tree', () => {
    // const newTree = new Tree({});
    const returnChild = newTree.addChild('stateful', 'child', {}, null);
    returnChild.addSibling('stateful', 'child', {}, null);
    const copy = newTree.cleanTreeCopy();
    it('its copy has 2 children', () => {
      expect(copy.children.length).toEqual(2);
    });
  });
});
