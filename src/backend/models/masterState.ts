/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

type ComponentAction = any[];

// HookState is an array that contains a "component" for
// every single state change that occurs in the app
// Information on these components include ComponentData as well as state
// For class components, there will be one "component" for each snapshot
// For functional components that utilize Hooks, there will be one "component"
// for each setter/getter every time we have a new snapshot
let componentActionsRecord: ComponentAction = [];
let index: number;
index = 0;

export default {
  clear: () => {
    componentActionsRecord = [];
    index = 0;
  },
  // Adds new component to ComponentActionsRecord
  saveNew: (component): number => {
    componentActionsRecord[index] = component;
    index++;

    return index - 1;
  },
  // ----------------------------CLASS COMPONENT--------------------------------
  /**
   * This function is used for stateful Class Component to retrieve an object that has the bound setState method
   * @param inputIndex - index of component inside `componentActionsRecord` coming from `timeJump.ts`
   * @returns - an object containing the bound setState method
   */
  getComponentByIndex: (inputIndex: number): any | undefined => componentActionsRecord[inputIndex],

  //---------------------------FUNCTIONAL COMPONENT-----------------------------
  /**
   * This function is used for Functional Component to retrieve an array of objects that have the bound dispatch methods.
   * @param inputIndex - index of component inside `componentActionsRecord` coming from `timeJump.ts`
   * @returns - an array of objects containing the bound dispatch methods
   */
  getComponentByIndexHooks: (inputIndex: Array<number> = []): any[] | undefined =>
    inputIndex.map((index) => componentActionsRecord[index]),
};
