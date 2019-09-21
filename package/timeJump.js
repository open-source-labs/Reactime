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
    // set the state of the origin tree if the component is stateful
    if (originNode.component.setState) {
      originNode.component.setState(target.state, () => {
        // iterate through new children once state has been set
        target.children.forEach((child, i) => {
          jump(child, coords.concat(i));
        });
      });
    } else {
      // if component uses hooks
      // variable for current location
      let currLocation = originNode.component;
      // state no
      let stateNum = 1;
      console.log('component', originNode.component);
      // while loop through the memoize tree
      while (currLocation) {
        currLocation.queue.dispatch(target.state[`state${stateNum}`]);
        currLocation = currLocation.next;
        stateNum += 1;
      }
    }
  }

  return target => {
    console.log('im a target', target);
    // setting mode disables setState from posting messages to window
    mode.jumping = true;
    jump(target);
    setTimeout(() => {
      mode.jumping = false;
    }, 100);
  };
};
