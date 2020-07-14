import 'core-js';
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

// const componentActionsRecord = require('./masterState');
import componentActionsRecord from './masterState';

// Carlos: origin is latest snapshot, linking to the fiber,
// so changes to origin change app
// module.exports = (origin, mode) => {
export default (origin, mode) => {
  // Recursively change state of tree
  // Carlos: target is past state we are travelling to

  function jump(target) {
    // Set the state of the origin tree if the component is stateful
    if (!target) return;
    if (target.state === 'stateless') target.children.forEach(child => jump(child));
    const component = componentActionsRecord.getComponentByIndex(target.componentData.index);
    if (component && component.setState) {
      component.setState(prevState => {
        Object.keys(prevState).forEach(key => {
          if (target.state[key] === undefined) {
            target.state[key] = undefined;
          }
        });
        return target.state;
        // Iterate through new children after state has been set
      }, () => target.children.forEach(child => jump(child)));
    }

    // Check for hooks state and set it with dispatch()
    if (target.state.hooksState) {
      const hooksComponent = componentActionsRecord.getComponentByIndex(target.state.hooksState[1]);
      // const [hooksState] = [target.state.hooksState];
      const hooksState = Object.values(target.state.hooksState[0])[0];
      if (hooksComponent && hooksComponent.dispatch) {
        //hooksComponent.dispatch(Object.values(target.state.hooksState[0])[0]);
        console.log('setting hooksState of component id:', target.state.hooksState[1], 'to:', hooksState)
        hooksComponent.dispatch(hooksState);
      }
      target.children.forEach(child => jump(child));
    }

    if ((!component || !component.state) && !target.state.hooksState) {
      target.children.forEach(child => jump(child));
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
