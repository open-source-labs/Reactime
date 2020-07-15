/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import ReactDOM from 'react-dom';

const App = require('../components/App').default;

it('renders without crashing', () => {
  const root = document.createElement('root');
  ReactDOM.render(<App />, root);
});
