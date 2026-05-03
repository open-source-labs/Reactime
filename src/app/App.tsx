import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import MainContainer from './containers/MainContainer';
import Footer from './components/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './ThemeProvider';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <Router>
        <Toaster />
        <MainContainer />
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
