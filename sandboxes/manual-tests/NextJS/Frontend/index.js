import React from 'react';
import ReactDOM from 'react-dom';
import reactime from 'dev-reactime';
import App from './app';

const rootContainer = document.getElementById('root');

ReactDOM.render(<App />, rootContainer);

reactime(rootContainer);
