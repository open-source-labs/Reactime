/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/ban-types */
// import 'core-js';
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import { createGenerateClassName } from '@material-ui/styles';

let copyInstances = 0;
const circularComponentTable = new Set<Tree>();
let componentNames = {};

// Removes unserializable state data such as functions
function scrubUnserializableMembers(tree: Tree): Tree {
  Object.entries(tree.state).forEach(keyValuePair => {
    if (typeof keyValuePair[1] === 'function') tree.state[keyValuePair[0]] = 'function';
  });
  return tree;
}

function serializeState(state) {
  try {
    return JSON.parse(JSON.stringify(state));
  } catch (e) {
    return 'circularState';
  }
}


/**
 * This is the current snapshot that is being sent to the snapshots array.
 * Creates a Tree
 * @param state : the tree's current state
 * @param name : the tree's name
 * @param componentData : Data in the component tree
 * @parent generates a new tree (recursive call)
 */
class Tree {
  state: string | {};

  name: string;

  componentData: {
    props:{}
  };

  children: (Tree | string)[];

  parent: Tree

  atomsComponents: any;

  atomSelectors: any;

  rtid: any;

  recoilDomNode: any;

  // Duplicate names: add a unique number ID
  // Create an object 'componentNames' to store each component name as a key and it's frequency of use as its value
  // When a new component is made on the tree, check if the new component's name already exists in 'componentNames' (possibly with the .hasOwnProperty method)
  // If the name already exists, add its value (an integer) to the name
  // Also, increment the value after
  // If not, create the new component and also a new key: value pair in 'componentNames' with the component's name as the key and 0 as its value
  // EXAMPLE OF COMPONENTNAMES OBJECT: {editableInput: 1, Provider: 0, etc}

  // Empty names:
  // If string, rtid without 'fromLinkFiber"
  // If object
  // If null

  constructor(state: string | {}, name = 'nameless', componentData: {} = {}, rtid: any = null, recoilDomNode: any = null, string: any = null) {
    this.state = state === 'root' ? 'root' : serializeState(state);
    this.name = name;
    this.componentData = componentData ? JSON.parse(JSON.stringify(componentData)) : {};
    this.children = [];
    this.parent = null; // ref to parent so we can add siblings
    this.rtid = rtid;
    this.recoilDomNode = recoilDomNode;
  }

  // Returns a unique name ready to be used
  checkForDuplicates(name: string) {
    // check for empty name
    if (name === '' && typeof this.rtid === 'string') {
      name = this.rtid.replace('fromLinkFiber', '');
    }
    if (this.state === 'root') {
      componentNames = {};
    }
    // check for duplicate
    else if (componentNames[name] !== undefined) {
      const count = componentNames[name] + 1;
      const newName = name + count;
      componentNames[name] = count;
      return newName;
    }
    componentNames[name] = 0;
    return name;
  }

  addChild(state: string | {}, name: string, componentData: {}, rtid: any, recoilDomNode: any): Tree {
    const uniqueName = this.checkForDuplicates(name);
    const newChild: Tree = new Tree(state, uniqueName, componentData, rtid, recoilDomNode);
    newChild.parent = this;
    this.children.push(newChild);
    // console.log('this is the name and rtid', uniqueName, rtid);
    return newChild;
  }

  addSibling(state: string | {}, name: string, componentData: {}, rtid: any, recoilDomNode: any): Tree {
    const uniqueName = this.checkForDuplicates(name);
    const newSibling: Tree = new Tree(state, uniqueName, componentData, rtid, recoilDomNode);
    newSibling.parent = this.parent;
    this.parent.children.push(newSibling);
    // console.log('this is the name and rtid', uniqueName, rtid);
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
    if (copyInstances === 0) {
      copyInstances++;
      circularComponentTable.clear();
    }
    // creates copy of present node
    let copy: Tree = new Tree(this.state, this.name, this.componentData, this.rtid, this.recoilDomNode);
    // console.log('CLEANTREECOPY TEST', copy);
    delete copy.parent;
    circularComponentTable.add(this);
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
