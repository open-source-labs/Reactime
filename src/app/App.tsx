import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import MainContainer from './containers/MainContainer';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './ThemeProvider';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <Router>
        <Toaster />
        <MainContainer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
