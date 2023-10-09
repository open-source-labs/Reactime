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
    //this originally has a action paramater !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! in case something doesn't work later on
    //we removed the action parameter because we kept getting an error within actionContainer file on line 204
    //as it expected an argument or payload to be passed in
    emptySnapshots: (state) => {
      console.log('emptySnapshots: ', current(state));

      const { tabs, currentTab, port } = state;
      console.log('currentTab exists??: ', tabs[currentTab]);
      console.log('port: ', port);

      port.postMessage({ action: 'emptySnap', tabId: currentTab });

      tabs[currentTab].sliderIndex = 0;
      tabs[currentTab].viewIndex = 0;
      tabs[currentTab].playing = false;

      const lastSnapshot = tabs[currentTab].snapshots[tabs[currentTab].snapshots.length - 1];

      tabs[currentTab].hierarchy.stateSnapshot = { ...lastSnapshot };
      tabs[currentTab].hierarchy.children = [];
      tabs[currentTab].snapshots = [lastSnapshot];

      //there is a typo here
      tabs[currentTab].currLocation = tabs[currentTab].hierarchy;
      console.log('tabsHieracyh', tabs[currentTab].hierarchy);
      tabs[currentTab].index = 1;
      tabs[currentTab].currParent = 0;
      tabs[currentTab].currBranch = 1;
      tabs[currentTab].seriesSavedStatus = false;

      console.log('emptySnapshots state end: ', current(state));

    },
    addNewSnapshots: (state, action) => {
      console.log('addNewSnapshots: ', current(state));
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
      console.log('addNewSnapshots: state end ', current(state));

    },
    initialConnect: (state, action) => {
      console.log('initialConnect: ', current(state));
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
      console.log('initialConnect: state end', current(state));

    },
    setPort: (state, action) => {
      console.log('setPort: ', current(state));
      console.log('ACTION', action);

      state.port = action.payload;

      console.log('setPort: state end', current(state));

    },
    setTab: (state, action) => {
      console.log('setTab: ', current(state));
      const { tabs, currentTab } = state;
      const {mode} = tabs[currentTab] || {};

      if (!mode?.paused) {
        if (typeof action.payload === 'number') {
          state.currentTab = action.payload;
        } else if (typeof action.payload === 'object') {
          state.currentTab = action.payload.tabId;
          if (action.payload?.title)
            state.currentTitle = action.payload.title;
        };
      }
      console.log('setTab: state end', current(state));

    },
    deleteTab: (state, action) => {
      console.log('deleteTab: ', current(state));
      delete state.tabs[action.payload];
      console.log('deleteTab: state end', current(state));

    },
    noDev: (state, action) => {
      console.log('noDev: ', current(state));
      const { payload } = action;
      const {tabs, currentTab} = state;
      if (tabs[currentTab]) {
        const { reactDevToolsInstalled } = payload[currentTab].status;
        tabs[currentTab].status.reactDevToolsInstalled = reactDevToolsInstalled
      }
      console.log('noDev: state end', current(state));

    },
    setCurrentLocation: (state, action) => {
      console.log('setCurrentLocation: ', current(state));
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
      console.log('setCurrentLocation: state end', current(state));

    },
    changeView: (state, action) => {
      console.log('changeView: ', current(state));

      const {tabs, currentTab} = state;
      const {viewIndex} = tabs[currentTab] || {};

      tabs[currentTab].viewIndex = viewIndex === action.payload ? -1 : action.payload;
      console.log('changeView: state end', current(state));

    },
    changeSlider: (state, action) => {
      console.log('changeSlider: ', current(state));
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
      console.log('changeSlider: state end', current(state));

    },
    setCurrentTabInApp: (state, action) => {
      console.log('setCurrentTabInApp: ', current(state));
      state.currentTabInApp = action.payload;
      console.log('setCurrentTabInApp: state end', current(state));

    },
    pause: (state) => {
      console.log('pause: ', current(state));

      const {tabs, currentTab} = state
      const {intervalId} = tabs[currentTab] || {};

      clearInterval(intervalId);
      tabs[currentTab].playing = false;
      tabs[currentTab].intervalId = null;
      console.log('pause: state end', current(state));

    },
    launchContentScript: (state, action) => {
      console.log('launchContentScript: ', current(state));

      const { tabs, currentTab, port } = state;

      // Fired when user clicks launch button on the error page. Send msg to background to launch
      port.postMessage({
        action: 'launchContentScript',
        payload: action.payload,
        tabId: currentTab,
      });
      console.log('launchContentScript: state end', current(state));

    },
    playForward: (state, action) => {
      console.log('playForward: ', current(state));

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
      console.log('playForward: state end', current(state));

    },
    startPlaying : (state, action) => {
      console.log('startPlaying: ', current(state));

      const {tabs, currentTab} = state
      tabs[currentTab].playing = true;
      tabs[currentTab].intervalId = action.payload;
      console.log('startPlaying: state end', current(state));

    },
    moveForward: (state, action) => {
      console.log('moveForward: ', current(state));

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
      console.log('moveForward: state end', current(state));

    },
    moveBackward : (state, action) => {
      console.log('moveBackward: ', current(state));

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
      console.log('moveBackward: state end', current(state));

    },

    resetSlider: (state) => {
      console.log('resetSlider: ', current(state));

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
        console.log('resetSlider: state end', current(state));


    },
    toggleMode: (state, action)=>{
      console.log('Toggle Mode: ', current(state));

      const { port, tabs, currentTab } = state;
      const {mode} = tabs[currentTab] || {};
      mode[action.payload] = !mode[action.payload];
        const newMode = mode[action.payload];
        let actionText;
        switch (action.payload) {
          case 'paused':
            actionText = 'setPause';
          default:
        }
        port.postMessage({
          action: actionText,
          payload: newMode,
          tabId: currentTab,
        });
        console.log('Toggle Mode: state end', current(state));


    },
    importSnapshots: (state, action) => {
      console.log('importSnapshots: ', current(state));

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
      console.log('importSnapshots: state end', current(state));

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
        }
        // Runs if series name input box is active.
        // Updates chrome local storage with the newly saved series. Console logging the seriesArray grabbed from local storage may be helpful.
        if (tabs[currentTab].seriesSavedStatus === 'inputBoxOpen') {
          //Set a type for seriesArray 10/04/2023
          let seriesArray: any = localStorage.getItem('project');
          seriesArray = seriesArray === null ? [] : JSON.parse(seriesArray);
          newSeries.name = newSeriesName;
          seriesArray.push(newSeries);
          localStorage.setItem('project', JSON.stringify(seriesArray));
          tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: 'saved' };
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
      console.log('disconnected: ', current(state));
      state.connectionStatus = false;
      // state.port = initialState.port;
      console.log('disconnected: state end', current(state));
    },
    startReconnect: (state) => {
      console.log('startReconnect: ', current(state));
      state.reconnectRequested = true;
      state.port = initialState.port;
      console.log('startReconnect: state end', current(state));
    },
    endReconnect: (state) => {
      console.log('startReconnect: ', current(state));
      state.reconnectRequested = false;
      state.connectionStatus = true;
      console.log('startReconnect: state end', current(state));
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


// // emptySnapshots, changeView, changeSlider
// export const actionContainerSlice = createSlice({
//   name: 'containerSlice',
//   initialState: initialState,
//   reducers: {
//     emptySnapshots: (state, action) => {
      
//     },
//     changeView: (state, action) => {

//     },
//     changeSlider: (state, action) => {

//     }
//   }
// });


/*
export const mainContainerSlice = createSlice({
  name: 'mainContainer',
  initialState: initialState,
  reducers: {
    addNewSnapshots: (state, action) => {
      console.log('addNewSnapshots: ', state);
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
      console.log('initialConnect: ', current(state));
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
      console.log('setPort: ', current(state));
      console.log('ACTION', action);

      state.port = action.payload;
    },

    setTab: (state, action) => {
      console.log('setTab: ', current(state));
      const { tabs, currentTab } = state;
      const {mode} = tabs[currentTab] || {};

      if (!mode?.paused) {
        if (typeof action.payload === 'number') {
          state.currentTab = action.payload;
        } else if (typeof action.payload === 'object') {
          state.currentTab = action.payload.tabId;
          if (action.payload?.title)
            state.currentTitle = action.payload.title;
        };
      }
    },

    deleteTab : (state, action) => {
      console.log('deleteTab: ', current(state));
      delete state.tabs[action.payload];
    },


    noDev: (state, action) => {
      console.log('noDev: ', current(state));
      const { payload } = action;
      const {tabs, currentTab} = state;
      if (tabs[currentTab]) {
        const { reactDevToolsInstalled } = payload[currentTab].status;
        tabs[currentTab].status.reactDevToolsInstalled = reactDevToolsInstalled
      }
    },
    
    setCurrentLocation: (state, action) => {
      console.log('setCurrentLocation: ', current(state));
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
      console.log('CHANGE SLIDER');
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
      console.log('SET CURRENT TAB IN APP');
      state.currentTabInApp = action.payload;
    },

    pause: (state, action) => {
      console.log('pause: ', current(state));

      const {tabs, currentTab} = state
      const {intervalId} = tabs[currentTab] || {};

      clearInterval(intervalId);
      tabs[currentTab].playing = false;
      tabs[currentTab].intervalId = null;

      
    },
  },
});
*/

// export const historySlice = createSlice({
//   name: 'history',
//   initialState: initialState,
//   reducers: {
//     changeView: (state, action) => {
//       const {tabs, currentTab} = state;
//       const {viewIndex} = tabs[currentTab] || {};

//       tabs[currentTab].viewIndex = viewIndex === action.payload ? -1 : action.payload;
//     },
//     changeSlider: (state, action) => {
//       console.log('CHANGE SLIDER');
//       const { port, currentTab, tabs } = state;
//       const { hierarchy, snapshots } = tabs[currentTab] || {};

//       const nameFromIndex = findName(action.payload, hierarchy);

//       port.postMessage({
//         action: 'jumpToSnap',
//         payload: snapshots[action.payload],
//         index: action.payload,
//         name: nameFromIndex,
//         tabId: currentTab,
//       });
      
//       tabs[currentTab].sliderIndex = action.payload;
//     },
//     setCurrentTabInApp: (state, action) => {
//       console.log('SET CURRENT TAB IN APP');
//       state.currentTabInApp = action.payload;
//     },
//   },
// });



// export const {
//   addNewSnapshots,
//   initialConnect,
//   setPort,
//   setTab,
//   deleteTab,
//   noDev,
//   setCurrentLocation,
//   pause} = mainContainerSlice.actions;

// export const { changeView, changeSlider, setCurrentTabInApp } = historySlice.actions;



