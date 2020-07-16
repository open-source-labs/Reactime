/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Select from 'react-select';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SwitchApp from '../components/SwitchApp';

import { useStoreContext } from '../store';

configure({ adapter: new (Adapter as any)() });

jest.mock('../store');

describe('Unit testing for SwitchApp.jsx', () => {
  let wrapper;

  const state = {
    currentTab: 100,
    tabs: {
      100: {
        snapshots: [1, 2, 3, 4], viewIndex: 1, sliderIndex: 1, title: 'component',
      },
    },
  };
  const dropdownCurrTabLabel = {
    value: 100,
    label: 'component',
  };
  // mockImplementation creates a mock function call
  const dispatch = jest.fn();

  // mockImplementation creates a mock state
  useStoreContext.mockImplementation(() => [state, dispatch]);

  beforeEach(() => {
    wrapper = shallow(<SwitchApp />);
    dispatch.mockClear();
  });

  describe('SwitchApp Component', () => {
    beforeEach(() => {
      wrapper.find('.tab-select-container').simulate('change', {});
    });
    it('SwitchApp component returns <Select /> from react-select library', () => {
      expect(wrapper.find('.tab-select-container').type()).toEqual(Select);
      expect(wrapper.find('.tab-select-container').props().className).toBe('tab-select-container');
      expect(wrapper.find('.tab-select-container').props().value).toEqual(dropdownCurrTabLabel);
    });
    it('OnChange should run dispatch function', () => {
      expect(dispatch.mock.calls.length).toBe(1);
    });
    it('options prop should be an array', () => {
      expect(Array.isArray(wrapper.find('.tab-select-container').props().options)).toBeTruthy();
      expect(wrapper.find('.tab-select-container').props().options[0]).toHaveProperty('value');
      expect(wrapper.find('.tab-select-container').props().options[0]).toHaveProperty('label');
    });
  });

  describe('dropdownCurrTabLabel', () => {
    it('should have properties value and label', () => {
      expect(dropdownCurrTabLabel).toHaveProperty('value');
      expect(dropdownCurrTabLabel).toHaveProperty('label');
    });
  });

  describe('state', () => {
    it('currentTab value should be a number', () => {
      expect(typeof state.currentTab).toEqual('number');
    });
    it('tabs value should be an object', () => {
      expect(typeof state.tabs).toEqual('object');
    });
  });
});
