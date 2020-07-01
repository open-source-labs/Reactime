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
    tabs: { 100: { snapshots: [1, 2, 3, 4], viewIndex: 1, sliderIndex: 1 } },
  };
  const tabsArray = [];
  const currTab = {
    value: 100,
    label: {},
  };

  const dispatch = jest.fn();
  useStoreContext.mockImplementation(() => [dispatch, state]);

  beforeEach(() => {
    wrapper = shallow(<SwitchApp />);
  });

  describe('currentTab', () => {
    it('should have properties value and label', () => {
      expect(currTab).toHaveProperty('value');
      expect(currTab).toHaveProperty('label');
    });
  });

// check if currTab has properties value, label
// currentTab should be a number
// tab should be an object
// check if onChange if the function runs
// className should be tab-select-container
// options should be an array
// value prop should be equal to a number
})       