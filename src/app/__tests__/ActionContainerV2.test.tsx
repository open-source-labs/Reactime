import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionContainer from '../containers/ActionContainer';
import TravelContainer from '../containers/TravelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { store } from '../RTKstore';
import { mainSlice } from '../RTKslices'

//Note for testing:
//typically, jest.mock is commonly used in unit testing to isolate the code under test. 
//In contrast, when performing integration testing of components with a real Redux store, 
//you typically don't need to use jest.mock because you're interested in testing how the real components interact with the actual store. 
//The decision to use jest.mock depends on the type of testing (unit or integration) and your specific testing goals.

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

//need to add this mockFunction for setActionView
//because in actual actioncontainer componenent, it is prop drilled down from maincontainer
//here we set it as a jest.fn() 
//then we pass it into our actionContainer on render
const setActionViewMock = jest.fn();

describe('Integration testing for ActionContainer.tsx', () => {
    test('renders the ActionContainer component', () => {
        //tests that the clearButton is rendered by testing if we can get "Clear"
        //need to set actionView to true to correctly render clearbutton
        render(<ActionContainer setActionView={setActionViewMock} actionView={true}/>);
        const clearButton = screen.getByText('Clear'); // Use an existing element
        expect(setActionViewMock).toHaveBeenCalledWith(true);
        expect(clearButton).toBeInTheDocument();
      });
});



