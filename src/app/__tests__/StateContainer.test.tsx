// State.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
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

// Setup global ResizeObserver mock
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

// Mock ParentSize component
jest.mock('@visx/responsive', () => ({
  ParentSize: ({ children }) => children({ width: 100, height: 100 }),
}));

// Create mock store factory with proper initial state
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      // @ts-ignore
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
        ...initialState,
      },
    },
  });
};

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
    const renderStateRoute = (props = {}, initialState = {}) => {
      const store = createMockStore(initialState);
      return render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            {/* @ts-ignore */}
            <StateRoute {...defaultProps} {...props} />
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
      renderStateRoute();

      // Navigate to accessibility route
      const accessibilityLink = screen.getByRole('link', { name: /accessibility/i });
      fireEvent.click(accessibilityLink);

      // Check initial state
      expect(screen.getByText(/a note to developers/i)).toBeInTheDocument();

      // Find and click enable radio button
      const enableRadio = screen.getByRole('radio', { name: /enable/i });
      fireEvent.click(enableRadio);

      // Verify the accessibility container is shown
      expect(screen.queryByText(/a note to developers/i)).not.toBeInTheDocument();
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
