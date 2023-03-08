import masterState from '../masterState';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  HookStateItem,
  HookStates,
} from '../types/backendTypes';

describe('Testing masterState functionality', () => {
  const hookOne: HookStateItem = { state: 'A', component: 'counter1' };
  const hookTwo: HookStateItem = { state: 'B', component: 'counter2' };
  const hookThree: HookStateItem = { state: 'C', component: 'counter3' };
  const allHooks: HookStates = [hookOne, hookTwo];

  describe('saveNew', () => {
    it('Should return the index of the saved component', () => {
      expect(masterState.saveNew(hookOne.state, hookOne.component)).toBe(0);
      expect(masterState.saveNew(hookTwo.state, hookTwo.component)).toBe(1);
    });
  });

  describe('getComponentByIndex', () => {
    it('Should return the component when given a valid index', () => {
      expect(masterState.getComponentByIndex(0)).toEqual(hookOne.component);
      expect(masterState.getComponentByIndex(1)).toEqual(hookTwo.component);
    });
    it('Should return undefined when given an invalid index', () => {
      expect(masterState.getComponentByIndex(2)).toBe(undefined);
    });
  });

  describe('getRecordByIndex', () => {
    it('Should return the record when given a valid index', () => {
      expect(masterState.getRecordByIndex(0)).toEqual(hookOne);
      expect(masterState.getRecordByIndex(1)).toEqual(hookTwo);
    });
    it('Should return undefined when given an invalid index', () => {
      expect(masterState.getRecordByIndex(2)).toBe(undefined);
    });
  });

  describe('getComponentByIndexHooks', () => {
    it('Should return an array of components when given an a valid array of indices', () => {
      expect(masterState.getComponentByIndexHooks([0, 1])).toEqual([
        hookOne.component,
        hookTwo.component,
      ]);
    });
    it('Should return an empty array when given an invalid array of indices', () => {
      expect(masterState.getComponentByIndexHooks([2])).toEqual([]);
    });
  });

  describe('clear', () => {
    it('Should return undefined', () => {
      expect(masterState.clear()).toBe(undefined);
    });
    it('Should reset the componentActionRecord index', () => {
      expect(masterState.saveNew(hookThree.state, hookThree.component)).toBe(0);
    });
    it('Should empty the componentActionRecord array', () => {
      expect(masterState.getComponentByIndex(0)).toEqual(hookThree.component);
    });
  });
});
