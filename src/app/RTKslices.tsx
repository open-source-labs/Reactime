import { createSlice, current } from '@reduxjs/toolkit';
import { InitialStateProps } from './FrontendTypes';

const initialState: InitialStateProps = { // we initialize what our initialState is here
    port: null,
    currentTab: null,
    currentTitle: 'No Target',
    tabs: {},
    currentTabInApp: null,
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
      const { tabs, currentTab } = state;
      const { port } = tabs[currentTab] || {};

      port.portMessage({ action: 'emptySnap', tabId: currentTab });

      tabs[currentTab].sliderIndex = 0;
      tabs[currentTab].viewIndex = 0;
      tabs[currentTab].playing = false;

      const lastSnapshot = tabs[currentTab].snapshots[tabs[currentTab].snapshots.length - 1];

      tabs[currentTab].hiearchy.stateSnaphot = { ...lastSnapshot };
      tabs[currentTab].hierarchy.children = [];
      tabs[currentTab].snapshots = [lastSnapshot];

      tabs[currentTab].currLocation = tabs[currentTab].hiearchy;
      tabs[currentTab].index = 1;
      tabs[currentTab].currParent = 0;
      tabs[currentTab].currBranch = 1;
      tabs[currentTab].seriesSavedStatus = false;
    },
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
    pause: (state) => {
      console.log('pause: ', current(state));

      const {tabs, currentTab} = state
      const {intervalId} = tabs[currentTab] || {};

      clearInterval(intervalId);
      tabs[currentTab].playing = false;
      tabs[currentTab].intervalId = null;
    },
    launchContentScript: (state, action) => {
      console.log('launchContentScript: ', current(state));

      const { tabs, currentTab } = state;
      const { port } = tabs[currentTab] || {};

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
      console.log('Toggle Mode')
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
    },
    importSnapshots: (state, action) => {
      console.log('importSnapshots')
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
  tutorialSaveSeriesToggle
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



