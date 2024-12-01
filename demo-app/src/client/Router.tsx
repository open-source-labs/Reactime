import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './Components/Nav';
import Board from './Components/Board';
import Home from './Components/Home';
import Buttons from './Components/Buttons';
import ReducerCounter from './Components/ReducerCounter';
// import ButtonsWithMoreHooks from './Components/ButtonsWithMoreHooks';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <BrowserRouter key='BrowserRouter'>
    <Nav key='Nav' />
    <Routes key='Routes'>
      <Route path='/' element={<Home key='Home' />} />
      <Route path='/tictactoe' element={<Board key='Board' />} />
      {/* Switch between the two "buttons" paths below via commenting/uncommenting to alternate between
          the public facing Buttons page and the fiber node hooks research page "ButtonsWithMoreHooks" */}
      <Route path='/buttons' element={<Buttons key='Buttons' />} />
      {/* <Route path='/buttons' element={<ButtonsWithMoreHooks key='ButtonsWithMoreHooks'/>} /> */}
      <Route path='/reducer' element={<ReducerCounter key='ReducerCounter' />} />
    </Routes>
  </BrowserRouter>,

  /** Comment out everything above this and uncomment the line below as ButtonsWithMoreHooks import statement to skip all of the
   *  router components and make fiber node hooks research easier */

  // <ButtonsWithMoreHooks/>
);
