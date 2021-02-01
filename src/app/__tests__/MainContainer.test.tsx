/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react/jsx-filename-extension */
import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import MainContainer from '../containers/MainContainer';
import { useStoreContext } from '../store';

import ActionContainer from '../containers/ActionContainer';
import StateContainer from '../containers/StateContainer';
import TravelContainer from '../containers/TravelContainer';
import ButtonsContainer from '../containers/ButtonsContainer';

const chrome = require('sinon-chrome');

configure({ adapter: new (Adapter as any)() });

const state = {
  tabs: {},
  currentTab: null,
};

const dispatch = jest.fn();
jest.mock('../store');
useStoreContext.mockImplementation(() => [state, dispatch]);

let wrapper;
global.chrome = chrome;
const port = {
  onMessage: {
    addListener: () => {},
  },
  onDisconnect: {
    addListener: () => {},
  },
};
chrome.runtime.connect.returns(port);

beforeEach(() => {
  wrapper = shallow(<MainContainer />);
  useStoreContext.mockClear();
  dispatch.mockClear();
});

describe('MainContainer rendering', () => {
  test('With no snapshots, should not render any containers', () => {
    expect(wrapper.text()).toEqual(
      'No React application found. Please visit reactime.io to more info.If you are using a React application, make sure tha you application is running in development mode.NOTE: The React Developer Tools extension is also required for Reactime to run, if you do not already have it installed on your browser.',
    );
    expect(wrapper.find(ActionContainer).length).toBe(0);
    expect(wrapper.find(StateContainer).length).toBe(0);
    expect(wrapper.find(TravelContainer).length).toBe(0);
    expect(wrapper.find(ButtonsContainer).length).toBe(0);
  });
  test('With snapshots, should render all containers', () => {
    state.currentTab = 87;
    state.tabs[87] = {
      snapshots: [{}],
      viewIndex: -1,
      sliderIndex: 0,
      mode: {},
    };

    wrapper = shallow(<MainContainer />);
    expect(wrapper.find(ActionContainer).length).toBe(1);
    expect(wrapper.find(StateContainer).length).toBe(1);
    expect(wrapper.find(TravelContainer).length).toBe(1);
    expect(wrapper.find(ButtonsContainer).length).toBe(1);
  });
});
