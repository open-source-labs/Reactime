import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WebMetrics from '../components/WebMetrics';
// import { useStoreContext } from '../store';
import { useDispatch, Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../RTKslices'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'), // Use the actual react-redux module except for the functions you want to mock
  useDispatch: jest.fn(), // set up a mock function for useDispatch
}));
const useDispatchMock = useDispatch as jest.Mock; //getting a reference to the mock function you setup during jest.mock configuration on line 18
const dummyDispatch = jest.fn(); //separate mock function created because we need to explicitly define on line 30 what 
useDispatchMock.mockReturnValue(dummyDispatch);//exactly useDispatchMock returns (which is a jest.fn())
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
}

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
middleware: (getDefaultMiddleware) =>
getDefaultMiddleware({ serializableCheck: false }),
});

const render = component => rtlRender(
<Provider store={customStore}>
{component}
</Provider>
);
jest.mock('react-apexcharts', () => ({ __esModule: true, default: () => <div /> }));
// const dispatch = jest.fn();
// jest.spyOn(React, 'useEffect').mockImplementation(() => jest.fn());
// jest.mock('../store');
// const mockedStoreContext = jest.mocked(useStoreContext);
// mockedStoreContext.mockImplementation(() => [, dummyDispatch]);

describe('WebMetrics graph testing', () => {
  test('should have 1 div with class name "metric" ', () => {
    const { container } = render(<WebMetrics />);
    expect(container.getElementsByClassName('metric').length).toBe(1);
  });
});
