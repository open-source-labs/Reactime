import React from 'react';
import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
// import NewHiContainer from '../containers/NewHiContainer'
import MainContainer from '../containers/MainContainer';

// test('Main Container should render', () => {
//   render(<MainContainer />);
//   screen.debug();
//   });

const Header = (): JSX.Element => {
  return <h1 className='title'>I am a header</h1>;
};

test('Test should run, header renders and it has correct stuff', () => {
  render(<Header />);
  // Extract header
  screen.debug();
  // allows the DOM to be rendered

  const header = screen.getByRole('heading');
  // Use jest-dom assertions
  expect(header).toBeInTheDocument();
  expect(header).toHaveTextContent('I am a header');
  expect(header).toHaveClass('title');
});

export default Header;
