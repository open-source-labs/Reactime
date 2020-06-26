/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

// this is the current snapshot that is being sent to the snapshots array.
class Tree {
  /*
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
  } */
  constructor(component) {
    this.state = component === 'root' ? 'root' : component.state;
    this.name = component.name;
    this.children = []; // [sib1, sib2, sib3] -> sib3.children[nextsib1, nextsib1]
  }

  appendChild(component, name) {
    const child = new Tree(component);
    child.name = name;
    this.children.push(child);
    return child;
  }

  appendSibling(component, name) {
    const sibling = new Tree(component);
    sibling.name = name;
    this.children.push(sibling);
  }

  cleanTree() {
    if (this.children && this.children.length > 0) {
      this.children.forEach((child, i) => {
        if (child.state === {}) {
          this.children.splice(i, 1);
        }
        console.log("CLEAN, children:", this.children);
        if (child && child.state && child.state !== {}) {
          if ((typeof child.state === 'object') && child.state !== null) {
            const states = Object.entries(child.state);
            if (states && states.length > 0) {
              console.log('CLEAN STATES IS: ', states);
              states.forEach(e => {
                if (typeof e[1] === 'function') {
                  console.log('message will contain function, may fail');
                  child.state[e[0]] = 'function';
                }
                /* if (e[0] === 'children') {
                  delete child.state[e[0]];
                } */
              });
            }
          }
        }
      });
    }

    if (this.children && this.children.length > 0) {
      this.children.forEach((child, i) => {
        //if (child && child !== this.children) child.cleanTree(this.children[i]);
        if (child && child !== this.children) child.cleanTree(this.children[i]);
      });
    }
  }

  // deep copies only the state of each component and creates a new tree
  getCopy(copy = new Tree('root', true)) {
    // copy state of children
    if (copy.children) {
      copy.children = this.children.map(
        child => {
          // console.log('tree.js child:', child);
          if (child.component && child.component.state) {
          // return new Tree(child.component.state, true, child.component.constructor.name);
            return new Tree(child.component.state, true, child.component.name);
          }

          if (child.component && child.component.hooksDispatch) {
            return new Tree(child.component.hooksDispatch, true, child.component.hooksDispatch.name);
          }
        },
      );
    }

    // Carlos : remove functions from state, to avoid failure in postMessage
    if (copy.children) {
      copy.children.forEach(child => {
        if (child && child.state) {
          Object.entries(child.state).forEach(e => {
            if (typeof e[1] === 'function') {
              console.log('message will contain function, may fail');
              child.state[e[0]] = child.state[e[0]].toString();
            }
            if (e[0] === 'children') {
              delete child.state[e[0]];
            }
          });
        }
      });
    }

    // copy children's children recursively
    if (this.children && this.children.length > 0) {
      this.children.forEach((child, i) => {
        if (child && child !== this.children) child.getCopy(this.children[i]);
      });
    }
    return copy;
  }

  // print out the tree structure in the console
  // DEV: Process may be different for useState components
  // BUG FIX: Don't print the Router as a component
  // Change how the children are printed
  print() {
    console.log('current tree structure for *this : ', this);
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
