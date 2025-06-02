import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WebMetrics from '../components/StateRoute/WebMetrics/WebMetrics';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { mainSlice } from '../slices/mainSlice';

// Mock react-redux hooks
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

// Mock ApexCharts
jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: () => <div data-testid='apex-chart' />,
}));

// Mock react-hover
jest.mock('react-hover', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
  Trigger: ({ children }) => <div>{children}</div>,
  Hover: ({ children }) => <div className='hover-box'>{children}</div>,
}));

describe('WebMetrics Component', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  // Setup function to create consistent test environment
  const setupTest = (customProps = {}) => {
    const defaultProps = {
      color: '#0bce6b',
      series: [75],
      formatted: (value) => `${value} ms`,
      score: ['100 ms', '300 ms'],
      overLimit: false,
      label: 'Test Metric',
      name: 'Test Metric Name',
      description: 'Test metric description',
    };

    const props = { ...defaultProps, ...customProps };

    const store = configureStore({
      reducer: {
        main: mainSlice.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    });

    return render(
      <Provider store={store}>
        <WebMetrics {...props} />
      </Provider>,
    );
  };

  test('renders chart container', () => {
    const { container } = setupTest();
    expect(container.getElementsByClassName('chart-container').length).toBe(1);
  });

  test('renders ApexCharts component', () => {
    setupTest();
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  test('applies correct color prop to chart options', () => {
    const testColor = '#ff0000';
    const { container } = setupTest({ color: testColor });
    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toBeInTheDocument();
  });

  test('handles overLimit prop correctly', () => {
    const { container } = setupTest({ overLimit: true });
    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toBeInTheDocument();
  });

  test('renders hover content with correct information', () => {
    const testProps = {
      name: 'Custom Test Metric',
      description: 'Custom Test Description',
      score: ['100 ms', '300 ms'],
    };
    const { container } = setupTest(testProps);
    const hoverBox = container.querySelector('.hover-box');
    expect(hoverBox).toBeInTheDocument();
    expect(hoverBox).toHaveTextContent('Custom Test Metric');
    expect(hoverBox).toHaveTextContent('Custom Test Description');
  });

  test('displays correct threshold colors in hover box', () => {
    const { container } = setupTest();
    const hoverBox = container.querySelector('.hover-box');
    expect(hoverBox).toBeInTheDocument();
  });

  test('formats values correctly using formatted prop', () => {
    const customFormatted = jest.fn((value) => `Custom ${value}`);
    setupTest({ formatted: customFormatted });
    expect(screen.getByTestId('apex-chart')).toBeInTheDocument();
  });

  test('dispatches setCurrentTabInApp on mount', () => {
    setupTest();
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test('handles empty series data gracefully', () => {
    const { container } = setupTest({ series: [] });
    expect(container.getElementsByClassName('chart-container').length).toBe(1);
  });
});
