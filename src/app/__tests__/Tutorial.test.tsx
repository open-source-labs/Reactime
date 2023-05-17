import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
import '@testing-library/jest-dom/extend-expect';
import Tutorial from '../components/Tutorial';
// const { Steps } = require('intro.js-react');

const dispatch = jest.fn();
const props = {
  currentTabInApp: 'map',
  dispatch,
};

let currentStepIndex = 5;

describe('Before Tutorial is entered', () => {
  test('How to use button exists', () => {
    render(<Tutorial {...props} />);
    expect(screen.getByText('Tutorial')).toBeInTheDocument();
  });

  test('User clicking "How to use" while on map tab button starts map tutorial ', () => {
    props.currentTabInApp = 'map';

    render(<Tutorial {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(
      screen.getByText('A performance and state managment tool for React apps.'),
    ).toBeInTheDocument();
  });

  test('User clicking "How to use" while on performance tab button starts performance tutorial ', () => {
    props.currentTabInApp = 'performance';
    render(<Tutorial {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Performance Tab')).toBeInTheDocument();
  });

  test('User clicking "How to use" while on performance comparison tab, no tutorial available ', () => {
    props.currentTabInApp = 'performance-comparison';
    currentStepIndex = 1;
    render(<Tutorial {...props} />);
    fireEvent.click(screen.getByRole('button'));
  });
});
