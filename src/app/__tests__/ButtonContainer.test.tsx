import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
import ButtonsContainer from '../containers/ButtonsContainer';
import userEvent from '@testing-library/user-event';
import { toggleMode, mainSlice } from '../slices/mainSlice';
import { useDispatch, Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// const { Steps } = require('intro.js-react');
// jest.mock('../store');
// const mockedUsedStoreContext = jest.mocked(useStoreContext);
// useStoreContext as jest.Mock<useStoreContext>.mockImplementaton(() => [state, dispatch])

const customTabs = {
  87: {
    snapshots: [1, 2, 3, 4],
    hierarchy: {
      index: 0,
      name: 1,
      branch: 0,
      stateSnapshot: {
        state: {},
        children: [
          {
            state: { test: 'test' },
            name: 'App',
            componentData: { actualDuration: 3.5 },
          },
        ],
        route: {
          id: 1,
          url: 'http://localhost:8080/',
        },
      },
      children: [
        {
          index: 1,
          name: 2,
          branch: 0,
          stateSnapshot: {
            state: {},
            children: [
              {
                state: { test: 'test' },
                name: 'App',
                componentData: { actualDuration: 3.5 },
              },
            ],
            route: {
              id: 2,
              url: 'http://localhost:8080/',
            },
          },
          children: [
            {
              index: 2,
              name: 3,
              branch: 0,
              stateSnapshot: {
                state: {},
                children: [
                  {
                    state: { test: 'test' },
                    name: 'App',
                    componentData: { actualDuration: 3.5 },
                  },
                ],
                route: {
                  id: 3,
                  url: 'http://localhost:8080/',
                },
              },
              children: [
                {
                  index: 3,
                  name: 4,
                  branch: 0,
                  stateSnapshot: {
                    state: {},
                    children: [
                      {
                        state: { test: 'test' },
                        name: 'App',
                        componentData: { actualDuration: 3.5 },
                      },
                    ],
                    route: {
                      id: 4,
                      url: 'http://localhost:8080/test/',
                    },
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    currLocation: {
      index: 0,
      name: 1,
      branch: 0,
    },
    sliderIndex: 0,
    viewIndex: -1,
  },
};

const customInitialState = {
  main: {
    port: null,
    currentTab: 87, // Update with your desired value
    currentTitle: 'test string',
    tabs: customTabs, // Replace with the actual (testing) tab data
    currentTabInApp: 'test string',
    connectionStatus: false,
    connectRequested: true,
  },
};

const customStore = configureStore({
  reducer: {
    main: mainSlice.reducer,
  },
  preloadedState: customInitialState, // Provide custom initial state
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const render = (component) => rtlRender(<Provider store={customStore}>{component}</Provider>);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'), // Use the actual react-redux module except for the functions you want to mock
  useDispatch: jest.fn(), // set up a mock function for useDispatch
}));

//these are needed for the Clicking pause-button toggles locked/unlocked test, as the onClick triggers the exportHandler, which uses the .creatObjectURL and .revokeObjectURL methods, so we declare them as jest functions here
global.URL.createObjectURL = jest.fn(() => 'https://pdf.com');
global.URL.revokeObjectURL = jest.fn();

describe('Unit testing for ButtonContainer', () => {
  const useDispatchMock = (useDispatch as unknown) as jest.Mock; // make the test run
  // const useDispatchMock = useDispatch as jest.Mock; //getting a reference to the mock function you setup during jest.mock configuration on line 18
  const dummyDispatch = jest.fn(); //separate mock function created because we need to explicitly define on line 30 what
  useDispatchMock.mockReturnValue(dummyDispatch); //exactly useDispatchMock returns (which is a jest.fn())
  beforeEach;

  const currentTab = customInitialState.main.tabs[customInitialState.main.currentTab];

  // const dispatch = jest.fn();
  // const exportHandler = jest.fn().mockImplementation(() => 'clicked');
  // const importHandler = jest.fn();
  // const fileDownload = jest.fn();

  // mockedUsedStoreContext.mockImplementation(() => [state, dispatch]);
  // useStoreContext.mockImplementation(() => [state, dispatch]);

  beforeEach(() => {
    // dispatch.mockClear();
    // mockedUsedStoreContext.mockClear();
    currentTab.mode = {
      paused: true,
    };
  });

  describe('When button container is loaded', () => {
    test('it should have 5 buttons', () => {
      customInitialState.main.connectionStatus = true;
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')).toHaveLength(5);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Locked');
      expect(screen.getAllByRole('button')[1]).toHaveTextContent('Download');
      expect(screen.getAllByRole('button')[2]).toHaveTextContent('Upload');
      expect(screen.getAllByRole('button')[3]).toHaveTextContent('Tutorial');
      expect(screen.getAllByRole('button')[4]).toHaveTextContent('Reconnect');
    });
  });

  describe('When view is unlock', () => {
    test('Button should show as unlocked', () => {
      customInitialState.main.connectionStatus = true;
      currentTab.mode.paused = false;
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Unlocked');
    });
  });

  describe('When view is lock', () => {
    test('Button should show as locked', () => {
      customInitialState.main.connectionStatus = true;
      currentTab.mode.paused = true;
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Locked');
    });
  });

  describe('Clicking pause-button toggles locked/unlocked', () => {
    test('When button is unlocked and it is clicked', async () => {
      render(<ButtonsContainer />);
      const button = screen.getAllByRole('button')[0];
      await userEvent.click(button);
      expect(dummyDispatch).toHaveBeenCalledWith(toggleMode('paused'));
    });
  });

  describe('Upload/Download', () => {
    test('Clicking upload and download buttons', async () => {
      render(<ButtonsContainer />);
      fireEvent.click(screen.getAllByRole('button')[1]);
      fireEvent.click(screen.getAllByRole('button')[2]);
      expect(screen.getAllByRole('button')[1]).toBeInTheDocument();
      expect(screen.getAllByRole('button')[2]).toBeInTheDocument();
    });
  });
});
