import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from '../FrontendTypes';
import _ from 'lodash';
import Action from '../components/Actions/Action';

const initialState: InitialState = {
  // we initialize what our initialState is here
  port: null,
  currentTab: null,
  currentTitle: 'No Target',
  tabs: {},
  currentTabInApp: null,
  connectionStatus: true,
  connectRequested: true,
};

const findName = (index: number, obj) => {
  // eslint-disable-next-line eqeqeq
  if (obj && obj.index == index) {
    return obj.name;
  }
  const objChildArray = [];
  if (obj) {
    // eslint-disable-next-line no-restricted-syntax
    for (const objChild of obj.children) {
      objChildArray.push(findName(index, objChild));
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const objChildName of objChildArray) {
    if (objChildName) {
      return objChildName;
    }
  }
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    emptySnapshots: (state) => {
      const { tabs, currentTab, port } = state;

      port.postMessage({ action: 'emptySnap', tabId: currentTab }); //communicate with background.js (service worker)
      // properties associated with timetravel + seek bar
      tabs[currentTab].sliderIndex = 0;
      tabs[currentTab].viewIndex = 0;
      tabs[currentTab].playing = false;

      const currSnapshot = tabs[currentTab].snapshots[tabs[currentTab].currLocation.index]; // current snapshot
      const currAxSnapshot = tabs[currentTab].axSnapshots[tabs[currentTab].currLocation.index]; // current accessibility tree snapshot

      tabs[currentTab].hierarchy.stateSnapshot = { ...currSnapshot }; // resets hierarchy to current snapshot
      tabs[currentTab].hierarchy.axSnapshot = { ...currAxSnapshot }; // resets hierarchy to current accessibility tree snapshot
      tabs[currentTab].hierarchy.children = []; // resets hierarchy
      tabs[currentTab].snapshots = [currSnapshot]; // resets snapshots to current snapshot
      tabs[currentTab].axSnapshots = [currAxSnapshot]; // resets snapshots to current snapshot

      // resets currLocation to current snapshot
      tabs[currentTab].index = 1;
      tabs[currentTab].currParent = 0;
      tabs[currentTab].currBranch = 1;
      tabs[currentTab].currLocation = tabs[currentTab].hierarchy; // reset currLocation
      tabs[currentTab].seriesSavedStatus = false;
    },

    addNewSnapshots: (state, action) => {
      const { tabs, currentTab } = state;

      const { payload } = action;
      Object.keys(tabs).forEach((tab) => {
        if (!payload[tab]) delete tabs[tab];
        else {
          // maintain isExpanded prop from old stateSnapshot to preserve componentMap expansion
          const persistIsExpanded = (newNode, oldNode) => {
            newNode.isExpanded = oldNode ? oldNode.isExpanded : true;
            if (newNode.children) {
              newNode.children.forEach((child, i) => {
                persistIsExpanded(child, oldNode?.children[i]);
              });
            }
          };
          persistIsExpanded(
            payload[tab].currLocation.stateSnapshot,
            tabs[tab].currLocation.stateSnapshot,
          );

          const { snapshots: newSnaps } = payload[tab];
          tabs[tab] = {
            ...payload[tab],
            intervalId: tabs[tab].intervalId,
            playing: tabs[tab].playing,
            sliderIndex: tabs[tab].sliderIndex,
            seriesSavedStatus: false,
          };
        }
      });

      // only set first tab if current tab is non existent
      const firstTab = parseInt(Object.keys(payload)[0], 10);
      if (currentTab === undefined || currentTab === null) state.currentTab = firstTab;
    },

    initialConnect: (state, action) => {
      const { tabs, tab, currentTab } = state;
      const { hierarchy, snapshots, mode, intervalId, viewIndex, sliderIndex } =
        tabs[currentTab] || {};
      const { payload } = action;

      Object.keys(payload).forEach((tab) => {
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
      if (currentTab === undefined || currentTab === null) state.currentTab = firstTab;
    },

    setPort: (state, action) => {
      state.port = action.payload;
    },

    setTab: (state, action) => {
      const { tabs, currentTab } = state;
      const { mode } = tabs[currentTab] || {};
      if (!mode?.paused) {
        if (typeof action.payload === 'number') {
          state.currentTab = action.payload;
          return;
        } else if (typeof action.payload === 'object') {
          state.currentTab = action.payload.tabId;
          if (action.payload?.title) state.currentTitle = action.payload.title;
          return;
        }
      }
    },

    deleteTab: (state, action) => {
      delete state.tabs[action.payload];
    },

    noDev: (state, action) => {
      const { payload } = action;
      const { tabs, currentTab } = state;

      if (tabs[currentTab]) {
        const { reactDevToolsInstalled } = payload[currentTab].status;
        // JR 12.20. 9.47pm this was not applying to state before
        state.tabs[currentTab].status.reactDevToolsInstalled = reactDevToolsInstalled;
      }
    },

    aReactApp: (state, action) => {
      const { payload } = action;
      const { tabs, currentTab } = state;

      if (tabs[currentTab]) {
        // JR 12.20. 9.47pm this was not applying to state before
        state.tabs[currentTab].status.targetPageisaReactApp = true;
      }
    },

    setCurrentLocation: (state, action) => {
      const { tabs, currentTab } = state;
      const { payload } = action;

      const persistIsExpanded = (newNode, oldNode) => {
        newNode.isExpanded = oldNode ? oldNode.isExpanded : true;
        if (newNode.children) {
          newNode.children.forEach((child, i) => {
            persistIsExpanded(child, oldNode?.children[i]);
          });
        }
      };
      persistIsExpanded(
        payload[currentTab].currLocation.stateSnapshot,
        tabs[currentTab].currLocation.stateSnapshot,
      );
      tabs[currentTab].currLocation = payload[currentTab].currLocation;
    },

    changeView: (state, action) => {
      const { tabs, currentTab } = state;
      const { viewIndex } = tabs[currentTab] || {};

      // unselect view if same index was selected
      tabs[currentTab].viewIndex = viewIndex === action.payload ? -1 : action.payload;
    },

    changeSlider: (state, action) => {
      //should really be called jump to snapshot
      const { port, currentTab, tabs } = state;
      const { hierarchy, snapshots } = tabs[currentTab] || {};

      // finds the name by the action.payload parsing through the hierarchy to send to background.js the current name in the jump action
      const nameFromIndex = findName(action.payload, hierarchy);
      // nameFromIndex is a number based on which jump button is pushed

      port.postMessage({
        action: 'jumpToSnap',
        payload: snapshots[action.payload],
        index: action.payload,
        name: nameFromIndex,
        tabId: currentTab,
      });

      tabs[currentTab].sliderIndex = action.payload;
    },

    setCurrentTabInApp: (state, action) => {
      state.currentTabInApp = action.payload;
    },

    pause: (state) => {
      const { tabs, currentTab } = state;
      const { intervalId } = tabs[currentTab] || {};

      clearInterval(intervalId);
      tabs[currentTab].playing = false;
      tabs[currentTab].intervalId = null;
    },

    launchContentScript: (state, action) => {
      const { tabs, currentTab, port } = state;

      // Fired when user clicks launch button on the error page. Send msg to background to launch
      port.postMessage({
        action: 'launchContentScript',
        payload: action.payload,
        tabId: currentTab,
      });
    },

    playForward: (state, action) => {
      const { port, tabs, currentTab } = state;
      const { hierarchy, snapshots, sliderIndex, intervalId } = tabs[currentTab] || {};

      if (sliderIndex < snapshots.length - 1) {
        const newIndex = sliderIndex + 1;
        // eslint-disable-next-line max-len
        // finds the name by the newIndex parsing through the hierarchy to send to background.js the current name in the jump action
        const nameFromIndex = findName(newIndex, hierarchy);

        port.postMessage({
          action: 'jumpToSnap',
          payload: snapshots[newIndex],
          index: newIndex,
          name: nameFromIndex,
          tabId: currentTab,
        });

        tabs[currentTab].sliderIndex = newIndex;

        // message is coming from the user
        if (!action.payload) {
          clearInterval(intervalId);
          tabs[currentTab].playing = false;
        }
      }
    },

    startPlaying: (state, action) => {
      const { tabs, currentTab } = state;

      tabs[currentTab].playing = true;
      tabs[currentTab].intervalId = action.payload;
    },

    resetSlider: (state) => {
      const { port, tabs, currentTab } = state;
      const { snapshots, sliderIndex } = tabs[currentTab] || {};

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
    },

    toggleMode: (state, action) => {
      const { port, tabs, currentTab } = state;
      const { mode } = tabs[currentTab] || {};
      mode[action.payload] = !mode[action.payload];
      const newMode = mode[action.payload];
      let actionText;
      switch (action.payload) {
        case 'paused':
          actionText = 'setPause';
          break;
        default:
          break;
      }
      port.postMessage({
        action: actionText,
        payload: newMode,
        tabId: currentTab,
      });
    },

    importSnapshots: (state, action) => {
      const { port, tabs, currentTab } = state;

      // Log the value of tabs[currentTab].snapshots before the update
      port.postMessage({
        action: 'import',
        payload: action.payload,
        tabId: currentTab,
      });

      const savedSnapshot = action.payload;

      tabs[currentTab].sliderIndex = savedSnapshot.sliderIndex;
      tabs[currentTab].viewIndex = savedSnapshot.viewIndex;
      tabs[currentTab].playing = false;

      // resets hierarchy to page last state recorded
      tabs[currentTab].hierarchy.stateSnapshot = savedSnapshot.hierarchy.stateSnapshot;

      // resets hierarchy
      tabs[currentTab].hierarchy.children = savedSnapshot.hierarchy.children;

      // resets snapshots to page last state recorded
      tabs[currentTab].snapshots = savedSnapshot.snapshots;

      // resets currLocation to page last state recorded
      tabs[currentTab].currLocation = tabs[currentTab].hierarchy;
      tabs[currentTab].index = savedSnapshot.index;
      tabs[currentTab].currParent = savedSnapshot.currParent;
      tabs[currentTab].currBranch = savedSnapshot.Branch;
      tabs[currentTab].seriesSavedStatus = false;
    },

    tutorialSaveSeriesToggle: (state, action) => {
      const { tabs, currentTab } = state;
      tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: action.payload }; // sets the tab[currentTab]'s 'seriesSavedStatus' property to the payload.
    },

    onHover: (state, action) => {
      const { currentTab, port } = state;

      port.postMessage({
        action: 'onHover',
        payload: action.payload,
        tabId: currentTab,
      });
    },

    onHoverExit: (state, action) => {
      const { currentTab, port } = state;

      port.postMessage({
        action: 'onHoverExit',
        payload: action.payload,
        tabId: currentTab,
      });
    },

    toggleExpanded: (state, action) => {
      const { tabs, currentTab } = state;
      const snapshot = tabs[currentTab].currLocation.stateSnapshot;

      // Special case for root node
      if (action.payload.name === 'root' && snapshot.name === 'root') {
        snapshot.isExpanded = !snapshot.isExpanded;
        return;
      }

      // Regular case for other nodes
      const checkChildren = (node) => {
        if (_.isEqual(node, action.payload)) {
          node.isExpanded = !node.isExpanded;
        } else if (node.children) {
          node.children.forEach((child) => {
            checkChildren(child);
          });
        }
      };
      checkChildren(snapshot);
    },

    disconnected: (state) => {
      state.connectionStatus = false;
    },

    startReconnect: (state) => {
      state.connectRequested = true;
      state.port = initialState.port;
    },

    endConnect: (state) => {
      state.connectRequested = false;
      state.connectionStatus = true;
    },

    toggleAxTree: (state, action) => {
      const { port, payload, tabs, currentTab } = state;
      port.postMessage({
        action: 'toggleAxRecord',
        payload: action.payload,
        tabId: currentTab,
      });
    },
  },
});

export const {
  emptySnapshots,
  addNewSnapshots,
  initialConnect,
  setPort,
  setTab,
  deleteTab,
  noDev,
  aReactApp,
  setCurrentLocation,
  changeView,
  changeSlider,
  setCurrentTabInApp,
  pause,
  launchContentScript,
  playForward,
  startPlaying,
  resetSlider,
  toggleMode,
  importSnapshots,
  tutorialSaveSeriesToggle,
  onHover,
  onHoverExit,
  toggleExpanded,
  disconnected,
  startReconnect,
  endConnect,
  toggleAxTree,
} = mainSlice.actions;
