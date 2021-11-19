/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

// import {Hook}
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  HookStateItem, // obj with state and component
  HookStates, // array of hook state items
} from './types/backendTypes';

const componentActionsRecord: HookStates = [];
let index = 0;

export default {
  componentActionsRecord,
  saveNew: (state, component): number => {
    componentActionsRecord[index] = { state, component };
    index++;
    return index - 1;
  },
  getRecordByIndex: (inputIndex: number): HookStateItem => componentActionsRecord[inputIndex],
  getComponentByIndex: (inputIndex: number): any => (componentActionsRecord[inputIndex]
    ? componentActionsRecord[inputIndex].component
    : undefined),
  getComponentByIndexHooks: (inputIndex: Array<number> = []): any => {
    const multiDispatch = [];
    for (let i = 0; i < inputIndex.length; i++) {
      if (componentActionsRecord[inputIndex[i]]) multiDispatch.push(componentActionsRecord[inputIndex[i]].component);
    }
    return multiDispatch;
  },
};
