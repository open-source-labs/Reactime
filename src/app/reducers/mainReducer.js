import * as types from '../constants/actionTypes';

export default function mainReducer(state, action) {
  const {
    sliderIndex, snapshots, viewIndex, port, mode, intervalId,
  } = state;
  switch (action.type) {
    case types.MOVE_BACKWARD: {
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
    case types.MOVE_FORWARD: {
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
    case types.CHANGE_VIEW: {
      // unselect view if same index was selected
      if (viewIndex === action.payload) return { ...state, viewIndex: -1 };
      return { ...state, viewIndex: action.payload };
    }
    case types.CHANGE_SLIDER: {
      port.postMessage({ action: 'jumpToSnap', payload: snapshots[action.payload] });
      return { ...state, sliderIndex: action.payload };
    }
    case types.EMPTY: {
      port.postMessage({ action: 'emptySnap' });
      return {
        sliderIndex: 0,
        viewIndex: -1,
        playing: false,
        snapshots: [],
      };
    }
    case types.SET_PORT: {
      return { ...state, port: action.payload };
    }
    case types.IMPORT: {
      port.postMessage({ action: 'import', payload: action.payload });
      return {
        ...state,
        snapshots: action.payload,
        sliderIndex: 0,
        viewIndex: -1,
      };
    }
    case types.TOGGLE_MODE: {
      mode[action.payload] = !mode[action.payload];
      const newMode = mode[action.payload];
      let actionText;
      switch (action.payload) {
        case 'paused':
          actionText = 'setPause';
          break;
        case 'locked':
          actionText = 'setLock';
          break;
        case 'persist':
          actionText = 'setPersist';
          break;
        default:
      }
      port.postMessage({ action: actionText, payload: newMode });
      return { ...state, mode };
    }
    case types.PAUSE: {
      clearInterval(intervalId);
      return { ...state, playing: false, intervalId: null };
    }
    case types.PLAY: {
      return {
        ...state,
        playing: true,
        intervalId: action.payload,
      };
    }
    case types.INITIAL_CONNECT: {
      const { payload } = action;
      return {
        ...state,
        snapshots: payload.snapshots,
        mode: payload.mode,
        viewIndex: payload.viewIndex,
        sliderIndex: payload.sliderIndex,
      };
    }
    case types.NEW_SNAPSHOTS: {
      const { payload } = action;
      return {
        ...state,
        snapshots: payload.snapshots,
        sliderIndex: payload.sliderIndex,
      };
    }
    default:
      throw new Error(`nonexistent action: ${action.type}`);
  }
}
