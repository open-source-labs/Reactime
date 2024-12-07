// src/client/Router.tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import Nav from './Components/Nav';
import Board from './Components/Board';
import Home from './Components/Home';
import Buttons from './Components/Buttons';
import ReducerCounter from './Components/ReducerCounter';
import FunctionalReducerCounter from './Components/FunctionalReducerCounter';
import FunctionalStateCounter from './Components/FunctionalStateCounter';
import ThemeToggle from './Components/ThemeToggle';

const domNode = document.getElementById('root');
if (!domNode) throw new Error('Root element not found');
const root = createRoot(domNode);

const CounterPage = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
    <ReducerCounter
      key='ReducerCounter'
      initialCount={5}
      step={2}
      title='Class Counter'
      theme={{ backgroundColor: '#f5f5f5', textColor: '#2a2a2a' }}
    />
    <FunctionalReducerCounter
      key='FunctionalReducerCounter'
      initialCount={10}
      step={3}
      title='Functional Reducer'
      theme={{ backgroundColor: '#e8f4f8', textColor: '#2b4d59' }}
    />
    <FunctionalStateCounter
      key='FunctionalStateCounter'
      initialCount={15}
      step={5}
      title='Functional State'
      theme={{ backgroundColor: '#f8f4e8', textColor: '#594b2b' }}
    />
  </div>
);

root.render(
  <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <ThemeToggle />
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tictactoe' element={<Board />} />
          <Route path='/buttons' element={<Buttons />} />
          <Route path='/reducer' element={<CounterPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>,
);
