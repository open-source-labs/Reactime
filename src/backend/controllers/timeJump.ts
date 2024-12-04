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
  if (circularComponentTable.has(targetSnapshot)) return;

  circularComponentTable.add(targetSnapshot);

  if (targetSnapshot.state === 'stateless' || targetSnapshot.state === 'root') {
    targetSnapshot.children.forEach((child) => updateReactFiberTree(child, circularComponentTable));
    return;
  }

  const { index, state, hooksIndex, hooksState, reducerStates } = targetSnapshot.componentData;

  // Handle class components
  if (index !== null) {
    const classComponent = componentActionsRecord.getComponentByIndex(index);
    if (classComponent !== undefined) {
      await classComponent.setState(() => state);
    }
    targetSnapshot.children.forEach((child) => updateReactFiberTree(child, circularComponentTable));
    return;
  }

  // Handle hooks
  if (hooksIndex !== null) {
    const functionalComponent = componentActionsRecord.getComponentByIndexHooks(hooksIndex);

    // Handle regular useState hooks
    if (hooksState) {
      const stateEntries = Object.entries(hooksState);
      for (let i = 0; i < stateEntries.length; i++) {
        const [key, value] = stateEntries[i];
        if (functionalComponent[i]?.dispatch) {
          await functionalComponent[i].dispatch(value);
        }
      }
    }

    // Handle reducer hooks
    if (reducerStates && reducerStates.length > 0) {
      for (const reducerState of reducerStates) {
        const { state: targetState, reducerIndex, hookName } = reducerState;
        const reducer = functionalComponent[reducerIndex];

        if (reducer?.dispatch) {
          console.log('Current reducer state:', {
            hookName,
            currentState: reducer.lastRenderedState,
            targetState,
          });

          // Store original values
          const originalReducer = reducer.lastRenderedReducer;
          const originalState = reducer.lastRenderedState;

          try {
            // Set the new state directly
            reducer.lastRenderedState = targetState;

            // Override the reducer temporarily
            reducer.lastRenderedReducer = (state: any, action: any) => {
              if (action.type === '@@REACTIME/FORCE_STATE_UPDATE') {
                return action.payload;
              }
              return originalReducer ? originalReducer(state, action) : state;
            };

            // Dispatch the force update action
            const forceUpdateAction = {
              type: '@@REACTIME/FORCE_STATE_UPDATE',
              payload: targetState,
            };

            await reducer.dispatch(forceUpdateAction);

            console.log('Post-dispatch state:', {
              hookName,
              newState: reducer.lastRenderedState,
              success: JSON.stringify(reducer.lastRenderedState) === JSON.stringify(targetState),
            });
          } catch (error) {
            console.error('Error updating reducer state:', {
              hookName,
              error,
              componentName: targetSnapshot.name,
            });
            // Restore original state on error
            reducer.lastRenderedState = originalState;
          } finally {
            // Restore original reducer
            reducer.lastRenderedReducer = originalReducer;

            console.log('Final reducer state check:', {
              hookName,
              originalState,
              targetState,
              finalState: reducer.lastRenderedState,
              stateMatchesTarget:
                JSON.stringify(reducer.lastRenderedState) === JSON.stringify(targetState),
            });
          }
        } else {
          console.warn('No dispatch found for reducer:', {
            hookName,
            reducerIndex,
            componentName: targetSnapshot.name,
          });
        }
      }
    }

    targetSnapshot.children.forEach((child) => updateReactFiberTree(child, circularComponentTable));
    return;
  }
}
