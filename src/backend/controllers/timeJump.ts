import componentActionsRecord from '../models/masterState';
import { Status } from '../types/backendTypes';
import Tree from '../models/tree';
import { update } from 'lodash';

export default function timeJumpInitiation(mode: Status) {
  const resetJumpingMode = (): void => {
    mode.jumping = false;
  };

  return async function timeJump(targetSnapshot: Tree): Promise<void> {
    mode.jumping = true;
    delete mode.navigating;
    updateReactFiberTree(targetSnapshot).then(() => {
      document.removeEventListener('mouseover', resetJumpingMode);
      document.addEventListener('mouseover', resetJumpingMode, { once: true });
    });
  };
}

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
          try {
            // Use SET_STATE action to update the state
            const setStateAction = {
              type: 'SET_STATE',
              payload: targetState,
            };

            await reducer.dispatch(setStateAction);
          } catch (error) {
            console.error('Error updating reducer state:', {
              hookName,
              error,
              componentName: targetSnapshot.name,
            });
          }
        }
      }
    }

    targetSnapshot.children.forEach((child) => updateReactFiberTree(child, circularComponentTable));
    return;
  }
}
