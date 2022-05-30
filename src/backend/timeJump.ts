import { Console } from 'console';
import routes from './routes';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/**
 * This file contains necessary functionality for time-travel feature
 *
 * It exports an anonymous
 * @function timeJump
 * @param origin The latest snapshot, linked to the fiber (changes to origin will change app)
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
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
    // for stateful class components
    const component = componentActionsRecord.getComponentByIndex(
      target.componentData.index,
    );

    // check if it is a stateful class component
    // if yes, find the component by its index and assign it to a variable
    // call that components setState method to reset state to the state at the time of the jump snapshot
    if (component && component.setState) {
      component.setState(
        // prevState contains the states of the snapshots we are jumping FROM, not jumping TO
        prevState => {
          Object.keys(prevState).forEach(key => {
            // if conditional below does not appear to ever be reached if all states are defined - leaving code in just in case codebases do have undefined states
            if (!target.state[key] === undefined) {
              target.state[key] = undefined;
            }
          });
          return target.state;
        },
        // Iterate through new children after state has been set
        () => target.children.forEach(child => jump(child)),
      );
    }

    target.children.forEach(child => {
      if (!circularComponentTable.has(child)) {
        circularComponentTable.add(child);
        jump(child);
      }
    });

    //REACT HOOKS
    // check if component states are set with hooks
      // if yes, grab all relevant components for this snapshot in numArr
      // call dispatch on each component passing in the corresponding currState value
    if (target.state && target.state.hooksState) {
      const currState = target.state.hooksState;
      const numArr: Array<number> = [];
      let counter = 1;
      while (counter < currState.length + 1) {
        numArr.push(target.componentData.hooksIndex - currState.length + counter);
        counter += 1;
      }
      const hooksComponent = componentActionsRecord.getComponentByIndexHooks(numArr);
      for (let i = 0; i < currState.length; i += 1) {
        hooksComponent[i].dispatch(Object.values(currState[i])[0]);
      }
    }
  }

  return (target, firstCall = false) => {
    // * Setting mode disables setState from posting messages to window
    mode.jumping = true;
    if (firstCall) circularComponentTable.clear();
    const navigating: boolean = routes.navigate(target.route);
    if (navigating) {
      addEventListener('popstate', event => {
        jump(target);
        document.body.onmouseover = () => {
          mode.jumping = false;
        };
      });
    } else {
      jump(target);
      document.body.onmouseover = () => {
        mode.jumping = false;
      };
    }
  };
};
