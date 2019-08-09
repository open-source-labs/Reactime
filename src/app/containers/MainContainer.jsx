import React, { useReducer, useEffect } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';
import ButtonsContainer from './ButtonsContainer';

import mainReducer from '../reducers/mainReducer';
import { addNewSnapshots, initialConnect, setPort } from '../actions/actions';
import StoreContext from '../store';

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

function MainContainer() {
  const [mainState, dispatch] = useReducer(mainReducer, initialState);

  useEffect(() => {
    if (mainState.port) return;
    // open connection with background script
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener((message) => {
      const { action, payload } = message;
      switch (action) {
        case 'sendSnapshots': {
          // set state with the information received from the background script
          dispatch(addNewSnapshots(payload));
          break;
        }
        case 'initialConnectSnapshots': {
          const { snapshots, mode } = payload;
          dispatch(initialConnect(snapshots, mode));
          break;
        }
        default:
      }
    });

    // console log if the port with background script disconnects
    port.onDisconnect.addListener((obj) => {
      console.log('disconnected port', obj);
    });

    // assign port to state so it could be used by other components
    // this.setState({ port });
    dispatch(setPort(port));
  });

  const {
    snapshots,
    sliderIndex,
    viewIndex,
    playing,
    mode,
  } = mainState;

  // if viewIndex is -1, then use the sliderIndex instead
  const snapshotView = (viewIndex === -1) ? snapshots[sliderIndex] : snapshots[viewIndex];
  return (
    <StoreContext.Provider value={[mainState, dispatch]}>
      <div className="main-container">
        <HeadContainer />
        <div className="body-container">
          <ActionContainer
            snapshots={snapshots}
            sliderIndex={sliderIndex}
            viewIndex={viewIndex}
            dispatch={dispatch}
          />
          {(snapshots.length) ? <StateContainer snapshot={snapshotView} /> : null}
          <TravelContainer
            snapshotsLength={snapshots.length}
            sliderIndex={sliderIndex}
            playing={playing}
            dispatch={dispatch}
          />
          <ButtonsContainer
            mode={mode}
            dispatch={dispatch}
            snapshots={mainState.snapshots}
          />
        </div>
      </div>
    </StoreContext.Provider>
  );
}

export default MainContainer;
