import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './Components/Nav';
import Board from './Components/Board';
import Home from './Components/Home';
import Buttons from './Components/Buttons';
import ReducerCounter from './Components/ReducerCounter';
import FunctionalReducerCounter from './Components/FunctionalReducerCounter';
// import ButtonsWithMoreHooks from './Components/ButtonsWithMoreHooks';
import FunctionalStateCounter from './Components/FunctionalStateCounter';

const domNode = document.getElementById('root');
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
  <BrowserRouter key='BrowserRouter'>
    <Nav key='Nav' />
    <Routes key='Routes'>
      <Route path='/' element={<Home key='Home' />} />
      <Route path='/tictactoe' element={<Board key='Board' />} />
      {/* Switch between the two "buttons" paths below via commenting/uncommenting to alternate between
          the public facing Buttons page and the fiber node hooks research page "ButtonsWithMoreHooks" */}
      <Route path='/buttons' element={<Buttons key='Buttons' />} />
      {/* <Route path='/buttons' element={<ButtonsWithMoreHooks key='ButtonsWithMoreHooks'/>} /> */}
      <Route path='/reducer' element={<CounterPage key='CounterPage' />} />
    </Routes>
  </BrowserRouter>,

  /** Comment out everything above this and uncomment the line below as ButtonsWithMoreHooks import statement to skip all of the
   *  router components and make fiber node hooks research easier */

  // <ButtonsWithMoreHooks/>
);
