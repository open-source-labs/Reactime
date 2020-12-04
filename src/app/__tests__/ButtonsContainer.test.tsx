/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */
import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import ButtonsContainer from '../containers/ButtonsContainer';
import { useStoreContext } from '../store';
import { toggleMode } from '../actions/actions';

configure({ adapter: new (Adapter as any)() });

const state = {
  tabs: {
    87: {
      snapshots: [1, 2, 3, 4],
      sliderIndex: 0,
      viewIndex: -1,
      mode: {
        paused: false,
        locked: false,
        persist: false,
      },
    },
  },
  currentTab: 87,
};

const currentTab = state.tabs[state.currentTab];

const dispatch = jest.fn();

jest.mock('../store');
useStoreContext.mockImplementation(() => [state, dispatch]);

let wrapper;

describe('testing the bottom buttons', () => {
  beforeEach(() => {
    wrapper = shallow(<ButtonsContainer />);
    dispatch.mockClear();
    useStoreContext.mockClear();
    currentTab.mode = {
      // locked: false,
      paused: false,
      persist: false,
    };
  });

  describe('pause button testing', () => {
    beforeEach(() => {
      wrapper.find('.pause-button').simulate('click');
    });
    test('pause button dispatches upon click', () => {
      expect(dispatch.mock.calls.length).toBe(1);
    });

    test('pause button dispatches toggleMode action', () => {
      expect(dispatch.mock.calls[0][0]).toEqual(toggleMode('paused'));
    });

    test('pause button displays state', () => {
      expect(wrapper.find('.pause-button').text()).toBe('<FontAwesomeIcon />Lock');
      state.tabs[state.currentTab].mode.paused = true;
      wrapper = shallow(<ButtonsContainer />);
      expect(wrapper.find('.pause-button').text()).toBe('<FontAwesomeIcon />Unlock');
    }); 
  });
  // describe('lock button testing', () => {
  //   beforeEach(() => {
  //     wrapper.find('.lock-button').simulate('click');
  //   });
  //   test('lock button dispatches upon click', () => {
  //     expect(dispatch.mock.calls.length).toBe(1);
  //   });

  //   test('lock button dispatches toggleMode action', () => {
  //     expect(dispatch.mock.calls[0][0]).toEqual(toggleMode('locked'));
  //   });

  //   test('lock button displays state', () => {
  //     expect(wrapper.find('.lock-button').text()).toBe('Lock');
  //     state.tabs[state.currentTab].mode.locked = true;
  //     wrapper = shallow(<ButtonsContainer />);
  //     expect(wrapper.find('.lock-button').text()).toBe('Unlock');
  //   });
  // });

  describe('persist button testing', () => {
    beforeEach(() => {
      wrapper.find('.persist-button').simulate('click');
    });

    test('persist button dispatches upon click', () => {
      expect(dispatch.mock.calls.length).toBe(1);
    });

    test('persist button dispatches toggleMode action', () => {
      expect(dispatch.mock.calls[0][0]).toEqual(toggleMode('persist'));
    });

    test('persist button displays state', () => {
      expect(wrapper.find('.persist-button').text()).toBe('<FontAwesomeIcon />Persist');
      state.tabs[state.currentTab].mode.persist = true;
      wrapper = shallow(<ButtonsContainer />);
      expect(wrapper.find('.persist-button').text()).toBe('<FontAwesomeIcon />Unpersist');
    });
  });
});
