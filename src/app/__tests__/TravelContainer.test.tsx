import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import TravelContainer from '../containers/TravelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../slices/mainSlice';
import { useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/theme';
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
    currentTitle: 'test string',
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

const renderWithTheme = (component) => {
  return rtlRender(
    <Provider store={customStore}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </Provider>,
  );
};

const mockSlider = jest.fn();
jest.mock('../components/MainSlider', () => (props) => {
  mockSlider(props);
  return <div>MockSlider</div>;
});

const mockDropDown = jest.fn();
jest.mock('../components/Dropdown', () => (props) => {
  mockDropDown(props);
  return <div>mockDropDown</div>;
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'), // Use the actual react-redux module except for the functions you want to mock
  useDispatch: jest.fn(), // set up a mock function for useDispatch
}));

describe('All elements appear in the TravelContainer module', () => {
  beforeEach(() => {
    renderWithTheme(<TravelContainer snapshotsLength={0} />);
  });

  test('first button contains text Play', () => {
    let buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Play');
  });

  test('MainSlider exists in document', () => {
    expect(screen.getByText('MockSlider')).toBeInTheDocument();
  });

  test('Dropdown exists in document', () => {
    expect(screen.getByText('mockDropDown')).toBeInTheDocument();
  });

  test('Backward button exists in document', () => {
    // Use the getByLabelText query to find the button by its label
    const backwardButton = screen.getByLabelText('Backward');
    expect(backwardButton).toBeInTheDocument();
  });

  test('Forward button exists in document', () => {
    const forwardButton = screen.getByLabelText('Forward');
    expect(forwardButton).toBeInTheDocument();
  });
});

describe('Testing play/pause button', () => {
  const useDispatchMock = useDispatch as jest.Mock; //getting a reference to the mock function you setup during jest.mock configuration on line 154
  const dummyDispatch = jest.fn();
  useDispatchMock.mockReturnValue(dummyDispatch);
  beforeEach(() => {
    renderWithTheme(<TravelContainer snapshotsLength={0} />);
    dummyDispatch.mockClear();
  });

  test('Play button is rendered', () => {
    const playButton = screen.getByTestId('play-button-test');
    expect(playButton).toBeInTheDocument();
  });

  test('Play initially says Play', () => {
    const playButton = screen.getByTestId('play-button-test');
    expect(playButton.textContent).toBe('Play');
  });

  test('Clicking Play button will trigger dispatch', () => {
    const playButton = screen.getByTestId('play-button-test');
    expect(playButton.textContent).toBe('Play');
    fireEvent.click(playButton);
    expect(dummyDispatch).toHaveBeenCalledTimes(1);
  });

  test('Clicking Pause button will trigger dispatch', () => {
    customInitialState.main.tabs[87].playing = true;
    const playButton = screen.getByTestId('play-button-test');
    fireEvent.click(playButton);
    expect(dummyDispatch).toHaveBeenCalledTimes(1);
  });
});
