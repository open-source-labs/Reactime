// purpose of this file is to start testing front end/components using RTL
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import Header from './ZoTest';
import MainContainer from '../containers/MainContainer';
import App from '../components/App';
import SwitchAppDropdown from '../components/SwitchApp';

test('Main Container should render', () => {
  render(<MainContainer />);
  screen.debug();
});
// test('App should render', () => {
//   render(<App />);
//   screen.debug();
// });
// test('Switchapp should render', () => {
//   render(<SwitchAppDropdown />);
//   screen.debug();
// });

// test('Test should run, header renders and it has correct stuff', () => {
//   render(<Header />);
//   // Extract header
//   screen.debug();
//   // allows the DOM to be rendered
// });
