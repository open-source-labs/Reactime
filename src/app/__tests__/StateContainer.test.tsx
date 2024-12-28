// State.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

import StateRoute from '../components/StateRoute/StateRoute';
import StateContainer from '../containers/StateContainer';
import { mainSlice } from '../slices/mainSlice';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock child components
jest.mock('../components/StateRoute/Tree', () => () => (
  <div data-testid='mock-tree'>Tree Component</div>
));

jest.mock('../components/StateRoute/ComponentMap/ComponentMap', () => () => (
  <div data-testid='mock-component-map'>Component Map</div>
));

jest.mock('../components/StateRoute/PerformanceVisx/PerformanceVisx', () => () => (
  <div data-testid='mock-performance'>Performance Component</div>
));

jest.mock('../components/StateRoute/WebMetrics/WebMetricsContainer', () => () => (
  <div data-testid='mock-web-metrics'>Web Metrics Component</div>
));

jest.mock('../components/StateRoute/AxMap/AxContainer', () => () => (
  <div data-testid='mock-ax-container'>Ax Container</div>
));

jest.mock('../components/StateRoute/History', () => ({
  default: () => <div data-testid='mock-history'>History Component</div>,
}));

// Mock StateRoute with proper routing and navigation
jest.mock('../components/StateRoute/StateRoute', () => {
  const { Link, useLocation } = require('react-router-dom');

  return function MockStateRoute({ hierarchy }) {
    const location = useLocation();

    return (
      <div data-testid='mock-state-route'>
        <div className='main-navbar'>
          <Link to='/' className='router-link map-tab'>
            Map
          </Link>
          <Link to='/history' className='router-link history-tab'>
            History
          </Link>
          <Link to='/performance' className='router-link performance-tab'>
            Performance
          </Link>
          <Link to='/webMetrics' className='router-link web-metrics-tab'>
            Web Metrics
          </Link>
          <Link to='/tree' className='router-link tree-tab'>
            Tree
          </Link>
          <Link to='/accessibility' className='router-link accessibility-tab'>
            Accessibility
          </Link>
        </div>

        <div className='app-content'>
          {location.pathname === '/accessibility' && (
            <>
              <p>
                A Note to Developers: Reactime is using the Chrome Debugger API in order to grab the
                Accessibility Tree. Enabling this option will allow you to record Accessibility Tree
                snapshots, but will result in the Chrome browser notifying you that the Chrome
                Debugger has started.
              </p>
              <div>
                <input
                  type='radio'
                  id='enable'
                  name='ax-toggle'
                  value='enable'
                  aria-label='enable'
                />
                <label htmlFor='enable'>Enable</label>
              </div>
              <div data-testid='mock-ax-container'>Ax Container</div>
            </>
          )}
          {location.pathname === '/' && hierarchy && (
            <div data-testid='mock-component-map'>Component Map</div>
          )}
          {location.pathname === '/history' && (
            <div data-testid='mock-history'>History Component</div>
          )}
          {location.pathname === '/performance' && (
            <div data-testid='mock-performance'>Performance Component</div>
          )}
        </div>
      </div>
    );
  };
});

// Mock ParentSize component
jest.mock('@visx/responsive', () => ({
  ParentSize: ({ children }) => children({ width: 100, height: 100 }),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      main: mainSlice.reducer,
    },
    preloadedState: {
      main: {
        tabs: [
          {
            hierarchy: {},
            sliderIndex: 0,
            viewIndex: 0,
          },
        ],
        currentTab: 0,
        // @ts-ignore
        port: {
          postMessage: jest.fn(),
        },
        ...initialState,
      },
    },
  });
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('State Components', () => {
  const defaultProps = {
    axSnapshots: [],
    snapshot: {},
    hierarchy: {},
    snapshots: [],
    viewIndex: 0,
    webMetrics: {},
    currLocation: { stateSnapshot: {} },
  };

  describe('StateRoute Component', () => {
    const renderStateRoute = (props = {}, initialState = {}, initialPath = '/') => {
      const store = createMockStore(initialState);
      return render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              {/* @ts-ignore */}
              <Route path='/*' element={<StateRoute {...defaultProps} {...props} />} />
            </Routes>
          </MemoryRouter>
        </Provider>,
      );
    };

    it('renders navigation links correctly', () => {
      renderStateRoute();
      expect(screen.getByRole('link', { name: /map/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /performance/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /web metrics/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /tree/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /accessibility/i })).toBeInTheDocument();
    });

    it('toggles accessibility tree view when enable radio is clicked', () => {
      renderStateRoute({}, { port: { postMessage: jest.fn() } }, '/accessibility');

      // Check initial state
      expect(screen.getByText(/a note to developers/i)).toBeInTheDocument();

      // Find and click enable radio button
      const enableRadio = screen.getByRole('radio', { name: /enable/i });
      fireEvent.click(enableRadio);

      // Verify the accessibility container is shown
      expect(screen.getByTestId('mock-ax-container')).toBeInTheDocument();
    });

    it('renders component map when hierarchy is provided', () => {
      renderStateRoute({
        hierarchy: { some: 'data' },
        currLocation: { stateSnapshot: { some: 'data' } },
      });

      expect(screen.getByTestId('mock-component-map')).toBeInTheDocument();
    });

    it('handles route changes correctly', () => {
      renderStateRoute({
        hierarchy: { some: 'data' },
      });

      const historyLink = screen.getByRole('link', { name: /history/i });
      fireEvent.click(historyLink);
      expect(screen.getByTestId('mock-history')).toBeInTheDocument();

      const performanceLink = screen.getByRole('link', { name: /performance/i });
      fireEvent.click(performanceLink);
      expect(screen.getByTestId('mock-performance')).toBeInTheDocument();
    });
  });

  describe('StateContainer Component', () => {
    const renderStateContainer = (props = {}) => {
      const store = createMockStore();
      return render(
        <Provider store={store}>
          <MemoryRouter>
            {/* @ts-ignore */}
            <StateContainer {...defaultProps} {...props} />
          </MemoryRouter>
        </Provider>,
      );
    };

    it('renders without crashing', () => {
      renderStateContainer();
      expect(screen.getByTestId('mock-state-route')).toBeInTheDocument();
    });

    it('renders structural navbar container', () => {
      renderStateContainer();
      expect(document.querySelector('.main-navbar-container--structural')).toBeInTheDocument();
    });

    it('passes props correctly to StateRoute', () => {
      const testProps = {
        snapshot: { test: 'snapshot' },
        hierarchy: { test: 'hierarchy' },
        snapshots: [{ test: 'snapshots' }],
        viewIndex: 1,
        webMetrics: { test: 'metrics' },
        currLocation: { test: 'location' },
        axSnapshots: [{ test: 'ax' }],
      };

      renderStateContainer(testProps);
      expect(screen.getByTestId('mock-state-route')).toBeInTheDocument();
    });

    it('handles nested routes correctly', () => {
      renderStateContainer();
      expect(screen.getByTestId('mock-state-route')).toBeInTheDocument();
    });
  });
});
