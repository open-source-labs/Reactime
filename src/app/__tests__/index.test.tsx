/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import ReactDOM from 'react-dom';

const App = require('../components/App').default;

jest.mock('../../../node_modules/intro.js/introjs.css', () => jest.fn());
it('renders without crashing', () => {
  const root = document.createElement('root');
  ReactDOM.render(<App />, root);
});
