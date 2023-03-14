/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/**
 * @type ComponentAction - an array of actions that can be performed on a component
 */
type ComponentAction = {
  [url: string]: any[];
};
type ComponentActionRecord = ComponentAction[];

// The HookState data structure is an array that holds the current value of a hook's state, as well as a dispatch function that is used to update that state.
// Information on these components include ComponentData as well as state
// For class components, there will be one "component" for each snapshot
// For functional components that utilize Hooks, there will be one "component"
// for each setter/getter every time we have a new snapshot
let componentActionsRecord: ComponentActionRecord = [];
// index keeps track of the current position in the array
let index: number;
index = 0;

export default {
  /**
   * @function clear - Clears componentActionsRecord
   */
  clear: () => {
    componentActionsRecord[window.location.href] = [];
    index = 0;
  },

  /**
   * @function saveNew - Adds a new component to the componentActionsRecord array and returns its index.
   * @param component
   * @returns number
   */
  saveNew: (component): number => {
    componentActionsRecord[window.location.href].push(component);
    // componentActionsRecord[index] = component;
    // index++;

    // return index - 1;
    return componentActionsRecord[window.location.href].length - 1;
  },
  // ----------------------------CLASS COMPONENT--------------------------------
  /**
   * @function getComponentByIndex - This function is used for stateful Class Component to retrieve an object that has the bound setState method
   * @param inputIndex - index of component inside `componentActionsRecord` coming from `timeJump.ts`
   * @returns - an object containing the bound setState method
   */
  getComponentByIndex: (inputIndex: number): any | undefined =>
    componentActionsRecord[window.location.href][inputIndex],

  //---------------------------FUNCTIONAL COMPONENT-----------------------------
  /**
   * @function getComponentByIndexHooks - This function is used for Functional Component to retrieve an array of objects that have the bound dispatch methods.
   * @param inputIndex - index of component inside `componentActionsRecord` coming from `timeJump.ts`
   * @returns - an array of objects containing the bound dispatch methods
   */
  getComponentByIndexHooks: (inputIndex: Array<number> = []): any[] | undefined =>
    inputIndex.map((index) => componentActionsRecord[window.location.href][index]),
  // ----------------------------------DEBUGGING--------------------------------
  /**
   * @function getAllComponents - This method is used for debugging purpose to access the array of setState/dispatch methods
   * @returns - an array of objects containing the bound methods for updating state
   */
  getAllComponents: (): any[] => componentActionsRecord[window.location.href],
};
