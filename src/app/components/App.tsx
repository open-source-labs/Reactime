import React, { useReducer } from 'react';
import MainContainer from '../containers/MainContainer';
import { StoreContext } from '../store';
import mainReducer from '../reducers/mainReducer.js';

const initialState: {
  port: null | number,
  currentTab: null | number,
  currentTitle: null | string,
  split: null | boolean,
  tabs: unknown; } = {
    port: null,
    currentTab: null,
    currentTitle: 'No Target',
    split: false,
    tabs: {},
  };

function App(): JSX.Element {
  return (
    <StoreContext.Provider value={useReducer(mainReducer, initialState)}>
      <MainContainer />
    </StoreContext.Provider>
  );
}

export default App;
