import routes from '../models/routes';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import componentActionsRecord from '../models/masterState';
import { Status } from '../types/backendTypes';
import Tree from '../models/tree';
const circularComponentTable = new Set();

/**
 * This file contains necessary functionality for time-travel feature.
 *
 * The target snapshot portrays some past state we want to travel to `jump` recursively and setState for any stateful component.
 *
 * @param mode - The current mode (i.e. jumping, time-traveling, or paused)
 * @returns A function that takes a `target` snapshot and a boolean flag checking for `firstCall`, then invokes `jump` on that target snapshot
 *
 */
export default function timeJump(mode: Status) {
  // payload from index.ts is assigned to target
  /**
   * @param target - The target snapshot to re-render
   * @param firstCall - A boolean flag checking for `firstCall`
   */
  return (target: Tree, firstCall = false): void => {
    // Setting mode disables setState from posting messages to window
    mode.jumping = true;
    // Clearn the circularComponentTable
    if (firstCall) circularComponentTable.clear();
    // Determine if user is navigating to another site
    const navigating: boolean = routes.navigate(target.route);

    if (navigating) {
      // Initiate popStateHandler to aid the removeListener for 'popstate'
      const popStateHandler = () => {
        initiateJump(target, mode);
      };
      // removeEventListener('popstate', popStateHandler);
      // Background will "perform" popstate till get to the correct history location?
      addEventListener('popstate', popStateHandler);
    } else {
      // Intiate the jump
      initiateJump(target, mode);
    }
  };
}

/**
 * This function initiate the request for jump and will pause the jump when user moves mouse over the body of the document.
 * @param target - The target snapshot to re-render
 * @param mode - The current mode (i.e. jumping, time-traveling, or paused)
 */
async function initiateJump(target, mode): Promise<void> {
  console.log('JUMP');
  updateTreeState(target).then(() => {
    document.body.onmouseover = () => {
      mode.jumping = false;
    };
  });
}

/**
 * This recursive function receives the target snapshot and will update the state of the fiber tree if the component is statefu
 * @param target - The target snapshot to re-render
 */
async function updateTreeState(target): Promise<void> {
  if (!target) return;
  // Base Case: if has visited, return
  if (circularComponentTable.has(target)) {
    return;
  } else {
    circularComponentTable.add(target);
  }
  // console.log(target.name);
  // ------------------------STATELESS/ROOT COMPONENT-------------------------
  // Since stateless component has no data to update, continue to traverse its child nodes:
  if (target.state === 'stateless' || target.state === 'root') {
    target.children.forEach((child) => updateTreeState(child));
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
    // If the user navigate to another page during jumps, Routes methods will popState until find a match => this cause changes in componentActionRecord => keep the if statement, otherwise will run into Uncaught Promise type error.
    if (classComponent?.setState) {
      // Update component state
      await classComponent.setState(
        // prevState contains the states of the snapshots we are jumping FROM, not jumping TO
        (prevState) => state,
      );
    }
    // Else statement is to ensure if a mismatch, this popstate is not the correct componentActionRecord. Return immediately to avoid traverse the entire tree
    else return;

    // Iterate through new children after state has been set
    target.children.forEach((child) => updateTreeState(child));
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
    // If the user navigate to another page during jumps, Routes methods will popState until find a match => this cause changes in componentActionRecord => keep the if statement, otherwise will run into Uncaught Promise type error.
    if (functionalComponent[0]?.dispatch) {
      // Update component state
      for (let i in functionalComponent) {
        await functionalComponent[i].dispatch(Object.values(hooksState)[i]);
      }
    }
    // Else statement is to ensure if a mismatch, this popstate is not the correct componentActionRecord. Return immediately to avoid traverse the entire tree
    else return;

    // Iterate through new children after state has been set
    target.children.forEach((child) => updateTreeState(child));
    return;
  }
}
