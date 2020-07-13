/* eslint-disable no-param-reassign */
// traverses given tree by accessing children through coords array
const { returnState } = require('./masterState');

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
      // if component uses hooks, traverse through the memoize tree
      let current = originNode.component;
      let index = 0;
      const hooks = returnState();
      // while loop through the memoize tree
      while (current && current.queue) { // allows time travel with useEffect
        current.queue.dispatch(target.state[hooks[index]]);
        // Reassign the current value
        current = current.next;
        index += 2;
      }
    }
  }

  return target => {
    // setting mode disables setState from posting messages to window
    mode.jumping = true;
    jump(target);
    setTimeout(() => {
      mode.jumping = false;
    }, 100);
  };
};
