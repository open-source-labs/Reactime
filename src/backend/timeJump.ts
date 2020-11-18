import { Console } from 'console';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/**
 * This file contains necessary functionality for time-travel feature
 *
 * It exports an anonymous
 * @function timeJump
 * @param origin The latest snapshot, linked to the fiber (changes to origin will change app)
 * @param mode The current mode (i.e. jumping, time-traveling, locked, or paused)
 * @returns A function that takes a target snapshot and a boolean flag checking for firstCall, then invokes `jump` on that target snapshot
 *
 * The target snapshot portrays some past state we want to travel to.
 * `jump` recursively sets state for any stateful components.
 */

/* eslint-disable no-param-reassign */

import componentActionsRecord from './masterState';

const circularComponentTable = new Set();

export default (origin, mode) => {
  // Recursively change state of tree
  // Set the state of the origin tree if the component is stateful
  function jump(target, firstCall = false) {
    if (!target) return;

    if (target.state === 'stateless') {
      target.children.forEach(child => jump(child));
      return;
    }
    const component = componentActionsRecord.getComponentByIndex(
      target.componentData.index,
    );
    if (component && component.setState) {
      component.setState(
        prevState => {
          Object.keys(prevState).forEach(key => {
            if (target.state[key] === undefined) {
              target.state[key] = undefined;
            }
          });
          return target.state;
        },
        // Iterate through new children after state has been set
        () => target.children.forEach(child => jump(child))
      );
    }

    // Check for hooks state and set it with dispatch()
    if (target.state && target.state.hooksState) {
      target.state.hooksState.forEach(hook => {
        const hooksComponent = componentActionsRecord.getComponentByIndex(
          target.componentData.hooksIndex,
        );
        const hookState = Object.values(hook);
        if (hooksComponent && hooksComponent.dispatch) {
          hooksComponent.dispatch(hookState[0]);
        }
      });
    }

    target.children.forEach(child => {
      if (!circularComponentTable.has(child)) {
        circularComponentTable.add(child);
        jump(child);
      }
    });
  }

  return (target, firstCall = false) => {
    // * Setting mode disables setState from posting messages to window
    mode.jumping = true;
    if (firstCall) circularComponentTable.clear();
    jump(target);
    setTimeout(() => {
      mode.jumping = false;
    }, 100);
  };
};
