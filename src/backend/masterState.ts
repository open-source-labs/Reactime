/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'core-js';
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const componentActionsRecord = {};
let index = 0;

export default {
  saveNew: (state, component) => {
    componentActionsRecord[index] = { state, component };
    index++;
    return index - 1;
  },
  getRecordByIndex: inputIndex => componentActionsRecord[inputIndex],
  getComponentByIndex: inputIndex => (componentActionsRecord[inputIndex]
    ? componentActionsRecord[inputIndex].component
    : undefined),
};

class twoHaha {
  private componenActionsRecord : Array<any>;
  private index = 0; 
}