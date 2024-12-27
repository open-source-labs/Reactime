import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import MainContainer from '../containers/MainContainer';
import { mainSlice } from '../slices/mainSlice';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock components that use visx/tooltips
jest.mock('../components/StateRoute/ComponentMap/ComponentMap', () => {
  return function MockComponentMap() {
    return <div data-testid='mock-component-map' />;
  };
});

jest.mock('../containers/ActionContainer', () => {
  return function MockActionContainer({ snapshots, currLocation }) {
    return <div data-testid='mock-action-container' />;
  };
});

jest.mock('../components/StateRoute/StateRoute', () => {
  return function MockStateRoute() {
    return <div data-testid='mock-state-route' />;
  };
});

// Mock chrome API
const mockChrome = {
  runtime: {
    connect: jest.fn(() => ({
      onMessage: {
        addListener: jest.fn(),
        hasListener: jest.fn(() => false),
        removeListener: jest.fn(),
      },
      postMessage: jest.fn(),
    })),
    onMessage: {
      addListener: jest.fn(),
      hasListener: jest.fn(() => false),
      removeListener: jest.fn(),
    },
  },
};

global.chrome = mockChrome as any;

// Mock proper state hierarchy structure
const mockStateTree = {
  index: 0,
  stateSnapshot: {
    name: 'Root',
    children: [
      {
        name: 'TestComponent',
        state: { testData: 'value' },
        componentData: {
          props: {},
          state: null,
        },
        children: [],
      },
    ],
    route: {
      url: '/test',
    },
  },
  children: [],
};

const mockSnapshots = [
  {
    index: 0,
    stateSnapshot: {
      name: 'Root',
      children: [
        {
          name: 'TestComponent',
          state: { testData: 'value' },
          componentData: {},
          children: [],
        },
      ],
      route: {
        url: '/test',
      },
    },
  },
];

// Create a mock store with complete structure
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      // @ts-ignore
      main: mainSlice.reducer,
    },
    preloadedState: {
      main: {
        currentTab: 1,
        port: null,
        connectionStatus: true,
        currentTitle: 'Test Tab',
        tabs: {
          1: {
            status: {
              reactDevToolsInstalled: true,
              targetPageisaReactApp: true,
            },
            axSnapshots: [],
            currLocation: {
              index: 0,
              stateSnapshot: mockStateTree.stateSnapshot,
            },
            viewIndex: -1,
            sliderIndex: 0,
            snapshots: mockSnapshots,
            hierarchy: mockStateTree,
            webMetrics: {},
            mode: {
              paused: false,
            },
            snapshotDisplay: mockSnapshots,
            playing: false,
            intervalId: null,
          },
        },
        ...initialState,
      },
    },
  });
};

// Helper function to render with store and router
const renderWithProvider = (ui: JSX.Element, store = createMockStore()) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>{ui}</Provider>
    </MemoryRouter>,
  );
};

describe('MainContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = renderWithProvider(<MainContainer />);
    expect(container.querySelector('.main-container')).toBeInTheDocument();
  });

  it('establishes connection with chrome runtime on mount', () => {
    renderWithProvider(<MainContainer />);
    expect(chrome.runtime.connect).toHaveBeenCalledWith({ name: 'panel' });
  });

  it('renders ErrorContainer when React DevTools are not installed', () => {
    const store = createMockStore({
      tabs: {
        1: {
          status: {
            reactDevToolsInstalled: false,
            targetPageisaReactApp: true,
          },
        },
      },
    });

    renderWithProvider(<MainContainer />, store);
    expect(screen.getByText(/Welcome to Reactime/i)).toBeInTheDocument();
  });

  it('renders ErrorContainer when page is not a React app', () => {
    const store = createMockStore({
      tabs: {
        1: {
          status: {
            reactDevToolsInstalled: true,
            targetPageisaReactApp: false,
          },
        },
      },
    });

    renderWithProvider(<MainContainer />, store);
    expect(screen.getByText(/Welcome to Reactime/i)).toBeInTheDocument();
  });

  it('renders main content when all conditions are met', () => {
    const { container } = renderWithProvider(<MainContainer />);
    expect(container.querySelector('.main-container')).toBeInTheDocument();
    expect(container.querySelector('.bottom-controls')).toBeInTheDocument();
  });

  it('handles port disconnection', () => {
    const store = createMockStore();
    renderWithProvider(<MainContainer />, store);

    // Verify that onMessage.addListener was called
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();

    // Get the last registered listener
    const lastCall = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls.length - 1;
    const handleDisconnect = (chrome.runtime.onMessage.addListener as jest.Mock).mock.calls[
      lastCall
    ][0];

    // Call the disconnect handler directly
    handleDisconnect('portDisconnect');

    // Check if store was updated correctly
    expect(store.getState().main.connectionStatus).toBeFalsy();
  });
});
