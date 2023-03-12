/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  HookStateItem, // obj with state and component
  HookStates, // array of hook state items
} from './types/backendTypes';

// HookState is an array that contains a "component" for
// every single state change that occurs in the app
// Information on these components include ComponentData as well as state
// For class components, there will be one "component" for each snapshot
// For functional components that utilize Hooks, there will be one "component"
// for each setter/getter every time we have a new snapshot
let componentActionsRecord: HookStates = [];
let index: number;
index = 0;

export default {
  clear: () => {
    componentActionsRecord = [];
    index = 0;
  },
  // adds new component to ComponentActionsRecord
  saveNew: (state, component): number => {
    console.log('masterState', { component, componentActionsRecord });
    componentActionsRecord[index] = { state, component };
    index++;

    return index - 1;
  },
  getRecordByIndex: (inputIndex: number): HookStateItem => componentActionsRecord[inputIndex],
  // this is used for class components -
  /* inputIndex will always be a fixed number (coming in timeJump.ts) */
  getComponentByIndex: (inputIndex: number): HookStateItem['component'] | undefined =>
    componentActionsRecord[inputIndex] ? componentActionsRecord[inputIndex].component : undefined,
  // this is used for react hooks - hooks will be passed in as an array from timeJump.ts
  getComponentByIndexHooks: (
    inputIndex: Array<number> = [],
  ): Array<HookStateItem['component']> | undefined => {
    const multiDispatch = [];
    for (let i = 0; i < inputIndex.length; i++) {
      if (componentActionsRecord[inputIndex[i]]) {
        multiDispatch.push(componentActionsRecord[inputIndex[i]].component);
      }
    }
    return multiDispatch;
  },
};
