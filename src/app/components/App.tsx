import React, { useReducer } from 'react';
import MainContainer from '../containers/MainContainer';
import { StoreContext } from '../store';
import mainReducer from '../reducers/mainReducer.js';

const initialState:{port: null|number,
  currentTab: null|number, tabs: unknown } = {
    port: null,
    currentTab: null,
    tabs: {},
  };

function App(): unknown {
  return (
    <StoreContext.Provider value={useReducer(mainReducer, initialState)}>
      <MainContainer />
    </StoreContext.Provider>
  );
}

export default App;
