/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { useStoreContext } from '../store';

const Diff = require('../components/Diff').default;

configure({ adapter: new (Adapter as any)() });

jest.mock('../store');

describe('Unit testing for Diff.jsx', () => {
  let wrapper;
  const props = {
    show: false,
    snapshot: [
      {
        children: [
          {
            state: { total: 12, next: 5, operation: null },
          },
        ],
      },
    ],
  };

  const state = {
    currentTab: 100,
    tabs: { 100: { snapshots: [1, 2, 3, 4], viewIndex: 1, sliderIndex: 1 } },
  };

  useStoreContext.mockImplementation(() => [state]);

  const delta = { children: {} }; // expect delta to be an obj
  const html = 'html'; // expect html to be a string
  const previous = { state: 'string', children: {} }; // expect previous to be an obj

  beforeEach(() => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    wrapper = shallow(<Diff {...props} />);
  });

  describe('delta', () => {
    it('delta variable should be an object, with a property children', () => {
      expect(typeof delta).toBe('object');
      expect(delta).toHaveProperty('children');
    });
  });

  describe('html', () => {
    it('html variable should be a string', () => {
      expect(typeof html).toBe('string');
    });
  });

  describe('previous', () => {
    it('previous variable should be a object', () => {
      expect(previous).toHaveProperty('state');
      expect(previous).toHaveProperty('children');
      expect(typeof previous).toBe('object');
    });
  });

  describe('Diff Component', () => {
    it('Check if Diff component is a div', () => {
      expect(wrapper.type()).toEqual('div');
    });
    it('Check if Diff component inner text value is a string', () => {
      expect(typeof wrapper.text()).toEqual('string');
    });
    it('Check if previous and delta is defined Diff should not have text content "No state change detected. Trigger an event to change state"', () => {
      expect(wrapper.textContent).not.toEqual(
        'No state change detected. Trigger an event to change state',
      );
    });
  });
});
