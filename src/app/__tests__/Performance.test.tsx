import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import BarGraph from '../components/StateRoute/PerformanceVisx/BarGraph';
import PerformanceVisx from '../components/StateRoute/PerformanceVisx/PerformanceVisx';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock VisxTooltip Portal
jest.mock('@visx/tooltip', () => ({
  ...jest.requireActual('@visx/tooltip'),
  useTooltipInPortal: () => ({
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: null,
    TooltipInPortal: ({ children }) => children,
    containerRef: { current: null },
  }),
}));

// Mock window.ResizeObserver
window.ResizeObserver = ResizeObserver;

// Mock createPortal since JSDOM doesn't support it
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

// Mock SVG elements that JSDOM doesn't support
const createElementNSOrig = global.document.createElementNS;
global.document.createElementNS = function (namespaceURI, qualifiedName) {
  if (namespaceURI === 'http://www.w3.org/2000/svg' && qualifiedName === 'svg') {
    const element = createElementNSOrig.apply(this, arguments);
    element.createSVGRect = function () {};
    return element;
  }
  return createElementNSOrig.apply(this, arguments);
};

// Mock getComputedStyle for SVG elements
window.getComputedStyle = (element) => {
  // Create an object with string index signatures
  const cssProperties = Array.from({ length: 1000 }).reduce<{ [key: string]: string }>(
    (acc, _, index) => {
      acc[index.toString()] = '';
      return acc;
    },
    {},
  );

  const cssStyleDeclaration: CSSStyleDeclaration = {
    getPropertyValue: (prop: string) => '',
    item: (index: number) => '',
    removeProperty: (property: string) => '',
    setProperty: (property: string, value: string) => {},
    parentRule: null,
    length: 0,
    [Symbol.iterator]: function* () {},
    ...cssProperties,
  } as CSSStyleDeclaration;

  return cssStyleDeclaration;
};

// Suppress specific console warnings
const originalError = console.error;
console.error = (...args) => {
  if (args[0].includes('Warning: ReactDOM.render is no longer supported')) {
    return;
  }
  originalError.call(console, ...args);
};

const mockStore = configureStore([]);

// Test fixtures
const mockBarGraphProps = {
  width: 800,
  height: 600,
  data: {
    barStack: [
      {
        snapshotId: 'snapshot1',
        'Component-1': 100,
        'Component-2': 150,
      },
      {
        snapshotId: 'snapshot2',
        'Component-1': 120,
        'Component-2': 140,
      },
    ],
    componentData: {
      'Component-1': {
        stateType: 'stateless',
        renderFrequency: 2,
        totalRenderTime: 220,
        rtid: 'rt1',
        information: {},
      },
      'Component-2': {
        stateType: 'stateful',
        renderFrequency: 2,
        totalRenderTime: 290,
        rtid: 'rt2',
        information: {},
      },
    },
    maxTotalRender: 290,
  },
  comparison: [],
  setRoute: jest.fn(),
  allRoutes: ['/home', '/about'],
  filteredSnapshots: [],
  setSnapshot: jest.fn(),
  snapshot: 'All Snapshots',
};

const mockPerformanceVisxProps = {
  width: 800,
  height: 600,
  snapshots: [
    {
      name: 'Root',
      branch: '1',
      route: { url: 'http://localhost:3000/home' },
      children: [
        {
          name: 'Component1',
          componentData: {
            actualDuration: '100.5',
            props: { test: 'prop' },
          },
          children: [],
          rtid: 'rt1',
          state: 'stateless',
        },
      ],
    },
  ],
  hierarchy: {
    name: 'Root',
    branch: '1',
    children: [],
  },
};

const mockReduxState = {
  main: {
    tabs: {
      0: { title: 'Test Tab' },
    },
    currentTab: 0,
    currentTabInApp: 'performance',
  },
};

describe('Performance Components', () => {
  let store;

  beforeEach(() => {
    store = mockStore(mockReduxState);
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
  });

  describe('BarGraph Component', () => {
    const renderBarGraph = () => {
      return render(
        <Provider store={store}>
          {/* @ts-ignore */}
          <BarGraph {...mockBarGraphProps} />
        </Provider>,
      );
    };

    it('renders without crashing', () => {
      const { container } = renderBarGraph();
      expect(screen.getByText('Route:')).toBeInTheDocument();
      expect(screen.getByText('Snapshot:')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('displays correct axis labels', () => {
      renderBarGraph();
      expect(screen.getByText('Rendering Time (ms)')).toBeInTheDocument();
      expect(screen.getByText('Snapshot ID')).toBeInTheDocument();
    });

    it('handles route selection', () => {
      renderBarGraph();
      const routeSelect = screen.getByLabelText('Route:');
      fireEvent.change(routeSelect, { target: { value: '/home' } });
      expect(mockBarGraphProps.setRoute).toHaveBeenCalledWith('/home');
    });

    it('handles snapshot selection', () => {
      renderBarGraph();
      const snapshotSelect = screen.getByLabelText('Snapshot:');
      fireEvent.change(snapshotSelect, { target: { value: 'snapshot1' } });
      expect(mockBarGraphProps.setSnapshot).toHaveBeenCalledWith('snapshot1');
    });

    it('renders correct number of bars', () => {
      const { container } = renderBarGraph();
      const bars = container.querySelectorAll('rect[width]');
      // Each snapshot has 2 components, so we expect 4 bars total
      expect(bars.length).toBe(5);
    });
  });

  describe('PerformanceVisx Component', () => {
    const renderPerformanceVisx = () => {
      return render(
        <Provider store={store}>
          <MemoryRouter>
            <PerformanceVisx {...mockPerformanceVisxProps} />
          </MemoryRouter>
        </Provider>,
      );
    };

    it('renders without crashing', () => {
      const { container } = renderPerformanceVisx();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('dispatches setCurrentTabInApp on mount', () => {
      renderPerformanceVisx();
      const actions = store.getActions();
      expect(actions).toEqual([{ type: 'main/setCurrentTabInApp', payload: 'performance' }]);
    });

    it('processes route data correctly', () => {
      renderPerformanceVisx();
      expect(screen.getByText('/home')).toBeInTheDocument();
    });
  });
});
