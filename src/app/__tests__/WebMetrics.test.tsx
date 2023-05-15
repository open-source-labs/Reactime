import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WebMetrics from '../components/WebMetrics';
import { useStoreContext } from '../store';

jest.mock('react-apexcharts', () => ({ __esModule: true, default: () => <div /> }));
const dispatch = jest.fn();
// jest.spyOn(React, 'useEffect').mockImplementation(() => jest.fn());
jest.mock('../store');
const mockedStoreContext = jest.mocked(useStoreContext);
mockedStoreContext.mockImplementation(() => [, dispatch]);

describe('WebMetrics graph testing', () => {
  test('should have 1 div with class name "metric" ', () => {
    const { container } = render(<WebMetrics />);
    expect(container.getElementsByClassName('metric').length).toBe(1);
  });
});
