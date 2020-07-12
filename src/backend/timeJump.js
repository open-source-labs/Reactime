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
    
    if (target.state.hooksState) {
      target.state.hooksState.forEach(hooksState => {
        if (component && component.dispatch) {
          const hooksComponent = componentActionsRecord.getComponentByIndex(hooksState[1]);
          hooksComponent.dispatch(target.state.hooksState[0]);
        }
      });
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
