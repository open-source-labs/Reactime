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

// Carlos: origin is latest snapshot, linking to the fiber,
// so changes to origin change app
module.exports = (origin, mode) => {
  // Recursively change state of tree
  // Carlos: target is past state we are travelling to

  function jump(target, originNode = origin.tree) {
    console.log('origin (link to current app state) in jump():', origin);
    // Set the state of the origin tree if the component is stateful
    if (!target) return;
    if (originNode.component.setState) {
      // console.log('stateful component jump, originNode: ', originNode.component);
      // console.log('new target is:', target);
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
        jump(target.children[0], originNode.children[0]);
      });
    } else {
      // If component uses hooks, traverse through the memoize tree
      let current = originNode.component;
      //console.log("changing state of hooks component:", current);
      //console.log("new state is:", target);
      let index = 0;
      const hooks = returnState();
      // While loop through the memoize tree
      console.log('hooks:', hooks);
      while (current && current.queue) { // allows time travel with useEffect
        //console.log('calling dispatch with arg:', target.state[hooks[index]]);
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
