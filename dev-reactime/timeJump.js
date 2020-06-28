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

const componentActionsRecord = require('./masterState');

// Carlos: origin is latest snapshot, linking to the fiber,
// so changes to origin change app
module.exports = (origin, mode) => {
  // Recursively change state of tree
  // Carlos: target is past state we are travelling to

  function jump(target, originNode = origin.tree) {
    console.log('origin (link to current app state) in jump():', origin);
    console.log('target state is: ', target);
    // Set the state of the origin tree if the component is stateful
    if (!target) return;
    const component = componentActionsRecord.getComponentByIndex(target.index);
    if (component) {
      console.log('time-travel component is true');
      if (component.setState) {
        console.log('time-travel component setState is true');
      }
    }

    if (component && component.setState) {
      console.log('time-travel calling setState', component);
      component.setState(prevState => {
        Object.keys(prevState).forEach(key => {
          if (target.state[key] === undefined) {
            target.state[key] = undefined;
          }
        });
        return target.state;
        // Iterate through new children after state has been set
      }, () => target.children.forEach(child => jump(child)));
    } else if (component && component.dispatch) {
      // ** not entering here
      console.log('time-travel calling dispatch', component);
      component.dispatch(target.state);
      target.children.forEach(child => jump(child));
    } else {
      console.log('time-travel did not call setState nor dispatch', component);
      target.children.forEach(child => jump(child));
    }

    /*
    if (originNode.component.setState) {
      console.log('stateful component jump, originNode: ', originNode.component);
      console.log('new target is:', target);
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
        // gabi :: Will the target and origin have the same amount of dependents?
        // carlos: i don't know wtf
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
        console.log('about to call hooks dispatch, target state is: ', target);
        //console.log('calling dispatch with arg:', target.state[hooks[index]]);
        current.queue.dispatch(target.state[hooks[index]]);
        // Reassign the current value
        current = current.next;
        index += 2;
      }
    }
    */
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
