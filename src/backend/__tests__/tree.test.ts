import Tree from '../tree';
import { networkInterfaces } from 'os';

describe('Tree unit test', () => {
  describe('Constructor', () => {
    const newTree = new Tree({});

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
   * the tree should have initial values of state, name, etc to be default as per newly created tree
   *
   */

  describe('Adding children', () => {
    let newTree = new Tree({});
    let returnChild = newTree.addChild('stateful', 'child', {}, null);
  
    it('should be able to add a child', () => {
      expect(typeof newTree.children).toEqual('object');
      expect(Array.isArray(newTree.children)).toBeTruthy;
    })

    it(`its parent should be newTree`, () => {
      expect(returnChild.parent).toEqual(newTree);
    })

    it('parent now contains an array of children and each children is a valid tree', () => {
      expect(newTree.children[0]).toHaveProperty('state');
      expect(newTree.children[0]).toHaveProperty('name');
      expect(newTree.children[0]).toHaveProperty('componentData');
    })
  })

  describe('Adding sibling', () => {
    let newTree = new Tree({});
    let returnChild = newTree.addChild('stateful', 'child', {}, null);
    let returnSibling = returnChild.addSibling('stateful', 'child', {}, null);

    it('the tree now has 2 children', () => {
      expect(newTree.children.length).toBe(2);
    })

    it('both of the children has the parent as this tree', () => {
      expect(newTree.children[0]).toEqual(returnChild);
      expect(newTree.children[1]).toEqual(returnSibling);
    })

    it('both of the children has the parent as this tree', () => {
      expect(returnChild.parent).toEqual(newTree);
      expect(returnSibling.parent).toEqual(newTree);
    })  
  })


  describe('Adding sibling', () => {
    let newTree = new Tree({});
    let returnChild = newTree.addChild('stateful', 'child', {}, null);
    let returnSibling = returnChild.addSibling('stateful', 'child', {}, null);
    it('the tree now has 2 children', () => {
      expect(newTree.children.length).toBe(2);
    })

    it('both of the children has the parent as this tree', () => {
      expect(newTree.children[0]).toEqual(returnChild);
      expect(newTree.children[1]).toEqual(returnSibling);
    })

    it('both of the children has the parent as this tree', () => {
      expect(returnChild.parent).toEqual(newTree);
      expect(returnSibling.parent).toEqual(newTree);
    })  
  })


  describe('Copy & clean tree', () => {
    let newTree = new Tree({});
    let returnChild = newTree.addChild('stateful', 'child', {}, null);
    let returnSibling = returnChild.addSibling('stateful', 'child', {}, null);
    let copy = newTree.cleanTreeCopy();
    it('its copy has 2 children', () => {
      expect(copy.children.length).toEqual(2);
    })
  })
})