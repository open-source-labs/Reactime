import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dropdown from '../components/Dropdown';

describe('Dropdown test', () => {
  const speeds = [
    { value: 1, label: 'test1' },
    { value: 2, label: 'test2' },
    { value: 3, label: 'test3' },
  ];
  const setSpeed = jest.fn();

  test('renders Dropdown with correct info', () => {
    const currSpeed = speeds[0];
    const { container } = render(
      <Dropdown speeds={speeds} setSpeed={setSpeed} selectedSpeed={currSpeed} />,
    );
    expect(container.querySelector('.react-select__single-value')).toHaveTextContent('test1');
  });
});
