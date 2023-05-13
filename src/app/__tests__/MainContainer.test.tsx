import React from 'react';
import { render, screen } from '@testing-library/react';
import MainContainer from '../containers/MainContainer';
import { useStoreContext } from '../store';

const chrome = require('sinon-chrome');

const mockActionContainer = jest.fn();
jest.mock('../containers/ActionContainer', () => (props) => {
  mockActionContainer(props);
  return <div>mockActionContainer</div>;
});

const mockStateContainer = jest.fn();
jest.mock('../containers/StateContainer', () => (props) => {
  mockStateContainer(props);
  return <div>mockStateContainer</div>;
});

const mockTravelContainer = jest.fn();
jest.mock('../containers/TravelContainer', () => (props) => {
  mockTravelContainer(props);
  return <div>mockTravelContainer</div>;
});
const mockButtonsContainer = jest.fn();
jest.mock('../containers/ButtonsContainer', () => (props) => {
  mockButtonsContainer(props);
  return <div>mockButtonsContainer</div>;
});
const mockErrorContainer = jest.fn();
jest.mock('../containers/ErrorContainer', () => (props) => {
  mockErrorContainer(props);
  return <div>mockErrorContainer</div>;
});

const state = {
  tabs: {},
  currentTab: null,
};
const dispatch = jest.fn();
jest.mock('../../../node_modules/intro.js/introjs.css', () => jest.fn());
jest.mock('../store');
useStoreContext.mockImplementation(() => [state, dispatch]);

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

describe('With no snapshots, should not render any containers', () => {
  test('With no snapshots, ErrorContainer should render', () => {
    render(<MainContainer />);
    expect(screen.getByText('mockErrorContainer')).toBeInTheDocument();
    expect(mockErrorContainer).toBeCalledTimes(1);
    const error = screen.queryByText('mockErrorContainer');
    expect(error).not.toBeNull();
  });
  test('With no snapshots, ActionContainer should not render', () => {
    render(<MainContainer />);
    const ActionContainer = screen.queryByText('mockActionContainer');
    expect(ActionContainer).not.toBeInTheDocument();
  });
  test('With no snapshots, StateContainer should not render', () => {
    render(<MainContainer />);
    const StateContainer = screen.queryByText('mockStateContainer');
    expect(StateContainer).toBeNull();
  });
  test('With no snapshots, TravelContainer should not render', () => {
    render(<MainContainer />);
    const TravelContainer = screen.queryByText('mockTravelContainer');
    expect(TravelContainer).toBeNull();
  });
  test('With no snapshots, ButtonsContainer should not render', () => {
    render(<MainContainer />);
    const ButtonsContainer = screen.queryByText('mockButtonsContainer');
    expect(ButtonsContainer).toBeNull();
  });
});

describe('With snapshots, should render all containers', () => {
  beforeEach(() => {
    render(<MainContainer />);
    useStoreContext.mockClear();
    dispatch.mockClear();
    mockErrorContainer.mockClear();
    state.currentTab = 87;
    state.tabs[87] = {
      snapshots: [{}],
      status: {
        contentScriptLaunched: true,
        reactDevToolsInstalled: true,
        targetPageisaReactApp: true,
      },
      viewIndex: -1,
      sliderIndex: 0,
      mode: {},
    };
  });
  test('With snapshots, ErrorContainer should not render', () => {
    expect(mockErrorContainer).toBeCalledTimes(0);
  });
  test('With snapshots, ActionContainer should not render', () => {
    expect(screen.getByText('mockActionContainer')).toBeInTheDocument();
  });
  test('With snapshots, StateContainer should render', () => {
    expect(screen.getByText('mockStateContainer')).toBeInTheDocument();
  });
  test('With snapshots, TravelContainer should render', () => {
    expect(screen.getByText('mockTravelContainer')).toBeInTheDocument();
  });
  test('With snapshots, ButtonsContainer should render', () => {
    expect(screen.getByText('mockButtonsContainer')).toBeInTheDocument();
  });
});
