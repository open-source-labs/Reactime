<<<<<<< HEAD
=======
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
// import * as reactWorkTags from './reactWorkTags';

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
  constructor(state, name = 'nameless', componentData = {}) {
    this.state = state === 'root' ? 'root' : JSON.parse(JSON.stringify(state));
    this.name = name;
    this.componentData = JSON.parse(JSON.stringify(componentData));
    this.children = [];
  }

  addChild(state, name = this.name, componentData = this.componentData) {
    this.children.push(new Tree(state, name, componentData));
  }

  cleanTreeCopy() {
    const copy = new Tree(this.state, this.name, this.componentData);
    let newChild;
    copy.children = this.children.map(child => {
      newChild = new Tree(child.state, child.name, child.componentData);
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

  // This is a regular old tree version of the above, but above version
  // is better suited for D3 chart displays
// class Tree {
//   constructor(state, name = 'nameless', index) {
//     this.state = state === 'root' ? 'root' : JSON.parse(JSON.stringify(state));
//     this.name = name;
//     this.index = index;
//     this.child = null;
//     this.sibling = null;
//   }

//   setNode(state, name, index) {
//     this.state = { ...this.child.state, ...state };
//     this.name = name;
//     this.index = index;
//   }

//   appendToChild(state, name = this.name, index = this.index) {
//     if (this.child) {
//       this.child.state = { ...this.child.state, ...state };
//       this.child.name = name;
//       this.child.index = index;
//     } else {
//       this.child = new Tree(state, name, index);
//     }
//   }

//   appendToSibling(state, name = this.name, index = this.index) {
//     if (this.sibling) {
//       state = { ...this.sibling.state, ...state };
//       this.sibling.name = name;
//       this.sibling.index = index;
//     } else {
//       this.sibling = new Tree(state, name, index);
//     }
//   }

//   cleanTreeCopy() {
//     const copy = new Tree(this.state, this.name, this.index);
//     if (this.sibling) {
//       copy.sibling = new Tree(this.sibling.state, this.sibling.name, this.sibling.index);
//       copy.sibling = scrubUnserializableMembers(copy.sibling);
//       copy.sibling = this.sibling.sibling;
//       copy.sibling.cleanTreeCopy();
//     }

//     if (this.child) {
//       copy.child = new Tree(this.child.state, this.child.name, this.child.index);
//       copy.child = scrubUnserializableMembers(copy.child);
//       copy.child = this.child.child;
//       copy.child.cleanTreeCopy();
//     }
// 
//   // unfinished:
//   cleanD3Copy(children = []) {
//     copy = D3Tree(this.state, this.name, this.index, this.isStateless);
//     let nextSibling = this.sibling;
//     while(nextSibling = this.sibling) {
//     copy.cleanD3Copy(copy.)
//   }
  
}

//     return copy;
//   }

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

// class UnfilteredTreeNode extends Tree {
//   constructor(component, useStateInstead = false, name, unfilteredProps) {
//     super(component, useStateInstead, name);
//     // this.isStateful = unfilteredProps.isStateful;
//     // this.tagLabel = reactWorkTags[unfilteredProps.tag];
//     if(unfilteredProps) {
//       this.tag = unfilteredProps.tag;
//       this.actualDuration = unfilteredProps.actualDuration;
//       this.actualStartTime = unfilteredProps.actualStartTime;
//       this.selfBaseDuration = unfilteredProps.selfBaseDuration;
//       this.treeBaseDuration = unfilteredProps.treeBaseDuration;
//     }
//   }

//   appendChild(component) {
//     const newChild = new UnfilteredTreeNode(component);
//     this.children.push(newChild);
//     return newChild;
//   }
// }

module.exports = Tree
// module.exports = {
//   Tree,
  // UnfilteredTreeNode,
// };




  // // print out the tree structure in the console
  // // DEV: Process may be different for useState components
  // // BUG FIX: Don't print the Router as a component
  // // Change how the children are printed
  // print() {
  //   console.log("current tree structure for *this : ", this);
  //   const children = ['children: '];
  //   // DEV: What should we push instead for components using hooks (it wouldn't be state)
  //   this.children.forEach(child => { // if this.children is always initialized to empty array, when would there ever be anything to iterate through here?
  //     children.push(child.state || child.component.state);
  //   });
  //   if (this.name) console.log("this.name if exists: ", this.name);
  //   if (children.length === 1) {
  //     console.log(`children length 1. ${this.state ? `this.state: ` : `this.component.state: `}`, this.state || this.component.state);
  //   } else console.log(`children length !== 1. ${this.state ? `this.state: ` : `this.component.state, children: `}`, this.state || this.component.state, ...children);
  //   this.children.forEach(child => {
  //     child.print();
  //   });
  // }
>>>>>>> master
