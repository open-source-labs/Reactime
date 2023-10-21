import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import ErrorContainer from '../containers/ErrorContainer';
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../slices/mainSlice'
import { Provider } from 'react-redux';

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
    currentTitle: 'No Target', //I updated this to 'No Target' to match the initialState in mainSlice.ts. It used to be null, but that doesn't make sense because if it doesn't get updated, we would render null instead of No Target
    tabs: customTabs, // Replace with the actual (testing) tab data
    currentTabInApp: 'null',
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

// const state = {
//   currentTab: null,
//   currentTitle: 'No Target',
//   tabs: {},
// };

const MockErrorMsg = jest.fn();
jest.mock('../components/ErrorMsg', () => () => {
  MockErrorMsg();
  return <div>MockErrorMsg</div>;
});

// jest.mock('../store');
// const mockeduseStoreContext = jest.mocked(useStoreContext);

// const dispatch = jest.fn();
// mockeduseStoreContext.mockImplementation(() => [state, dispatch]);

describe('unit testing for ErrorContainer.tsx', () => {
  test('logo image renders as expected', () => {
    render(<ErrorContainer />);
    expect(screen.getByAltText('Reactime Logo')).toBeInTheDocument();
  });

  test('ErrorMsg component renders as expected', () => {
    render(<ErrorContainer />);
    expect(screen.getByText('MockErrorMsg')).toBeInTheDocument();
  });

  test('Reactime website shows as expected', () => {
    render(<ErrorContainer />);
    expect(screen.getByText('Please visit the Reactime Github for more info.')).toBeInTheDocument();
  });

  describe('Loading Checks show up as expected', () => {
    test('Content script launching check shows', () => {
      render(<ErrorContainer />);
      expect(
        screen.getByText(`Checking if content script has been launched on current tab`),
      ).toBeInTheDocument();
    });
    test('React Dev Tool Install check shows', () => {
      render(<ErrorContainer />);
      expect(
        screen.getByText(`Checking if React Dev Tools has been installed`),
      ).toBeInTheDocument();
    });
    test('Compatible app check shows', () => {
      render(<ErrorContainer />);
      expect(screen.getByText(`Checking if target is a compatible React app`)).toBeInTheDocument();
    });
  });

  describe('Launching header shows correct tab info', () => {
    test('When currentTitle has no target', () => {
      render(<ErrorContainer />);
      expect(screen.getByText(`Launching Reactime on tab: No Target`)).toBeInTheDocument();
      expect(screen.queryByText(`Launching Reactime on tab: Test Page`)).not.toBeInTheDocument();
    });

    test('When currentTitle has a target title', () => {
      customInitialState.main.currentTitle = 'Test Page';
      render(<ErrorContainer />);
      expect(screen.getByText(`Launching Reactime on tab: Test Page`)).toBeInTheDocument();
      expect(screen.queryByText(`Launching Reactime on tab: No Target`)).not.toBeInTheDocument();
    });
  });
});
