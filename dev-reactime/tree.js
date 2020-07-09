/* eslint-disable no-multiple-empty-lines */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
// import * as reactWorkTags from './reactWorkTags';

const Flatted = require('flatted');

let copyInstances = 0;
const circularComponentTable = new Set();


// removes unserializable state data such as functions
function scrubUnserializableMembers(tree) {
  Object.entries(tree.state).forEach(keyValuePair => {
    if (typeof keyValuePair[1] === 'function') tree.state[keyValuePair[0]] = 'function';
  });
  return tree;
}

// this is the current snapshot that is being sent to the snapshots array.
class Tree {
  constructor(state, name = 'nameless', componentData = {}) {
    this.state = state === 'root' ? 'root' : JSON.parse(JSON.stringify(state));
    this.name = name;
    this.componentData = componentData ? JSON.parse(JSON.stringify(componentData)) : {};
    this.children = [];
    this.parent = null; // ref to parent so we can add siblings
  }

  addChild(state, name, componentData) {
    const newChild = new Tree(state, name, componentData);
    newChild.parent = this;
    this.children.push(newChild);
    return newChild;
  }

  addSibling(state, name, componentData) {
    const newSibling = new Tree(state, name, componentData);
    newSibling.parent = this.parent;
    this.parent.children.push(newSibling);
    return newSibling;
  }

  cleanTreeCopy() {
    // Clear circular component table only on first call, not recursive ones
    if (copyInstances === 0) {
      copyInstances++;
      circularComponentTable.clear();
    }
    // creates copy of present node
    let copy = new Tree(this.state, this.name, this.componentData);
    delete copy.parent;
    circularComponentTable.add(this);
    copy = scrubUnserializableMembers(copy);

    // copy.children = this.children;

    // creates copy of each child of the present node
    copy.children = this.children.map(child => {
      if (!circularComponentTable.has(child)) {
        return child.cleanTreeCopy();
      }
      return 'circular';
    });

    // returns copy
    copyInstances--;
    return copy;
  }

  // print out the tree structure in the console
  // DEV: Process may be different for useState components
  // BUG FIX: Don't print the Router as a component
  // Change how the children are printed
  print() {
    const children = ['children: '];
    // DEV: What should we push instead for components using hooks (it wouldn't be state)
    // if this.children is always initialized to empty array, when would there ever be anything to iterate through here?
    this.children.forEach(child => {
      children.push(child.state || child.component.state);
    });
    if (this.name) console.log('this.name if exists: ', this.name);
    if (children.length === 1) {
      console.log(`children length 1. ${this.state ? 'this.state: ' : 'this.component.state: '}`, this.state || this.component.state);
    } else console.log(`children length !== 1. ${this.state ? 'this.state: ' : 'this.component.state, children: '}`, this.state || this.component.state, ...children);
    this.children.forEach(child => {
      child.print();
    });
  }
}

export default Tree;
