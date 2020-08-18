/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'core-js';
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const componentActionsRecord : Array<any> = [];
let index : number = 0;

export default {
  saveNew: (state, component) : number => {
    componentActionsRecord[index] = { state, component };
    index++;
    return index - 1;
  },
  getRecordByIndex: (inputIndex : number) : any => componentActionsRecord[inputIndex],
  getComponentByIndex: (inputIndex: number) : any => (componentActionsRecord[inputIndex]
    ? componentActionsRecord[inputIndex].component
    : undefined),
};
