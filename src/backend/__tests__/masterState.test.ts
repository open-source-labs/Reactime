import masterState from '../masterState'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  HookStateItem,
  HookStates
} from '../types/backendTypes';

describe('Testing masterState functionality', () => {
  let hookOne : HookStateItem = {state: 'A', component: 'counter1'};
  let hookTwo : HookStateItem = {state: 'B', component: 'counter2'};
  let allHooks : HookStates = [hookOne, hookTwo];
  masterState.saveNew(hookOne.state, hookOne.component);
  masterState.saveNew(hookTwo.state, hookTwo.component);

  describe('Save new', () => {
    masterState.saveNew(hookOne.state, hookOne.component);
    masterState.saveNew(hookTwo.state, hookTwo.component);
  })

  describe('getComponentByIndex', () => {
    it('should be able to get both hook states component', () => {
      expect(masterState.getComponentByIndex(0)).toEqual(hookOne.component);
      expect(masterState.getComponentByIndex(1)).toEqual(hookTwo.component);
    })
  })

  describe('getRecordByIndex', () => {
    it('should be able to get both hook states', () => {
      expect(masterState.getRecordByIndex(0)).toEqual(hookOne);
      expect(masterState.getRecordByIndex(1)).toEqual(hookTwo);
    })
  })

  
})
