import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import Loader from '../components/Loader';

describe('unit testing for Loader.tsx', () => {
  test('renders a loading icon', () => {
    const { container } = render(<Loader loading={true} result={false} />);
    expect(container.firstChild).toHaveClass('css-xp4o0b');
  });

  test('renders a fail icon', () => {
    // render(<Loader loading={false} result={false} />);
    const { container } = render(<Loader loading={false} result={false} />);
    expect(container.getElementsByClassName('fail').length).toBe(1);
  });

  test('renders a check icon', () => {
    // render(<Loader loading={false} result={true} />);
    const { container } = render(<Loader loading={false} result={true} />);
    expect(container.getElementsByClassName('check').length).toBe(1);
  });
});
