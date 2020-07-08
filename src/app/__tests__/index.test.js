import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';

it('renders without crashing', () => {
  const root = document.createElement('root');
  ReactDOM.render(<App />, root);
})