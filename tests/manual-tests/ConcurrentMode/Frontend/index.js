import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const rootContainer = document.getElementById('root');

// Concurrent Mode
const root = ReactDOM.createRoot(rootContainer);

root.render(<App />);

