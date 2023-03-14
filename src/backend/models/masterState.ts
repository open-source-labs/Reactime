/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

/**
 * @type ComponentAction - an array of actions that can be performed on a component
 */
type ComponentAction = any[];

// The HookState data structure is an array that holds the current value of a hook's state, as well as a dispatch function that is used to update that state.
// Information on these components include ComponentData as well as state
// For class components, there will be one "component" for each snapshot
// For functional components that utilize Hooks, there will be one "component"
// for each setter/getter every time we have a new snapshot
let componentActionsRecord: ComponentAction = [];
// index keeps track of the current position in the array
let index: number;
index = 0;

export default {
  /**
   * @function clear - Clears componentActionsRecord
   */
  clear: () => {
    componentActionsRecord = [];
    index = 0;
  },

  /**
   * @function saveNew - Adds a new component to the componentActionsRecord array and returns its index.
   * @param component
   * @returns number
   */
  saveNew: (component): number => {
    componentActionsRecord[index] = component;
    index++;

    return index - 1;
  },
  // ----------------------------CLASS COMPONENT--------------------------------
  /**
   * @function getComponentByIndex - This function is used for stateful Class Component to retrieve an object that has the bound setState method
   * @param inputIndex - index of component inside `componentActionsRecord` coming from `timeJump.ts`
   * @returns - an object containing the bound setState method
   */
  getComponentByIndex: (inputIndex: number): any | undefined => componentActionsRecord[inputIndex],

  //---------------------------FUNCTIONAL COMPONENT-----------------------------
  /**
   * @function getComponentByIndexHooks - This function is used for Functional Component to retrieve an array of objects that have the bound dispatch methods.
   * @param inputIndex - index of component inside `componentActionsRecord` coming from `timeJump.ts`
   * @returns - an array of objects containing the bound dispatch methods
   */
  getComponentByIndexHooks: (inputIndex: Array<number> = []): any[] | undefined =>
    inputIndex.map((index) => componentActionsRecord[index]),
  // ----------------------------------DEBUGGING--------------------------------
  /**
   * @function getAllComponents - This method is used for debugging purpose to access the array of setState/dispatch methods
   * @returns - an array of objects containing the bound methods for updating state
   */
  getAllComponents: (): any[] => componentActionsRecord,
};
