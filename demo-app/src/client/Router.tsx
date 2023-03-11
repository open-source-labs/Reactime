import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './Components/Nav';
import Board from './Components/Board';
import Home from './Components/Home';
import Buttons from './Components/Buttons';
import Test from './Components/Test';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path='/tictactoe' element={<Board />} />
      <Route path='/' element={<Home />} />
      <Route path='/buttons' element={<Buttons />} />
      <Route path='/test' element={<Test />} />
    </Routes>
  </BrowserRouter>,
);
