import React, { useReducer } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import MainContainer from '../containers/MainContainer';
import { StoreContext } from '../store';
import mainReducer from '../reducers/mainReducer.js';
import { InitialStateProps } from '../components/FrontendTypes';
// currentTab is the current active tab within Google Chrome.
// This is used to decide what tab Reactime should be monitoring. This can be "locked"
// currentTabInApp is the current active tab within Reactime (Map, Performance, History, etc).
// This is used to determine the proper tutorial to render when How To button is pressed.

const initialState: InitialStateProps = {
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
