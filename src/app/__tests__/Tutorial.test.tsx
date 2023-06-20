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
  test('Tutorial button exists', () => {
    render(<Tutorial {...props} />);
    expect(screen.getByText('Tutorial')).toBeInTheDocument();
  });

  test('User clicking tutorial button while on map tab starts map tutorial ', () => {
    props.currentTabInApp = 'map';
    render(<Tutorial {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(
      screen.getByText('A performance and state management tool for React apps.'),
    ).toBeInTheDocument();
  });

  test('User clicking tutorial button while on performance tab starts performance tutorial ', () => {
    props.currentTabInApp = 'performance';
    render(<Tutorial {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Performance Tab')).toBeInTheDocument();
  });

  test('User clicking tutorial button while on history tab starts history tutorial ', () => {
    props.currentTabInApp = 'history';
    render(<Tutorial {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('History Tab')).toBeInTheDocument();
  });

  test('User clicking tutorial button while on web metrics tab starts web metrics tutorial ', () => {
    props.currentTabInApp = 'webmetrics';
    render(<Tutorial {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Webmetrics Tab')).toBeInTheDocument();
  });

  test('User clicking tutorial button while on tree tab starts tree tutorial ', () => {
    props.currentTabInApp = 'tree';
    render(<Tutorial {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Tree Tab')).toBeInTheDocument();
  });
});
