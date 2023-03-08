/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

// ~~ I dont like the fact that these are global variables ~~ - Zack
let copyInstances = 0; // Tells you if we have already made a copy of current tree??
const circularComponentTable = new Set<Tree>(); // Keeps track of the nodes added to the tree
let componentNames = {}; // {componentName: frequency of use} => component name as a key and it's frequency of use as its value

// Functions dont serialize properly so we need to scrub for that
function scrubUnserializableMembers(tree: Tree): Tree {
  Object.entries(tree.state).forEach((keyValuePair) => {
    if (typeof keyValuePair[1] === 'function') tree.state[keyValuePair[0]] = 'function';
  });
  return tree;
}

// Making a deep clone of an object
function serializeState(state) {
  try {
    // makes a deep clone, but this way can be very slow
    return JSON.parse(JSON.stringify(state));
  } catch (e) {
    return 'circularState';
  }
}

/**
 * This is the current snapshot that is being sent to the snapshots array.
 * Creates a Tree
 * @param state - {string| {}} - the tree's current state
 * @param name - {string} - the tree's name
 * @param componentData - {props: {}} - Data in the component tree
 * @param chilren - {(Tree | string)[]} - An array of children nodes
 * @param parent - {Tree} - the parent node
 * @parent generates a new tree (recursive call)
 */
class Tree {
  state: string | {};

  name: string;

  componentData: {
    props: {};
  };

  children: (Tree | string)[];

  parent: Tree;

  isExpanded: boolean;

  rtid: any;

  route: {};

  // Duplicate names: add a unique number ID
  // Create an object 'componentNames' to store each component name as a key and it's frequency of use as its value
  // When a new component is made on the tree, check if the new component's name already exists in 'componentNames' (possibly with the .hasOwnProperty method)
  // If the name already exists, add its value (an integer) to the name
  // Also, increment the value after
  // If not, create the new component and also a new key: value pair in 'componentNames' with the component's name as the key and 0 as its value
  // EXAMPLE OF COMPONENTNAMES OBJECT: {editableInput: 1, Provider: 0, etc}

  constructor(
    state: string | {},
    name = 'nameless',
    componentData: {} = {},
    rtid: any = null,
    string: any = null,
  ) {
    this.state = state === 'root' ? 'root' : serializeState(state);
    this.name = name;
    this.componentData = componentData ? { ...JSON.parse(JSON.stringify(componentData)) } : {};
    this.children = [];
    this.parent = null; // ref to parent so we can add siblings
    this.isExpanded = true;
    this.rtid = rtid;
  }

  // Returns a unique name ready to be used for when new components gets added to the tree
  checkForDuplicates(name: string): string {
    // check for empty name
    if (name === '' && typeof this.rtid === 'string') {
      name = this.rtid.replace('fromLinkFiber', '');
    }
    // if we are at root, then make sure componentNames is an empty object
    if (this.state === 'root') componentNames = {};
    // check for duplicate
    else if (componentNames[name] !== undefined) {
      // if name exists in componentNames object, grab count and add 1
      const count: number = componentNames[name] + 1;
      // declare a new name variable
      const newName: string = name + count;
      // update name count in object
      componentNames[name] = count;
      // return newName
      return newName;
    }
    // add name in componentsName with value of 0
    componentNames[name] = 0;
    // return name
    return name;
  }

  addChild(state: string | {}, name: string, componentData: {}, rtid: any): Tree {
    // gets unique name by calling checkForDuplicates method
    const uniqueName = this.checkForDuplicates(name);
    // instantiates new child Tree with state, uniqueName, componentData and rtid
    const newChild: Tree = new Tree(state, uniqueName, componentData, rtid);
    // updating newChild parent to "this"
    newChild.parent = this;
    // adds newChild to children array
    this.children.push(newChild);
    // return newChild
    return newChild;
  }

  addSibling(state: string | {}, name: string, componentData: {}, rtid: any): Tree {
    // gets unique name by calling checkForDuplicates method
    const uniqueName = this.checkForDuplicates(name);
    // instantiate new sibilng tree with state, uniqueName, componentName and rtid
    const newSibling: Tree = new Tree(state, uniqueName, componentData, rtid);
    // updating newSibling parent to be the parent of "this" which refers to sibling node
    newSibling.parent = this.parent;
    // adds newSibling to children array
    this.parent.children.push(newSibling);
    // return newSibling
    return newSibling;
  }

  /**
   * @function cleanTreeCopy : Adds a sibling to the current tree
   */
  cleanTreeCopy(): Tree {
    /**
     * @object circularComponentTable : Clears circular component table only on first call, not recursive ones
     *
     */
    // if we havent made a copy of the tree, increment copyInstances and clear cicularComponentTable set
    if (copyInstances === 0) {
      copyInstances++;
      circularComponentTable.clear();
    }
    // creates copy of present node
    let copy: Tree = new Tree(this.state, this.name, this.componentData, this.rtid);
    // you want to get rid of the parentNode?? not sure why
    delete copy.parent;
    // add to circularComponentTable
    circularComponentTable.add(this);
    // 
    copy = scrubUnserializableMembers(copy);

    // creates copy of each child of the present node
    copy.children = this.children.map((child: Tree): Tree | string => {
      if (!circularComponentTable.has(child)) {
        return child.cleanTreeCopy();
      }
      return 'circular';
    });

    copyInstances--;
    return copy;
  }
}

export default Tree;
