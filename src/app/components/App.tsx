import React, { useReducer, useState } from 'react';
import {
  MemoryRouter as Router,
  Route,
  NavLink,
  Switch,
  useLocation,
} from 'react-router-dom';
// import { Steps, Hints } from 'intro.js-react';
import MainContainer from '../containers/MainContainer';
import { StoreContext } from '../store';
import mainReducer from '../reducers/mainReducer.js';

// import 'intro.js/introjs.css';

// currentTab is the current active tab within Google Chrome. This is used to decide what tab Reactime should be monitoring. This can be "locked"
// currentTabInApp is the current active tab within Reactime (Map, Performance, History, etc). This is used to determine the proper tutorial to render when How To button is pressed.

const initialState: {
  port: null | number,
  currentTab: null | number,
  currentTitle: null | string,
  split: null | boolean,
  tabs: unknown,
  currentTabInApp: null | string, } = {
    port: null,
    currentTab: null,
    currentTitle: 'No Target',
    split: false,
    tabs: {},
    currentTabInApp: null,
  };

function App(): JSX.Element {
  return (
    <Router>
      <StoreContext.Provider value={useReducer(mainReducer, initialState)}>
        <MainContainer />
      </StoreContext.Provider>
    </Router>
  );
}

export default App;
