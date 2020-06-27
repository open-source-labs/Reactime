/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

// removes unserializable state data such as functions
function scrubUnserializableMembers(tree) {
  Object.entries(tree.state).forEach(keyValuePair => {
    if (typeof keyValuePair[1] === 'function') tree.state[keyValuePair[0]] = 'function';
  });
  // console.log('PAYLOAD: unserializable returns:', tree);
  return tree;
}

// this is the current snapshot that is being sent to the snapshots array.
class Tree {
  constructor(state, name = 'nameless') {
    this.state = state === 'root' ? 'root' : JSON.parse(JSON.stringify(state));
    this.name = name;
    this.children = [];
  }

  appendChild(state, name) {
    const child = new Tree(state, name);
    this.children.push(child);
  }

  cleanTreeCopy() {
    const copy = new Tree(this.state, this.name);
    let newChild;
    copy.children = this.children.map(child => {
      newChild = new Tree(child.state, child.name);
      newChild.children = child.children;
      return scrubUnserializableMembers(newChild);
    });
    if (copy.children.length > 0) {
      copy.children.forEach(child => {
        if (child !== copy.children) {
          child = child.cleanTreeCopy();
        } else {
          child = null;
        }
      });
    }
    return copy;
  }

  // print out the tree structure in the console
  // DEV: Process may be different for useState components
  // BUG FIX: Don't print the Router as a component
  // Change how the children are printed
  print() {
    // console.log('current tree structure for *this : ', this);
    const children = ['children: '];
    // DEV: What should we push instead for components using hooks (it wouldn't be state)
    this.children.forEach(child => { // if this.children is always initialized to empty array, when would there ever be anything to iterate through here?
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

module.exports = Tree;
