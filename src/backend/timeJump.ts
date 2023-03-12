import routes from './routes';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import componentActionsRecord from './masterState';
const circularComponentTable = new Set();

/**
 * This file contains necessary functionality for time-travel feature
 *
 * Default Export:
 * @function timeJump
 * @param origin The latest snapshot, linked to the fiber (changes to origin will change app)
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @returns A function that takes a target snapshot and a boolean flag checking for firstCall, then invokes `jump` on that target snapshot
 *
 * The target snapshot portrays some past state we want to travel to.
 * `jump` recursively sets state for any stateful components.
 */
export default function timeJump(mode) {
  // Recursively change state of tree
  // Set the state of the origin tree if the component is stateful
  async function jump(target): Promise<void> {
    if (!target) return;
    // Base Case: if has visited, return
    if (circularComponentTable.has(target)) {
      return;
    } else {
      circularComponentTable.add(target);
    }
    // ------------------------STATELESS/ROOT COMPONENT-------------------------
    // Since stateless component has no data to update, continue to traverse its child nodes:
    if (target.state === 'stateless' || target.state === 'root') {
      target.children.forEach((child) => jump(child));
      return;
    }

    // Destructure component data:
    const { index, state, hooksIndex, hooksState } = target.componentData;
    // ------------------------STATEFUL CLASS COMPONENT-------------------------
    // for stateful class components
    // check if it is a stateful class component
    // if yes, find the component by its index and assign it to a variable
    // call that components setState method to reset state to the state at the time of the jump snapshot
    //index can be zero => falsy value => DO NOT REMOVE UNDEFINED
    if (index !== undefined) {
      // Obtain component data & its update method at the given index
      const classComponent = componentActionsRecord.getComponentByIndex(index);
      if (classComponent && classComponent.setState) {
        await classComponent.setState(
          // prevState contains the states of the snapshots we are jumping FROM, not jumping TO
          (prevState) => state,
        );
      }
      // Iterate through new children after state has been set
      target.children.forEach((child) => jump(child));
      return;
    }

    // ----------------------STATEFUL FUNCTIONAL COMPONENT----------------------
    // check if component states are set with hooks
    // if yes, grab all relevant components for this snapshot by its index
    // call dispatch on each component passing in the corresponding currState value
    //index can be zero => falsy value => DO NOT REMOVE UNDEFINED
    if (hooksIndex !== undefined) {
      // Obtain component data & its update method at the given index
      const functionalComponent = componentActionsRecord.getComponentByIndexHooks(hooksIndex);
      for (let i in functionalComponent) {
        await functionalComponent[i].dispatch(Object.values(hooksState)[i]);
      }
      // Iterate through new children after state has been set
      target.children.forEach((child) => jump(child));
      return;
    }
  }

  // payload from index.ts is assigned to target
  return (target, firstCall = false) => {
    // * Setting mode disables setState from posting messages to window
    mode.jumping = true;
    if (firstCall) circularComponentTable.clear();
    const navigating: boolean = routes.navigate(target.route);
    if (navigating) {
      addEventListener('popstate', (event) => {
        jump(target).then(() => {
          document.body.onmouseover = () => {
            mode.jumping = false;
          };
        });
      });
    } else {
      jump(target).then(() => {
        document.body.onmouseover = () => {
          mode.jumping = false;
        };
      });
    }
  };
}
