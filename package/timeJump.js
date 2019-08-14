/* eslint-disable no-param-reassign */
// traverses given tree by accessing children through coords array
function traverseTree(tree, coords) {
  let curr = tree;
  coords.forEach(coord => {
    curr = curr.children[coord];
  });
  return curr;
}

module.exports = (origin, mode) => {
  // recursively change state of tree
  function jump(target, coords = []) {
    const originNode = traverseTree(origin.tree, coords);

    // set the state of the origin tree
    originNode.component.setState(target.state, () => {
      // iterate through new children once state has been set
      target.children.forEach((child, i) => {
        jump(child, coords.concat(i));
      });
    });
  }

  return target => {
    // setting mode disables setState from posting messages to window
    mode.jumping = true;
    jump(target);
    mode.jumping = false;
  };
};
