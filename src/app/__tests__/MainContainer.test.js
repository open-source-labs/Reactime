/* eslint-disable react/jsx-filename-extension */

import { mount, configure } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import MainContainer from '../containers/MainContainer';
import { useStoreContext } from '../store';

import HeadContainer from '../containers/HeadContainer';
import ActionContainer from '../containers/ActionContainer';
import StateContainer from '../containers/StateContainer';
import TravelContainer from '../containers/TravelContainer';
import ButtonsContainer from '../containers/ButtonsContainer';

const chrome = require('sinon-chrome');

configure({ adapter: new Adapter() });

const state = {
  tabs: {
    87: {
      snapshots: [{}, {}, {}, {}],
      sliderIndex: 0,
      viewIndex: -1,
      mode: {},
    },
  },
  currentTab: 87,
};

const dispatch = jest.fn();
jest.mock('../store');
useStoreContext.mockImplementation(() => [state, dispatch]);

let wrapper;
global.chrome = chrome;
let eventListener;
const port = {
  onMessage: {
    addListener: fn => {
      eventListener = fn;
    },
  },
  onDisconnect: {
    addListener: () => {},
  },
};
chrome.runtime.connect.returns(port);

beforeEach(() => {
  wrapper = mount(<MainContainer />);
  useStoreContext.mockClear();
  dispatch.mockClear();
});

describe('MainContainer rendering', () => {
  test.skip('With no connection, should not render any containers', () => {
    expect(wrapper.text()).toEqual('please install our npm package in your app');
    expect(wrapper.find(HeadContainer).length).toBe(0);
    expect(wrapper.find(ActionContainer).length).toBe(0);
    expect(wrapper.find(StateContainer).length).toBe(0);
    expect(wrapper.find(TravelContainer).length).toBe(0);
    expect(wrapper.find(ButtonsContainer).length).toBe(0);
  });
  test('With connection established, should render all containers', () => {
    // fake connect
    act(() => {
      eventListener({
        action: 'initialConnectSnapshots',
        payload: 'test',
      });
    });
    wrapper.update();
    expect(wrapper.find(HeadContainer).length).toBe(1);
    expect(wrapper.find(ActionContainer).length).toBe(1);
    expect(wrapper.find(StateContainer).length).toBe(1);
    expect(wrapper.find(TravelContainer).length).toBe(1);
    expect(wrapper.find(ButtonsContainer).length).toBe(1);
  });
});
