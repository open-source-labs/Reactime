/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionContainer from '../containers/ActionContainer';
import { useStoreContext } from '../store';
import TravelContainer from '../containers/TravelContainer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../RTKstore';
//so far i have imported provider, usedispatch, useselector, and store 
//wrapped components in provider

// const render = component => rtlRender(
//   <Provider store={store}>
//     {component}
//   </Provider>
// )


const state = {
  tabs: {
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
  },
  currentTab: 87,
};
//creates jest mock function to simulate behavior of functions/methods
const dispatch = jest.fn();

//TESTING OUR CODE HERRE




//ORGINAL CODE HERE

jest.spyOn(React, 'useEffect').mockImplementation(() => jest.fn());
jest.mock('../store');

//jest.spyOn(React, 'useEffect').mockImplementation(() => jest.fn());: 
//This line spies on the useEffect function from React, replacing it with a mocked implementation that returns an empty Jest mock function, 
//effectively disabling its actual side effects during testing.

//jest.mock('../store');: 
//This line mocks the import of a module located at '../store', which can be useful to isolate components from real Redux store behavior 
//and provide custom mock behavior for testing purposes.


const mockeduseStoreContext = jest.mocked(useStoreContext);
mockeduseStoreContext.mockImplementation(() => [state, dispatch]);
// jest.mocked(useStoreContext): This part of the code uses Jest's jest.mocked function to create a mocked version of the useStoreContext function. The jest.mocked function is used to mock functions and methods. It creates a mock that can be configured with custom behavior.

// mockeduseStoreContext.mockImplementation(() => [state, dispatch]): After creating the mock, this line configures the mock to implement a specific behavior. In this case, it specifies that when useStoreContext is called, it should return an array containing two values: state and dispatch.


////////////////////////////////////////////////////////////////////////////////////
const MockRouteDescription = jest.fn();
jest.mock('../components/RouteDescription', () => () => {
  MockRouteDescription();
  return <div>MockRouteDescription</div>;
});

const MockSwitchApp = jest.fn();
jest.mock('../components/SwitchApp', () => () => {
  MockSwitchApp();
  return <div>MockSwitchApp</div>;
});

describe('unit testing for ActionContainer', () => {
  beforeEach(() => {
    mockeduseStoreContext.mockClear();
    dispatch.mockClear();
    render(
      <ActionContainer actionView={true} />
    )
  });

  test('Expect top arrow to be rendered', () => {
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

//   test('Expect RouteDescription to be rendered', () => {
//     expect(screen.getAllByText('MockRouteDescription')).toHaveLength(2);
//   });

//   test('Expect SwitchApp to be rendered', () => {
//     expect(screen.getByText('MockSwitchApp')).toBeInTheDocument();
//   });

//   test('Click works on clear button', () => {
//     fireEvent.click(screen.getAllByRole('button')[0]);
//     expect(dispatch).toHaveBeenCalledTimes(1);
//   });
// });

// describe('integration testing for ActionContainer', () => {
//   beforeEach(() => {
//     mockeduseStoreContext.mockClear();
//     dispatch.mockClear();
//     render(
//       <ActionContainer actionView={true} />
//     )
//     render(
//       <TravelContainer snapshotsLength={0} />
//     )
//   });

//   test('Slider resets on clear button', () => {
//     fireEvent.click(screen.getAllByRole('button')[0]);
//     expect(screen.getByRole('slider')).toHaveStyle('left: 0');
//   });
});