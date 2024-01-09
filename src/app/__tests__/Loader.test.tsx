import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import Loader from '../components/ErrorHandling/Loader';

describe('unit testing for Loader.tsx', () => {
  test('renders a loading icon', () => {
    const { container } = render(<Loader loading={true} result={false} />);
    console.log('this is our container.firstChild: ', container.firstChild);
    expect(container.firstChild).toHaveClass('docs-story css-kdwx3d');
  });

  test('renders a fail icon', () => {
    const { container } = render(<Loader loading={false} result={false} />);
    console.log('this is a fail2: ', container.getElementsByClassName('fail')[0]);
    expect(container.getElementsByClassName('fail').length).toBe(1);
  });

  test('renders a check icon', () => {
    const { container } = render(<Loader loading={false} result={true} />);
    expect(container.getElementsByClassName('check').length).toBe(1);
  });
});
