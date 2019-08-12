/* eslint-disable react/jsx-filename-extension */

import { shallow, configure } from 'enzyme';
import React, { useState } from 'react';
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
      snapshots: [1, 2, 3, 4],
      sliderIndex: 0,
      viewIndex: -1,
    },
  },
  currentTab: 87,
};

const dispatch = jest.fn();
jest.mock('../store');
useStoreContext.mockImplementation(() => [state, dispatch]);

let wrapper;
// global.chrome = chrome;
const setnpm = jest.fn();



beforeEach(() => {
  wrapper = shallow(<MainContainer />);
  chrome.runtime.connect = () => {}
  console.log(chrome.runtime.connect);
  chrome.runtime.onMessage.dispatch({action: 'initialConnectSnapshots', payload: []});
  useStoreContext.mockClear();
  dispatch.mockClear();
});

describe('MainContainer rendering', () => {
  test('With no connection, should not render any containers', () => {
    expect(wrapper.text()).toEqual('please install our npm package in your app');
    expect(wrapper.find(HeadContainer).length).toBe(0);
    expect(wrapper.find(ActionContainer).length).toBe(0);
    expect(wrapper.find(StateContainer).length).toBe(0);
    expect(wrapper.find(TravelContainer).length).toBe(0);
    expect(wrapper.find(ButtonsContainer).length).toBe(0);
  });
  test('With connection established, should render all containers', () => {
    expect(wrapper.find(HeadContainer).length).toBe(1);
    expect(wrapper.find(ActionContainer).length).toBe(1);
    expect(wrapper.find(StateContainer).length).toBe(1);
    expect(wrapper.find(TravelContainer).length).toBe(1);
    expect(wrapper.find(ButtonsContainer).length).toBe(1);
  });
});
