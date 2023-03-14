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
  /**
   * The target snapshot to re-render
   */
  let target;
  /**
   * This function is to aid the removeListener for 'popstate'
   */
  // IMPORTANT: DO NOT move this function into return function. This function is out here so that it will not be redefined any time the return function is invoked. This is importatnt for removeEventListener for popstate to work.
  const popStateHandler = () => {
    initiateJump(target, mode);
  };

  /**
   * @param inputTarget - The target snapshot to re-render. The payload from index.ts is assigned to inputTarget
   * @param firstCall - A boolean flag checking for `firstCall`
   */
  return (inputTarget: Tree, firstCall = false): void => {
    // Setting mode disables setState from posting messages to window
    mode.jumping = true;
    // Set target for popStateHandler usage:
    target = inputTarget;
    // Clearn the circularComponentTable
    if (firstCall) circularComponentTable.clear();
    // Determine if user is navigating to another route
    // NOTE: Inside routes.navigate, if user is navigating, we will invoke history.go, which will go back/forth based on # of delta steps. This will trigger a popstate event. Since history.go is an async method, the event listener is the only way to invoke timeJump after we have arrived at the desirable route.
    const navigating: boolean = routes.navigate(inputTarget.route);
    if (navigating) {
      // Remove 'popstate' listener to avoid duplicate listeners
      removeEventListener('popstate', popStateHandler);
      // To invoke initateJump after history.go is complete
      addEventListener('popstate', popStateHandler);
    } else {
      // Intiate the jump immideately if not navigating
      initiateJump(inputTarget, mode);
    }
  };
}

/**
 * This function initiate the request for jump and will pause the jump when user moves mouse over the body of the document.
 * @param target - The target snapshot to re-render
 * @param mode - The current mode (i.e. jumping, time-traveling, or paused)
 */
async function initiateJump(target, mode): Promise<void> {
  updateTreeState(target).then(() => {
    document.body.onmouseover = () => {
      mode.jumping = false;
      console.log('mouseover');
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
  // Check if it is a stateful class component
  // Index can be zero => falsy value => DO NOT REMOVE UNDEFINED
  if (index !== undefined) {
    // Obtain the BOUND update method at the given index
    const classComponent = componentActionsRecord.getComponentByIndex(index);
    // Update component state
    await classComponent.setState(
      // prevState contains the states of the snapshots we are jumping FROM, not jumping TO
      (prevState) => state,
    );
    // Iterate through new children after state has been set
    target.children.forEach((child) => updateTreeState(child));
    return;
  }

  // ----------------------STATEFUL FUNCTIONAL COMPONENT----------------------
  // Check if it is a stateful functional component
  // if yes, grab all relevant components for this snapshot by its index
  // call dispatch on each component passing in the corresponding currState value
  //index can be zero => falsy value => DO NOT REMOVE UNDEFINED
  if (hooksIndex !== undefined) {
    // Obtain the array of BOUND update methods at the given indexes.
    // NOTE: each useState will be a separate update method. So if a component have 3 useState, we will obtain an array of 3 update methods.
    const functionalComponent = componentActionsRecord.getComponentByIndexHooks(hooksIndex);
    // Update component state
    for (let i in functionalComponent) {
      await functionalComponent[i].dispatch(Object.values(hooksState)[i]);
    }
    // Iterate through new children after state has been set
    target.children.forEach((child) => updateTreeState(child));
    return;
  }
}
