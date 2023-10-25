import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Dropdown from '../components/Dropdown';
import '@testing-library/jest-dom/extend-expect';

describe('Dropdown component test', () => {
  const speeds = [
    { value: 1, label: 'test1' },
    { value: 2, label: 'test2' },
    { value: 3, label: 'test3' },
  ];
  const setSpeed = jest.fn();

  test('renders Dropdown initial selection', () => {
    const currSpeed = speeds[0];
    const renderResult = render(
      <Dropdown speeds={speeds} setSpeed={setSpeed} selectedSpeed={currSpeed} />,
    );

    // Check if the initial selected speed is rendered
    expect(renderResult.getByText('test1')).toBeInTheDocument();
  });

  test('handles dropdown interaction and option selection', () => {
    const renderResult = render(
      <Dropdown speeds={speeds} setSpeed={setSpeed} selectedSpeed={speeds[0]} />,
    );

    // Find the dropdown trigger element
    const dropdownTrigger = renderResult.getByText('test1');

    // Simulate opening the dropdown
    fireEvent.mouseDown(dropdownTrigger);

    // Simulate selecting an option
    fireEvent.click(renderResult.getByText('test2'));

    // Ensure that setSpeed was called
    expect(setSpeed).toHaveBeenCalled();
  });
});
