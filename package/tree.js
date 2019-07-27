class Tree {
  constructor(component) {
    // special case when component is root
    // give it a special state = 'root'
    // a setState function that just calls the callback instantly
    this.component = (component === 'root') ? { state: 'root', setState: (partial, callback) => callback() } : component;
    this.children = [];
  }

  appendChild(component) {
    const child = new Tree(component);
    this.children.push(child);
    return child;
  }

  // deep copies only the state of each component and creates a new tree
  getCopy(copy = new Tree(null)) {
    const { state } = this.component;
    if (!copy.component) copy.component = { state };

    // copy state of children
    copy.children = this.children.map(child => new Tree({ state: child.component.state }));

    // copy children's children recursively
    this.children.forEach((child, i) => child.getCopy(copy.children[i]));
    return copy;
  }

  // print out the tree in the console
  print() {
    const children = ['children: '];
    this.children.forEach((child) => {
      children.push(child.component.state);
    });
    if (children.length === 1) console.log(this.component.state);
    else console.log(this.component.state, ...children);
    this.children.forEach((child) => {
      child.print();
    });
  }
}

module.exports = Tree;
