import componentActionsRecord from '../models/masterState';
import { Status } from '../types/backendTypes';
import Tree from '../models/tree';
import { update } from 'lodash';

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
    mode.jumping = false;
  };
  /**
   * This function that takes a `targetSnapshot` then invokes `updateReactFiberTree` to update the React Application on the browser to match states provided by the `targetSnapshot`
   * @param targetSnapshot - The target snapshot to re-render. The payload from index.ts is assigned to targetSnapshot
   */
  return async function timeJump(targetSnapshot: Tree): Promise<void> {
    mode.jumping = true;
    // Reset mode.navigating
    delete mode.navigating;
    // Traverse the snapshotTree to update ReactFiberTree
    updateReactFiberTree(targetSnapshot).then(() => {
      // Remove Event listener for mouse over
      document.removeEventListener('mouseover', resetJumpingMode);
      // Since in order to change state, user will need to navigate to browser
      // => set an event listener to resetJumpingMode when mouse is over the browser
      document.addEventListener('mouseover', resetJumpingMode, { once: true });
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
  if (targetSnapshot.state === 'stateless' || targetSnapshot.state === 'root') {
    targetSnapshot.children.forEach((child) => updateReactFiberTree(child, circularComponentTable));
    return;
  }

  const { index, state, hooksIndex, hooksState, reducerState } = targetSnapshot.componentData;

  // ------------------------STATEFUL CLASS COMPONENT-------------------------
  if (index !== null) {
    const classComponent = componentActionsRecord.getComponentByIndex(index);
    if (classComponent !== undefined) {
      await classComponent.setState(() => state);
    }
    targetSnapshot.children.forEach((child) => updateReactFiberTree(child, circularComponentTable));
    return;
  }

  // ----------------------STATEFUL FUNCTIONAL COMPONENT----------------------
  if (hooksIndex !== null) {
    const functionalComponent = componentActionsRecord.getComponentByIndexHooks(hooksIndex);

    // Handle reducer state if present
    if (reducerState) {
      try {
        // For reducer components, update using the first dispatch function
        await functionalComponent[0]?.dispatch(reducerState);
      } catch (err) {
        console.error('Error updating reducer state:', err);
      }
    } else {
      // Handle normal useState components
      for (let i in functionalComponent) {
        if (functionalComponent[i]?.dispatch) {
          await functionalComponent[i].dispatch(Object.values(hooksState)[i]);
        }
      }
    }
    targetSnapshot.children.forEach((child) => updateReactFiberTree(child));
    return;
  }
}
