import React, { useReducer } from 'react';
import MainContainer from '../containers/MainContainer';
import { StoreContext } from '../store';
import mainReducer from '../reducers/mainReducer';

const initialState = {
  port: null,
  sliderIndex: 0,
  viewIndex: -1,
  intervalId: null,
  playing: false,
  snapshots: [],
  mode: {
    locked: false,
    paused: false,
    persist: false,
  },
};

function App() {
  return (
    <StoreContext.Provider value={useReducer(mainReducer, initialState)}>
      <MainContainer />
    </StoreContext.Provider>
  );
}

export default App;
