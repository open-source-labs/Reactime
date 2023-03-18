import componentActionsRecord from '../models/masterState';
import { Status } from '../types/backendTypes';
import Tree from '../models/tree';

// THIS FILE CONTAINS NECCESSARY FUNCTIONALITY FOR TIME-TRAVEL FEATURE

/**
 *
 * This is a closure function to keep track of mode (jumping or not jumping)
 * @param mode - The current mode (i.e. jumping)
 * @returns an async function that takes an `targetSnapshot`, then invokes `updateReactFiberTree` based on the state provided within that target snapshot
 *
 */
export default function timeJumpInitiation(mode: Status) {
  /**
   * This function is to reset jumping mode to false when user hover the mouse over the browser body
   */
  const resetJumpingMode = (): void => {
    console.log('timeJump - STOP JUMPING');
    mode.jumping = false;
  };
  /**
   * This function that takes a `targetSnapshot` then invokes `updateReactFiberTree` to update the React Application on the browser to match states provided by the `targetSnapshot`
   * @param targetSnapshot - The target snapshot to re-render. The payload from index.ts is assigned to targetSnapshot
   */
  return async function timeJump(targetSnapshot: Tree): Promise<void> {
    mode.jumping = true;
    console.log('timeJump - START JUMPING');
    // Reset mode.navigating
    delete mode.navigating;
    // Traverse the snapshotTree to update ReactFiberTree
    updateReactFiberTree(targetSnapshot).then(() => {
      // Remove Event listener for mouse over
      removeEventListener('mouseover', resetJumpingMode);
      // Since in order to change state, user will need to navigate to browser
      // => set an event listener to resetJumpingMode when mouse is over the browser
      addEventListener('mouseover', resetJumpingMode, { once: true });
    });
  };
}

/**
 * This recursive function receives the target snapshot from front end and will update the state of the fiber tree if the component is stateful
 * @param targetSnapshot - Target snapshot portrays some past state we want to travel to.
 * @param circularComponentTable - A table contains visited components
 *
 */
async function updateReactFiberTree(
  targetSnapshot,
  circularComponentTable: Set<any> = new Set(),
): Promise<void> {
  if (!targetSnapshot) return;
  // Base Case: if has visited, return
  if (circularComponentTable.has(targetSnapshot)) {
    return;
  } else {
    circularComponentTable.add(targetSnapshot);
  }
  // ------------------------STATELESS/ROOT COMPONENT-------------------------
  // Since stateless component has no data to update, continue to traverse its child nodes:
  if (targetSnapshot.state === 'stateless' || targetSnapshot.state === 'root') {
    targetSnapshot.children.forEach((child) => updateReactFiberTree(child, circularComponentTable));
    return;
  }

  // Destructure component data:
  const { index, state, hooksIndex, hooksState } = targetSnapshot.componentData;
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
    targetSnapshot.children.forEach((child) => updateReactFiberTree(child, circularComponentTable));
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
    targetSnapshot.children.forEach((child) => updateReactFiberTree(child));
    return;
  }
}
