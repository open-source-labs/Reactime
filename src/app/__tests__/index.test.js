import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

it('renders without crashing', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
})