import React, { useReducer, useEffect } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';
import ButtonsContainer from './ButtonsContainer';

const ACTIONS = {
  toggleMode: 'toggleMode',
  moveBackward: 'moveBackward',
  moveForward: 'moveForward',
  import: 'import',
  empty: 'empty',
  changeView: 'changeView',
  changeSlider: 'changeSlider',
  setPort: 'setPort',
  pause: 'pause',
  play: 'play',
  initialConnect: 'initialConnect',
  newSnapshots: 'newSnapshots',
};

function mainReducer(state, action) {
  const {
    sliderIndex, snapshots, viewIndex, port, mode, intervalId,
  } = state;
  switch (action.type) {
    case ACTIONS.moveBackward: {
      if (snapshots.length > 0 && sliderIndex > 0) {
        const newIndex = sliderIndex - 1;
        clearInterval(intervalId);
        port.postMessage({ action: 'jumpToSnap', payload: snapshots[newIndex] });
        return {
          ...state,
          sliderIndex: newIndex,
          playing: false,
        };
      }
      return state;
    }
    case ACTIONS.moveForward: {
      if (sliderIndex < snapshots.length - 1) {
        const newIndex = sliderIndex + 1;
        port.postMessage({ action: 'jumpToSnap', payload: snapshots[newIndex] });

        // if payload is true, then message is coming from the setInterval
        if (!action.payload) {
          clearInterval(intervalId);
          return {
            ...state,
            sliderIndex: newIndex,
            playing: false,
          };
        }
        return {
          ...state,
          sliderIndex: newIndex,
        };
      }
      return state;
    }
    case ACTIONS.changeView: {
      // unselect view if same index was selected
      if (viewIndex === action.payload) return [...state, { viewIndex: -1 }];
      return { ...state, viewIndex: action.payload };
    }
    case ACTIONS.changeSlider: {
      port.postMessage({ action: 'jumpToSnap', payload: snapshots[action.payload] });
      return { ...state, sliderIndex: action.payload };
    }
    case ACTIONS.empty: {
      port.postMessage({ action: 'emptySnap' });
      return {
        sliderIndex: 0,
        viewIndex: -1,
        playing: false,
        snapshots: [],
      };
    }
    case ACTIONS.setPort: {
      return { ...state, port: action.payload };
    }
    case ACTIONS.import: {
      return {
        ...state,
        snapshots: action.payload,
        sliderIndex: 0,
        viewIndex: -1,
      };
    }
    case ACTIONS.toggleMode: {
      mode[action.payload] = !mode[action.payload];
      return { ...state, mode };
    }
    case ACTIONS.pause: {
      clearInterval(intervalId);
      return { ...state, playing: false, intervalId: null };
    }
    case ACTIONS.play: {
      return {
        ...state,
        playing: true,
        intervalId: action.payload,
      };
    }
    case ACTIONS.initialConnect: {
      const { payload } = action;
      return {
        ...state,
        snapshots: payload.snapshots,
        mode: payload.mode,
        viewIndex: payload.viewIndex,
        sliderIndex: payload.sliderIndex,
      };
    }
    case ACTIONS.newSnapshots: {
      const { payload } = action;
      return {
        ...state,
        snapshots: payload.snapshots,
        sliderIndex: payload.sliderIndex,
      };
    }
    default:
      throw new Error('nonexistent action');
  }
}

function MainContainer() {
  const [mainState, dispatch] = useReducer(mainReducer, {
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
  });

  useEffect(() => {
    if (mainState.port) return;
    // open connection with background script
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener((message) => {
      const { action, payload } = message;
      switch (action) {
        case 'sendSnapshots': {
          const sliderIndex = payload.length - 1;
          // set state with the information received from the background script
          dispatch({
            type: ACTIONS.newSnapshots,
            payload: {
              snapshots: payload,
              sliderIndex,
            },
          });
          break;
        }
        case 'initialConnectSnapshots': {
          const { snapshots, mode } = payload;
          const viewIndex = -1;
          const sliderIndex = 0;
          dispatch({
            type: ACTIONS.initialConnect,
            payload: {
              snapshots,
              mode,
              viewIndex,
              sliderIndex,
            }
          });
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
    dispatch({
      type: 'setPort',
      payload: port,
    });
  });

  const {
    port,
    snapshots,
    sliderIndex,
    viewIndex,
    playing,
    mode,
  } = mainState;

  // if viewIndex is -1, then use the sliderIndex instead
  const snapshotView = (viewIndex === -1) ? snapshots[sliderIndex] : snapshots[viewIndex];

  return (
    (port) ? (
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
    ) : <div>no existing react-time-travel page</div>);
}

export default MainContainer;
