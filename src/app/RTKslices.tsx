import { createSlice, current } from '@reduxjs/toolkit';
import { InitialStateProps } from './FrontendTypes';
import _ from 'lodash';

const initialState: InitialStateProps = { // we initialize what our initialState is here
    port: null,
    currentTab: null,
    currentTitle: 'No Target',
    tabs: {},
    currentTabInApp: null,
    connectionStatus: true,
    reconnectRequested: false,
    hasInitialized: false,
  };

const findName = (index, obj) => {
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

      port.postMessage({ action: 'emptySnap', tabId: currentTab });

      tabs[currentTab].sliderIndex = 0;
      tabs[currentTab].viewIndex = 0;
      tabs[currentTab].playing = false;

      const lastSnapshot = tabs[currentTab].snapshots[tabs[currentTab].snapshots.length - 1];

      tabs[currentTab].hierarchy.stateSnapshot = { ...lastSnapshot };
      tabs[currentTab].hierarchy.children = [];
      tabs[currentTab].snapshots = [lastSnapshot];

      tabs[currentTab].currLocation = tabs[currentTab].hierarchy;
      console.log('tabsHieracyh', tabs[currentTab].hierarchy);
      tabs[currentTab].index = 1;
      tabs[currentTab].currParent = 0;
      tabs[currentTab].currBranch = 1;
      tabs[currentTab].seriesSavedStatus = false;
    },

    addNewSnapshots: (state, action) => {
      const { tabs } = state;

      const { payload } = action;
      Object.keys(tabs).forEach(tab => {
        if (!payload[tab])
          delete tabs[tab];
        else {
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
            sliderIndex: newSnaps.length - 1,
            seriesSavedStatus: false,
          };
        }
      });
    },

    initialConnect: (state, action) => {
      const {tabs, tab, currentTab} = state;
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
      const {mode} = tabs[currentTab] || {};

      if (!mode?.paused) {
        if (typeof action.payload === 'number') {
          state.currentTab = action.payload;
          return;
        } else if (typeof action.payload === 'object') {
          state.currentTab = action.payload.tabId;
          if (action.payload?.title)
            state.currentTitle = action.payload.title;
            return;
        };
      }
    },

    deleteTab: (state, action) => {
      delete state.tabs[action.payload];
    },

    noDev: (state, action) => {
      const { payload } = action;
      const {tabs, currentTab} = state;

      if (tabs[currentTab]) {
        const { reactDevToolsInstalled } = payload[currentTab].status;
        tabs[currentTab].status.reactDevToolsInstalled = reactDevToolsInstalled
      }
    },

    setCurrentLocation: (state, action) => {
      const {tabs, currentTab} = state
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
      const {tabs, currentTab} = state;
      const {viewIndex} = tabs[currentTab] || {};

      tabs[currentTab].viewIndex = viewIndex === action.payload ? -1 : action.payload;
    },

    changeSlider: (state, action) => {
      const { port, currentTab, tabs } = state;
      const { hierarchy, snapshots } = tabs[currentTab] || {};

      const nameFromIndex = findName(action.payload, hierarchy);

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
      const {tabs, currentTab} = state
      const {intervalId} = tabs[currentTab] || {};

      clearInterval(intervalId);
      tabs[currentTab].playing = false;
      tabs[currentTab].intervalId = null;
      console.log('pause: state end', current(state));

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
      const {port, tabs, currentTab} = state
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

    startPlaying : (state, action) => {
      const {tabs, currentTab} = state

      tabs[currentTab].playing = true;
      tabs[currentTab].intervalId = action.payload;
    },

    moveForward: (state, action) => {
      const {port, tabs, currentTab} = state
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

    moveBackward : (state, action) => {
      const {port, tabs, currentTab} = state
      const { hierarchy, snapshots, sliderIndex, intervalId } = tabs[currentTab] || {};

      if (sliderIndex > 0) {
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
    },

    resetSlider: (state) => {
      const {port, tabs, currentTab} = state
      const { snapshots, sliderIndex} = tabs[currentTab] || {};

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

    toggleMode: (state, action)=>{
      const { port, tabs, currentTab } = state;
      const {mode} = tabs[currentTab] || {};
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
      tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: action.payload }
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

    save: (state, action) => {
      const { currentTab, tabs } = state;

      const { newSeries, newSeriesName } = action.payload;
        if (!tabs[currentTab].seriesSavedStatus) {
          tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: 'inputBoxOpen' };
          //testing return to fix save functionality
          return;
        }
        // Runs if series name input box is active.
        // Updates chrome local storage with the newly saved series. Console logging the seriesArray grabbed from local storage may be helpful.
        if (tabs[currentTab].seriesSavedStatus === 'inputBoxOpen') {
          
          let seriesArray: any = localStorage.getItem('project');
          seriesArray = seriesArray === null ? [] : JSON.parse(seriesArray);
          newSeries.name = newSeriesName;
          seriesArray.push(newSeries);
          localStorage.setItem('project', JSON.stringify(seriesArray));
          tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: 'saved' };
          //testing return to fix save functionality instead of break
          return;
        }
    },
      
    toggleExpanded: (state, action) => {
      const { tabs, currentTab } = state;
      // find correct node from currLocation and toggle isExpanded
      const checkChildren = (node) => {
        if (_.isEqual(node, action.payload))
          node.isExpanded = !node.isExpanded;
        else if (node.children) {
          node.children.forEach(child => {
            checkChildren(child);
          });
        }
      };
      checkChildren(tabs[currentTab].currLocation.stateSnapshot);
    },

    deleteSeries: (state) => {
      const { tabs, currentTab } = state;
      const allStorage = () => {
        const keys = Object.keys(localStorage);
        let i = keys.length;
        while (i--) {
          localStorage.removeItem(keys[i]);
        }
      };
      allStorage();
      Object.keys(tabs).forEach((tab) => {
        tabs[tab] = {
          ...tabs[tab],
        };
      });
      tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: false };
    },

    disconnected: (state) => {
      state.connectionStatus = false;
    },

    startReconnect: (state) => {
      state.reconnectRequested = true;
      state.port = initialState.port;
    },

    endReconnect: (state) => {
      state.reconnectRequested = false;
      state.connectionStatus = true;
    }

  },
})

export const {
  emptySnapshots,
  addNewSnapshots,
  initialConnect,
  setPort,
  setTab,
  deleteTab,
  noDev,
  setCurrentLocation,
  changeView,
  changeSlider,
  setCurrentTabInApp,
  pause,
  launchContentScript,
  playForward,
  startPlaying,
  moveForward,
  moveBackward,
  resetSlider,
  toggleMode,
  importSnapshots,
  tutorialSaveSeriesToggle,
  onHover,
  onHoverExit,
  save,
  toggleExpanded,
  deleteSeries,
  disconnected,
  startReconnect,
  endReconnect,
} =  mainSlice.actions
