/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

// this is the current snapshot that is being sent to the snapshots array.
class Tree {
  constructor(component, useStateInstead = false, name) {
    // special case when component is root
    // give it a special state = 'root'
    // a setState function that just calls the callback instantly
    if (!useStateInstead) {
      this.component = component === 'root'
        ? { state: 'root', setState: (partial, callback) => callback() }
        : component;
    } else {
      this.state = component;
      this.name = name;
    }
    this.children = [];
    // DEV: Added print() for debugging purposes

    // this.print(); // this call is not useful here. it would be useful in a function call where we've already added to this.children
  }

  appendChild(component) {
    const child = new Tree(component);
    this.children.push(child);
    return child;
  }

  // deep copies only the state of each component and creates a new tree
  getCopy(copy = new Tree('root', true)) {
    // copy state of children
    copy.children = this.children.map(
      child => new Tree(child.component.state
        || child.component.traversed, true, child.component.constructor.name),
    );

    // copy children's children recursively
    this.children.forEach((child, i) => child.getCopy(copy.children[i]));
    return copy;
  }

  // print out the tree structure in the console
  // DEV: Process may be different for useState components
  // BUG FIX: Don't print the Router as a component
  // Change how the children are printed
  print() {
    console.log("current tree structure for *this : ", this);
    const children = ['children: '];
    // DEV: What should we push instead for components using hooks (it wouldn't be state)
    this.children.forEach(child => { // if this.children is always initialized to empty array, when would there ever be anything to iterate through here?
      children.push(child.state || child.component.state);
    });
    if (this.name) console.log("this.name if exists: ", this.name);
    if (children.length === 1) {
      console.log(`children length 1. ${this.state ? `this.state: ` : `this.component.state: `}`, this.state || this.component.state);
    } else console.log(`children length !== 1. ${this.state ? `this.state: ` : `this.component.state, children: `}`, this.state || this.component.state, ...children);
    this.children.forEach(child => {
      child.print();
    });
  }
}

module.exports = Tree;
