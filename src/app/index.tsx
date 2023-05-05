/* eslint-disable react/jsx-filename-extension */
import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/main.scss';

// Old way of rendering that was locking Reactime into React 17
// Left for testing purposes
// ReactDOM.render(<App />, document.getElementById('root'));

//New way of rendering that allows us to use React 18
const root = createRoot(document.getElementById("root"));
root.render(
  //Strict mode is for developers, it throws extra errors 
  // <StrictMode>
    <App/>
  // </StrictMode>
);