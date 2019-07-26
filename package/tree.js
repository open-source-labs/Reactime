class Tree {
  constructor(component) {
    this.component = component;
    this.children = [];
  }

  appendChild(component) {
    const child = new Tree(component);
    this.children.push(child);
    return child;
  }

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

const tree = new Tree({ state: 1 });
tree.appendChild({ state: 2 });
const three = tree.appendChild({ state: 3 });
three.appendChild({ state: 4 });
three.appendChild({ state: 5 });
tree.print();

module.exports = Tree;
