/**
 * This file contains necessary functionality for time-travel feature
 *
 * It exports an anonymous
 * @function
 * that is invoked on
 * @param target --> a target snapshot portraying some past state
 * and recursively sets state for any stateful components.
 *
 */

/* eslint-disable no-param-reassign */

const { returnState } = require('./masterState');

// Traverses given tree by accessing children through coords array
function traverseTree(tree, coords) {
  let curr = tree;
  coords.forEach(coord => {
    curr = curr.children[coord];
  });
  return curr;
}

module.exports = (origin, mode) => {
  // Recursively change state of tree
  function jump(target, coords = []) {
    const originNode = traverseTree(origin.tree, coords);

    // Set the state of the origin tree if the component is stateful
    if (originNode.component.setState) {
      // * Use the function argument when setting state to account for any state properties
      // * that may not have existed in the past
      originNode.component.setState(prevState => {
        Object.keys(prevState).forEach(key => {
          if (target.state[key] === undefined) {
            target.state[key] = undefined;
          }
        });
        return target.state;
      }, () => {
        // Iterate through new children once state has been set
        target.children.forEach((child, i) => {
          jump(child, coords.concat(i));
        });
      });
    } else {
      // If component uses hooks, traverse through the memoize tree
      let current = originNode.component;
      let index = 0;
      const hooks = returnState();
      // While loop through the memoize tree
      while (current && current.queue) { // allows time travel with useEffect
        current.queue.dispatch(target.state[hooks[index]]);
        // Reassign the current value
        current = current.next;
        index += 2;
      }
    }
  }

  return target => {
    // * Setting mode disables setState from posting messages to window
    mode.jumping = true;
    jump(target);
    setTimeout(() => {
      mode.jumping = false;
    }, 100);
  };
};
