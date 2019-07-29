class Tree {
  constructor(component, useStateInstead = false, name) {
    // special case when component is root
    // give it a special state = 'root'
    // a setState function that just calls the callback instantly
    if (!useStateInstead) {
      this.component = (component === 'root') ? { state: 'root', setState: (partial, callback) => callback() } : component;
    } else {
      this.state = component;
      this.name = name;
    }
    this.children = [];
  }

  appendChild(component) {
    const child = new Tree(component);
    this.children.push(child);
    return child;
  }

  // deep copies only the state of each component and creates a new tree
  getCopy(copy = new Tree('root', true, 'root')) {
    // copy state of children
    copy.children = this.children.map(child => new Tree(child.component.state, true, child.component.constructor.name));

    // copy children's children recursively
    this.children.forEach((child, i) => child.getCopy(copy.children[i]));
    return copy;
  }

  // print out the tree in the console
  print() {
    const children = ['children: '];
    this.children.forEach((child) => {
      children.push(child.state || child.component.state);
    });
    if (this.name) console.log(this.name);
    if (children.length === 1) {
      console.log(this.state || this.component.state);
    }
    else console.log(this.state || this.component.state, ...children);
    this.children.forEach((child) => {
      child.print();
    });
  }
}

module.exports = Tree;
