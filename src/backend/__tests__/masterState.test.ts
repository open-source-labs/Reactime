import { ComponentAction, ComponentActionRecord } from '../models/masterState';
import componentActionRecord from '../models/masterState';

describe('Master State unit tests', () => {
  describe('ComponentAction and ComponentActionRecord type tests', () => {
    it('ComponentAction should be an object with string keys and array values', () => {
      const componentAction: ComponentAction = {
        'http://test.com': ['action1', 'action2'],
      };
      expect(componentAction).toEqual(expect.any(Object));
      expect(Object.keys(componentAction)).toEqual(expect.arrayContaining(['http://test.com']));
      expect(Array.isArray(componentAction['http://test.com'])).toBe(true);
    });

    it('ComponentActionRecord should be an array of ComponentAction', () => {
      const componentActionRecord: ComponentActionRecord = [
        { 'http://test.com': ['action1', 'action2'] },
        { 'http://test.com/2': ['action3', 'action4'] },
      ];
      expect(componentActionRecord).toEqual(expect.any(Array));
      expect(componentActionRecord.length).toBe(2);
      expect(componentActionRecord[0]).toEqual(
        expect.objectContaining({ 'http://test.com': expect.any(Array) }),
      );
      expect(componentActionRecord[1]).toEqual(
        expect.objectContaining({ 'http://test.com/2': expect.any(Array) }),
      );
    });

    it('ComponentAction should be an object with string keys and array values', () => {
      const componentAction: ComponentAction = {
        'http://test.com': ['action1', 'action2'],
      };
      expect(componentAction).toEqual(expect.any(Object));
      expect(Object.keys(componentAction)).toEqual(expect.arrayContaining(['http://test.com']));
      expect(Array.isArray(componentAction['http://test.com'])).toBe(true);
    });

    it('ComponentActionRecord should be an array of ComponentActions', () => {
      const componentActionRecord: ComponentActionRecord = [
        { 'http://test.com': ['action1', 'action2'] },
        { 'http://test.com/2': ['action3', 'action4'] },
      ];
      expect(componentActionRecord).toEqual(expect.any(Array));
      expect(componentActionRecord.length).toBe(2);
      expect(componentActionRecord[0]).toEqual(
        expect.objectContaining({ 'http://test.com': expect.any(Array) }),
      );
      expect(componentActionRecord[1]).toEqual(
        expect.objectContaining({ 'http://test.com/2': expect.any(Array) }),
      );
    });
  });

  describe('componentActionRecord unit tests', () => {
    const component1 = { state: 'dummy state', props: {} };
    const component2 = { state: 'dummy state2', props: {} };
    const component3 = { state: 'dummy state3', props: {} };

    beforeEach(() => {
      componentActionRecord.clear();
    });

    describe('saveNew', () => {
      it('should add a new component to componentActionRecord and return its index', () => {
        const index1 = componentActionRecord.saveNew(component1);
        const index2 = componentActionRecord.saveNew(component2);
        const index3 = componentActionRecord.saveNew(component3);

        expect(index1).toEqual(0);
        expect(index2).toEqual(1);
        expect(index3).toEqual(2);
        expect(componentActionRecord.getAllComponents()).toEqual([
          component1,
          component2,
          component3,
        ]);
      });
    });

    describe('clear', () => {
      it('should clear componentActionsRecord', () => {
        componentActionRecord.saveNew(component1);
        componentActionRecord.clear();
        expect(componentActionRecord.getAllComponents()).toEqual([]);

        componentActionRecord.saveNew(component2);
        componentActionRecord.saveNew(component3);
        componentActionRecord.clear();
        expect(componentActionRecord.getAllComponents()).toEqual([]);
      });
    });

    describe('getComponentByIndex', () => {
      it('should return the component at the specified index', () => {
        componentActionRecord.saveNew(component1);
        componentActionRecord.saveNew(component2);

        expect(componentActionRecord.getComponentByIndex(0)).toEqual(component1);
        expect(componentActionRecord.getComponentByIndex(1)).toEqual(component2);
      });

      it('should return undefined when passed an index that does not exist', () => {
        expect(componentActionRecord.getComponentByIndex(0)).toBeUndefined();
      });
    });

    describe('getComponentByIndexHooks', () => {
      it('should return the components at the specified indices', () => {
        componentActionRecord.saveNew(component1);
        componentActionRecord.saveNew(component2);
        componentActionRecord.saveNew(component3);

        expect(componentActionRecord.getComponentByIndexHooks([0])).toEqual([component1]);
        expect(componentActionRecord.getComponentByIndexHooks([1, 2])).toEqual([
          component2,
          component3,
        ]);
        expect(window.location.href).toBeTruthy();
      });

      it('should return undefined when passed an empty array', () => {
        expect(componentActionRecord.getComponentByIndexHooks()).toBeUndefined();
      });

      it('should return undefined when passed an index that does not exist', () => {
        expect(componentActionRecord.getComponentByIndexHooks([0])).toBeUndefined();
      });
    });

    describe('getAllComponents', () => {
      it('should return all components in componentActionRecord', () => {
        componentActionRecord.saveNew(component1);
        componentActionRecord.saveNew(component2);
        componentActionRecord.saveNew(component3);

        expect(componentActionRecord.getAllComponents()).toEqual([
          component1,
          component2,
          component3,
        ]);
      });
    });
  });
});
