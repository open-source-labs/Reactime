import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import TravelContainer from '../containers/TravelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../slices/mainSlice';
import { useDispatch } from 'react-redux';
import '@testing-library/jest-dom'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)

const customTabs = {
  87: {
    snapshots: [0, 1, 2, 3],
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
    sliderIndex: 3, //updated to 3
    viewIndex: -1,
    playing: false,
  },
};

const customInitialState = {
  main: {
    port: null,
    currentTab: 87, // Update with your desired value
    currentTitle: null,
    tabs: customTabs, // Replace with the actual (testing) tab data
    currentTabInApp: null,
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

const render = (component) => {
  return rtlRender(<Provider store={customStore}>{component}</Provider>);
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'), // Use the actual react-redux module except for the functions you want to mock
  useDispatch: jest.fn(), // set up a mock function for useDispatch
}));

//needed to isolate the testing of the forward and backward buttons as behavior was affected when within the travelContainer file

describe('Testing backward and forward button', () => {
  const useDispatchMock = useDispatch as jest.Mock; //getting a reference to the mock function you setup during jest.mock configuration on line 154
  const dummyDispatch = jest.fn();
  useDispatchMock.mockReturnValue(dummyDispatch);
  beforeEach(() => {
    render(<TravelContainer snapshotsLength={0} />);
    dummyDispatch.mockClear();
  });

  test('Clicking < Button button will trigger button', () => {
    let buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(dummyDispatch).toHaveBeenCalledTimes(1);
  });

  test('Clicking > Button button will trigger button', () => {
    let buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(dummyDispatch).toHaveBeenCalledTimes(1);
  });
});
