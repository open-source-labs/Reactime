import React from 'react';
import Select from 'react-select';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SwitchApp from '../components/SwitchApp.jsx'

import { useStoreContext } from '../store';

configure({ adapter: new Adapter() });

jest.mock('../store');


describe('Unit testing for SwitchApp.jsx', () => {
  let wrapper;

  const state = {
    currentTab: 100,
    tabs: { 100: { snapshots: [1, 2, 3, 4], viewIndex: 1, sliderIndex: 1, title: 'component'} },
  };
  const tabsArray = [{ value: 100, label: {} }];
  const dropdownCurrTabLabel = {
    value: 100,
    label: {},
  };
  // nate and edwin: mockImplementation creates a mock function call
  const dispatch = jest.fn();
  // nate and edwin: mockImplementation creates a mock state
  useStoreContext.mockImplementation(() => [state, dispatch]);

  beforeEach(() => {
    wrapper = shallow(<SwitchApp />);
  });

  describe('SwitchApp Component', () => {
    it('SwitchApp component returns <Select /> from react-select library', () => {
      expect(wrapper.find('.tab-select-container').type()).toEqual(Select);
      expect(wrapper.find('.tab-select-container').props().className).toBe('tab-select-container');
      expect(Array.isArray(wrapper.find('.tab-select-container').props().options)).toBeTruthy();
      expect(wrapper.find('.tab-select-container').props().options[0]).toHaveProperty('value');
      expect(wrapper.find('.tab-select-container').props().options[0]).toHaveProperty('label');
      expect(wrapper.find('.tab-select-container').props()).toEqual(state.currentTab.value);
    });
  })

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

  // options should be an array
  // value prop should be equal to a number
  // check if onChange if the function runs
})       