import Tree from '../tree';

/**
 * Created new tree under sibling and copy and clean tree describe block --
 * Reason is because other tests are adding properties to tree and affecting the child block, 
 * so this was a quick way to test the trees getting reset to initial state
 * 
 * Possible fix if more time allowed: Making use of beforeEach or afterEach --
 */

describe('Tree unit test', () => {
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

  // review this test
  // returnSibling not used?
  // Check Test

  describe('Copy & clean tree', () => {
    const newTreeLastCopy = new Tree({});
    const returnChild = newTreeLastCopy.addChild('stateful', 'child', {}, null);
    returnChild.addSibling('stateful', 'child', {}, null);
    const copy = newTreeLastCopy.cleanTreeCopy();
    it('its copy has 2 children', () => {
      expect(copy.children.length).toEqual(2);
    });
  });
});
