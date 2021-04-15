import { produce, original } from 'immer';

import * as types from '../constants/actionTypes.ts';

export default (state, action) => produce(state, draft => {
  console.log('export state', state);
  const { port, currentTab, tabs } = draft;
  console.log('currentTab Reducer:', currentTab);
  console.log('reducer action:', action);
  const {
    hierarchy, snapshots, mode, intervalId, viewIndex, sliderIndex,
  } = tabs[currentTab] || {};

  // eslint-disable-next-line max-len
  // function that finds the index in the hierarchy and extracts the name of the equivalent index to add to the post message
  // eslint-disable-next-line consistent-return
  const findName = (index, obj) => {
    // eslint-disable-next-line eqeqeq
    if (obj && obj.index == index) {
      return obj.name;
    }

    const objChildArray = [];
    if (obj) {
      for (const objChild of obj.children) {
        objChildArray.push(findName(index, objChild));
      }
    }
    for (const objChildName of objChildArray) {
      if (objChildName) {
        return objChildName;
      }
    }
  };

  switch (action.type) {
    // Save case will store the series user wants to save to the chrome local storage
    case types.SAVE: {
      const data = JSON.stringify(action.payload);
      localStorage.setItem(`${action.payload.currentTab}`, data);
      tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: true };
      console.log('seriesSavedStatus set to true from saving series');
      break;
    }
    // Delete case will delete ALL stored series in chrome local storage. To see  chrome storage related data
    // Chrome Extension Manager (chrome:extensions) --> background page link --> Application Tab
    case types.DELETE_SERIES: {
      const allStorage = () => {
        const keys = Object.keys(localStorage);
        let i = keys.length;
        while (i--) {
          localStorage.removeItem(keys[i]);
        }
      };
      allStorage();
      Object.keys(tabs).forEach(tab => {
        tabs[tab] = {
          ...tabs[tab],
        };
      });
      tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: false };
    }
    case types.ON_HOVER_EXIT: {
      port.postMessage({
        action: 'onHoverExit',
        payload: action.payload,
        tabId: currentTab,
      });
      break;
    }

    case types.ON_HOVER: {
      port.postMessage({
        action: 'onHover',
        payload: action.payload,
        tabId: currentTab,
      });
      break;
    }

    case types.MOVE_BACKWARD: {
      if (snapshots.length > 0 && sliderIndex > 0) {
        const newIndex = sliderIndex - 1;
        // eslint-disable-next-line max-len
        // finds the name by the newIndex parsing through the hierarchy to send to background.js the current name in the jump action
        const nameFromIndex = findName(newIndex, hierarchy);
        port.postMessage({
          action: 'jumpToSnap',
          payload: snapshots[newIndex],
          index: newIndex,
          name: nameFromIndex,
          tabId: currentTab,
          newProp: 'newPropFromReducer',
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
        // eslint-disable-next-line max-len
        // finds the name by the newIndex parsing through the hierarchy to send to background.js the current name in the jump action
        const nameFromIndex = findName(newIndex, hierarchy);

        port.postMessage({
          action: 'jumpToSnap',
          index: newIndex,
          name: nameFromIndex,
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
    case types.SLIDER_ZERO: {
      // eslint-disable-next-line max-len
      // resets name to 0 to send to background.js the current name in the jump action
      port.postMessage({
        action: 'jumpToSnap',
        index: 0,
        name: 0,
        payload: snapshots[0],
        tabId: currentTab,
      });
      tabs[currentTab].sliderIndex = 0;
      break;
    }
    case types.CHANGE_VIEW: {
      // unselect view if same index was selected
      if (viewIndex === action.payload) tabs[currentTab].viewIndex = -1;
      else tabs[currentTab].viewIndex = action.payload;
      break;
    }
    case types.CHANGE_SLIDER: {
      // eslint-disable-next-line max-len
      // finds the name by the action.payload parsing through the hierarchy to send to background.js the current name in the jump action
      const nameFromIndex = findName(action.payload, hierarchy);

      port.postMessage({
        action: 'jumpToSnap',
        payload: snapshots[action.payload],
        index: action.payload,
        name: nameFromIndex,
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
      // activates empty mode
      tabs[currentTab].mode.empty = true;
      // records snapshot of page initial state
      tabs[currentTab].initialSnapshot.push(tabs[currentTab].snapshots[0]);
      // resets snapshots to page last state recorded
      // eslint-disable-next-line max-len
      tabs[currentTab].snapshots = [
        tabs[currentTab].snapshots[tabs[currentTab].snapshots.length - 1],
      ];
      // records hierarchy of page initial state
      tabs[currentTab].initialHierarchy = { ...tabs[currentTab].hierarchy };
      tabs[currentTab].initialHierarchy.children = [];
      // resets hierarchy
      tabs[currentTab].hierarchy.children = [];
      // resets hierarchy to page last state recorded
      // eslint-disable-next-line prefer-destructuring
      tabs[currentTab].hierarchy.stateSnapshot = tabs[currentTab].snapshots[0];
      // resets currLocation to page last state recorded
      tabs[currentTab].currLocation = tabs[currentTab].hierarchy;
      // resets index
      tabs[currentTab].index = 0;
      // resets currParent plus current state
      tabs[currentTab].currParent = 1;
      // resets currBranch
      tabs[currentTab].currBranch = 0;
      // resets series saved status
      tabs[currentTab].seriesSavedStatus = false;
      break;
    }
    case types.SET_PORT: {
      draft.port = action.payload;
      break;
    }
    case types.IMPORT: {
      port.postMessage({
        action: 'import',
        payload: action.payload,
        tabId: currentTab,
      });
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
        case 'persist':
          actionText = 'setPersist';
          break;
        default:
          break;
      }
      port.postMessage({
        action: actionText,
        payload: newMode,
        tabId: currentTab,
      });
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
        // add new tab
        tabs[tab] = {
          ...payload[tab],
          sliderIndex: 0,
          viewIndex: -1,
          intervalId: null,
          playing: false,
        };
      });

      // only set first tab if current tab is non existent
      const firstTab = parseInt(Object.keys(payload)[0], 10);
      if (currentTab === undefined || currentTab === null) draft.currentTab = firstTab;
      break;
    }
    case types.NEW_SNAPSHOTS: {
      const { payload } = action;
      Object.keys(tabs).forEach(tab => {
        if (!payload[tab]) {
          delete tabs[tab];
        } else {
          const { snapshots: newSnaps } = payload[tab];
          tabs[tab] = {
            ...tabs[tab],
            ...payload[tab],
            sliderIndex: newSnaps.length - 1,
            seriesSavedStatus: false,
          };
          console.log('seriesSavedStatus set to false from new snapshot');
        }
      });

      // only set first tab if current tab is non existent
      const firstTab = parseInt(Object.keys(payload)[0], 10);
      if (currentTab === undefined || currentTab === null) draft.currentTab = firstTab;
      break;
    }
    case types.SET_TAB: {
      if (typeof action.payload === 'number') {
        draft.currentTab = action.payload;
        break;
      } else if (typeof action.payload === 'object') {
        draft.currentTab = action.payload.tabId;
        break;
      }
      break;
    }
    case types.DELETE_TAB: {
      delete draft.tabs[action.payload];
      if (draft.currentTab === action.payload) {
        // if the deleted tab was set to currentTab, replace currentTab with
        // the first tabId within tabs obj
        const newCurrentTab = parseInt(Object.keys(draft.tabs)[0], 10);
        draft.currentTab = newCurrentTab;
      }
      break;
    }
    default:
      throw new Error(`nonexistent action: ${action.type}`);
  }
});
