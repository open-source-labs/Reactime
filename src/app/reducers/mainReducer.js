/* eslint-disable no-param-reassign */
import produce from 'immer';
import * as types from '../constants/actionTypes';

export default (state, action) => produce(state, draft => {
  const { port, currentTab, tabs } = draft;
  const {
    snapshots, mode, intervalId, viewIndex, sliderIndex,
  } = tabs[currentTab] || {};

  switch (action.type) {
    case types.MOVE_BACKWARD: {
      if (snapshots.length > 0 && sliderIndex > 0) {
        const newIndex = sliderIndex - 1;

        port.postMessage({
          action: 'jumpToSnap',
          payload: snapshots[newIndex],
          tabId: currentTab,
        });
        clearInterval(intervalId);

        tabs[currentTab].sliderIndex = newIndex;
        tabs[currentTab].playing = false;
      }
      break;
    }
    case types.MOVE_FORWARD: {
      if (sliderIndex < snapshots.length - 1) {
        const newIndex = sliderIndex + 1;

        port.postMessage({
          action: 'jumpToSnap',
          payload: snapshots[newIndex],
          tabId: currentTab,
        });

        tabs[currentTab].sliderIndex = newIndex;

        // message is coming from the user
        if (!action.payload) {
          clearInterval(intervalId);
          tabs[currentTab].playing = false;
        }
      }
      break;
    }
    case types.CHANGE_VIEW: {
      // unselect view if same index was selected
      if (viewIndex === action.payload) tabs[currentTab].viewIndex = -1;
      else tabs[currentTab].viewIndex = action.payload;
      break;
    }
    case types.CHANGE_SLIDER: {
      port.postMessage({
        action: 'jumpToSnap',
        payload: snapshots[action.payload],
        tabId: currentTab,
      });
      tabs[currentTab].sliderIndex = action.payload;
      break;
    }
    case types.EMPTY: {
      port.postMessage({ action: 'emptySnap', tabId: currentTab });
      tabs[currentTab].sliderIndex = 0;
      tabs[currentTab].viewIndex = -1;
      tabs[currentTab].playing = false;
      tabs[currentTab].snapshots.splice(1);
      break;
    }
    case types.SET_PORT: {
      draft.port = action.payload;
      break;
    }
    case types.IMPORT: {
      port.postMessage({ action: 'import', payload: action.payload, tabId: currentTab });
      tabs[currentTab].snapshots = action.payload;
      break;
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
      port.postMessage({ action: actionText, payload: newMode, tabId: currentTab });
      break;
    }
    case types.PAUSE: {
      clearInterval(intervalId);
      tabs[currentTab].playing = false;
      tabs[currentTab].intervalId = null;
      break;
    }
    case types.PLAY: {
      tabs[currentTab].playing = true;
      tabs[currentTab].intervalId = action.payload;
      break;
    }
    case types.INITIAL_CONNECT: {
      const { payload } = action;
      Object.keys(payload).forEach(tab => {
        // check if tab exists in memory
        if (!tabs[tab]) {
          // add new tab
          tabs[tab] = {
            ...payload[tab],
            sliderIndex: 0,
            viewIndex: -1,
            intervalId: null,
            playing: false,
          };
        }
      });

      // only set first tab if current tab is non existent
      const firstTab = parseInt(Object.keys(payload)[0], 10);
      draft.currentTab = currentTab === null ? firstTab : currentTab;

      break;
    }
    case types.NEW_SNAPSHOTS: {
      const { payload } = action;

      Object.keys(payload).forEach(tab => {
        const { snapshots: newSnaps } = payload[tab];
        tabs[tab] = {
          ...tabs[tab],
          ...payload[tab],
          sliderIndex: newSnaps.length - 1,
        };
      });

      break;
    }
    case types.SET_TAB: {
      draft.currentTab = action.paylod;
      break;
    }
    default:
      throw new Error(`nonexistent action: ${action.type}`);
  }
});
