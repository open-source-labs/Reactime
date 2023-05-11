import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RouteDescription from '../components/RouteDescription';

type RouteProps = {
  actions: JSX.Element[];
};

// currently, can't test the url. not sure why.
render(<RouteDescription actions={[]} />);
screen.debug();

describe('Unit Testing for RouteDescription.tsx', () => {
  // test actions, passing url into JSX component. currently cannot.
  // TypeError: Invalid URL: testUrlString
  // const url = new URL('testUrlString');
  const actions = [<p>hello action</p>];

  test('Test that RouteDescription renders', () => {
    const url = { pathname: 'testURL' };
    const { container } = render(<RouteDescription actions={actions} />);
    expect(container).toBeInTheDocument();
  });
});
