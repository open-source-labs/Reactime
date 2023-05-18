/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/main.scss';

//Updated rendering sytax for React 18
const root = createRoot(document.getElementById("root"));
root.render(
  // Strict mode is for developers to better track best practices 
  // <StrictMode>
    <App/>
  // </StrictMode>
);