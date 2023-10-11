// import { produce } from 'immer';
// import _, { values } from 'lodash';
// import * as types from '../constants/actionTypes.ts';

// export default (state, action) =>
//   produce(state, (draft) => {
//     const { port, currentTab, tabs } = draft;
//     const { hierarchy, snapshots, mode, intervalId, viewIndex, sliderIndex } =
//       tabs[currentTab] || {};
//     // eslint-disable-next-line consistent-return
//     const findName = (index, obj) => {
//       // eslint-disable-next-line eqeqeq
//       if (obj && obj.index == index) {
//         return obj.name;
//       }
//       const objChildArray = [];
//       if (obj) {
//         // eslint-disable-next-line no-restricted-syntax
//         for (const objChild of obj.children) {
//           objChildArray.push(findName(index, objChild));
//         }
//       }
//       // eslint-disable-next-line no-restricted-syntax
//       for (const objChildName of objChildArray) {
//         if (objChildName) {
//           return objChildName;
//         }
//       }
//     };

//     switch (action.type) {
//       // This saves the series user wants to save to chrome local storage
//       case types.SAVE: {
//         const { newSeries, newSeriesName } = action.payload;
//         if (!tabs[currentTab].seriesSavedStatus) {
//           tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: 'inputBoxOpen' };
//           break;
//         }
//         // Runs if series name input box is active.
//         // Updates chrome local storage with the newly saved series. Console logging the seriesArray grabbed from local storage may be helpful.
//         if (tabs[currentTab].seriesSavedStatus === 'inputBoxOpen') {
//           let seriesArray = localStorage.getItem('project');
//           seriesArray = seriesArray === null ? [] : JSON.parse(seriesArray);
//           newSeries.name = newSeriesName;
//           seriesArray.push(newSeries);
//           localStorage.setItem('project', JSON.stringify(seriesArray));
//           tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: 'saved' };
//           break;
//         }
//         break;
//       }

//       // Delete case will delete ALL stored series in chrome local storage. To see  chrome storage related data
//       // Chrome Extension Manager (chrome:extensions) --> background page link --> Application Tab
//       case types.DELETE_SERIES: {
//         const allStorage = () => {
//           const keys = Object.keys(localStorage);
//           let i = keys.length;
//           while (i--) {
//             localStorage.removeItem(keys[i]);
//           }
//         };
//         allStorage();
//         Object.keys(tabs).forEach((tab) => {
//           tabs[tab] = {
//             ...tabs[tab],
//           };
//         });
//         tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: false };
//         break;
//       }

//       case types.ON_HOVER_EXIT: {
//         port.postMessage({
//           action: 'onHoverExit',
//           payload: action.payload,
//           tabId: currentTab,
//         });
//         break;
//       }

//       case types.ON_HOVER: {
//         port.postMessage({
//           action: 'onHover',
//           payload: action.payload,
//           tabId: currentTab,
//         });
//         break;
//       }

//       case types.MOVE_BACKWARD: {
//         if (sliderIndex > 0) {
//           const newIndex = sliderIndex - 1;
//           // eslint-disable-next-line max-len
//           // finds the name by the newIndex parsing through the hierarchy to send to background.js the current name in the jump action
//           const nameFromIndex = findName(newIndex, hierarchy);

//           port.postMessage({
//             action: 'jumpToSnap',
//             payload: snapshots[newIndex],
//             index: newIndex,
//             name: nameFromIndex,
//             tabId: currentTab,
//             newProp: 'newPropFromReducer',
//           });
//           clearInterval(intervalId);

//           tabs[currentTab].sliderIndex = newIndex;
//           tabs[currentTab].playing = false;
//         }
//         break;
//       }

//       case types.MOVE_FORWARD: {
//         if (sliderIndex < snapshots.length - 1) {
//           const newIndex = sliderIndex + 1;
//           // eslint-disable-next-line max-len
//           // finds the name by the newIndex parsing through the hierarchy to send to background.js the current name in the jump action
//           const nameFromIndex = findName(newIndex, hierarchy);

//           port.postMessage({
//             action: 'jumpToSnap',
//             payload: snapshots[newIndex],
//             index: newIndex,
//             name: nameFromIndex,
//             tabId: currentTab,
//           });

//           tabs[currentTab].sliderIndex = newIndex;

//           // message is coming from the user
//           if (!action.payload) {
//             clearInterval(intervalId);
//             tabs[currentTab].playing = false;
//           }
//         }
//         break;
//       }

//       case types.SLIDER_ZERO: {
//         // eslint-disable-next-line max-len
//         // resets name to 0 to send to background.js the current name in the jump action
//         port.postMessage({
//           action: 'jumpToSnap',
//           index: 0,
//           name: 0,
//           payload: snapshots[0],
//           tabId: currentTab,
//         });
//         tabs[currentTab].sliderIndex = 0;
//         break;
//       }

    //   case types.CHANGE_VIEW: {
    //     // unselect view if same index was selected
    //     // console.log('action:', action)
    //     // console.log('state: ', state)
    //     if (viewIndex === action.payload) tabs[currentTab].viewIndex = -1;
    //     else tabs[currentTab].viewIndex = action.payload;
    //     // update currLocation
    //     // tabs[currentTab].currLocation = tabs[currentTab].hierarchy;
    //     break;
    //   }

//       case types.CHANGE_SLIDER: {
//         // eslint-disable-next-line max-len
//         // finds the name by the action.payload parsing through the hierarchy to send to background.js the current name in the jump action
//         const nameFromIndex = findName(action.payload, hierarchy);
//         // nameFromIndex is a number based on which jump button is pushed

//         port.postMessage({
//           action: 'jumpToSnap',
//           payload: snapshots[action.payload],
//           index: action.payload,
//           name: nameFromIndex,
//           tabId: currentTab,
//         });
//         tabs[currentTab].sliderIndex = action.payload;
//         break;
//       }

//       case types.EMPTY: {
//         port.postMessage({ action: 'emptySnap', tabId: currentTab }); //communicate with background.js (service worker)

//         // properties associated with timetravel + seek bar
//         tabs[currentTab].sliderIndex = 0;
//         tabs[currentTab].viewIndex = 0;
//         tabs[currentTab].playing = false;

//         const lastSnapshot = tabs[currentTab].snapshots[tabs[currentTab].snapshots.length - 1]; // the most recent snapshot
//         tabs[currentTab].hierarchy.stateSnapshot = { ...lastSnapshot }; // resets hierarchy to page last state recorded
//         tabs[currentTab].hierarchy.children = []; // resets hierarchy
//         tabs[currentTab].snapshots = [lastSnapshot]; // resets snapshots to page last state recorded

//         // resets currLocation to page last state recorded
//         tabs[currentTab].currLocation = tabs[currentTab].hierarchy;
//         tabs[currentTab].index = 1;
//         tabs[currentTab].currParent = 0;
//         tabs[currentTab].currBranch = 1;
//         tabs[currentTab].seriesSavedStatus = false;
//         break;
//       }

//       case types.SET_PORT: {
//         draft.port = action.payload;
//         break;
//       }

//       case types.IMPORT: {
//         // Log the value of tabs[currentTab].snapshots before the update
//         port.postMessage({
//           action: 'import',
//           payload: action.payload,
//           tabId: currentTab,
//         });

//         const savedSnapshot = action.payload;

//         tabs[currentTab].sliderIndex = savedSnapshot.sliderIndex;
//         tabs[currentTab].viewIndex = savedSnapshot.viewIndex;
//         tabs[currentTab].playing = false;

//         // resets hierarchy to page last state recorded
//         tabs[currentTab].hierarchy.stateSnapshot = savedSnapshot.hierarchy.stateSnapshot;

//         // resets hierarchy
//         tabs[currentTab].hierarchy.children = savedSnapshot.hierarchy.children;

//         // resets snapshots to page last state recorded
//         tabs[currentTab].snapshots = savedSnapshot.snapshots;

//         // resets currLocation to page last state recorded
//         tabs[currentTab].currLocation = tabs[currentTab].hierarchy;
//         tabs[currentTab].index = savedSnapshot.index;
//         tabs[currentTab].currParent = savedSnapshot.currParent;
//         tabs[currentTab].currBranch = savedSnapshot.Branch;
//         tabs[currentTab].seriesSavedStatus = false;
//         break;
//       }
//       case types.TOGGLE_MODE: {
//         mode[action.payload] = !mode[action.payload];
//         const newMode = mode[action.payload];
//         let actionText;
//         switch (action.payload) {
//           case 'paused':
//             actionText = 'setPause';
//             break;
//           default:
//             break;
//         }
//         port.postMessage({
//           action: actionText,
//           payload: newMode,
//           tabId: currentTab,
//         });
//         break;
//       }
//       case types.PAUSE: {
//         clearInterval(intervalId);
//         tabs[currentTab].playing = false;
//         tabs[currentTab].intervalId = null;
//         break;
//       }
//       case types.PLAY: {
//         tabs[currentTab].playing = true;
//         tabs[currentTab].intervalId = action.payload;
//         break;
//       }
//       case types.INITIAL_CONNECT: {
//         const { payload } = action;
//         Object.keys(payload).forEach((tab) => {
//           // check if tab exists in memory
//           // add new tab
//           tabs[tab] = {
//             ...payload[tab],
//             sliderIndex: 0,
//             viewIndex: -1,
//             intervalId: null,
//             playing: false,
//           };
//         });

//         // only set first tab if current tab is non existent
//         const firstTab = parseInt(Object.keys(payload)[0], 10);
//         if (currentTab === undefined || currentTab === null) draft.currentTab = firstTab;
//         break;
//       }
//       case types.NEW_SNAPSHOTS: {
//         const { payload } = action;
//         Object.keys(tabs).forEach((tab) => {
//           if (!payload[tab]) {
//             delete tabs[tab];
//           } else {
//             // maintain isExpaned prop from old stateSnapshot to preserve componentMap expansion
//             const persistIsExpanded = (newNode, oldNode) => {
//               newNode.isExpanded = oldNode ? oldNode.isExpanded : true;
//               if (newNode.children) {
//                 newNode.children.forEach((child, i) => {
//                   persistIsExpanded(child, oldNode?.children[i]);
//                 });
//               }
//             };
//             persistIsExpanded(
//               payload[tab].currLocation.stateSnapshot,
//               tabs[tab].currLocation.stateSnapshot,
//             );

//             const { snapshots: newSnaps } = payload[tab];
//             tabs[tab] = {
//               ...payload[tab],
//               sliderIndex: newSnaps.length - 1,
//               seriesSavedStatus: false,
//             };
//           }
//         });

//         // only set first tab if current tab is non existent
//         const firstTab = parseInt(Object.keys(payload)[0], 10);
//         if (currentTab === undefined || currentTab === null) draft.currentTab = firstTab;
//         break;
//       }
//       case types.SET_TAB: {
//         if (!mode?.paused) {
//           if (typeof action.payload === 'number') {
//             draft.currentTab = action.payload;
//             break;
//           } else if (typeof action.payload === 'object') {
//             draft.currentTab = action.payload.tabId;
//             if (action.payload?.title) draft.currentTitle = action.payload.title;
//             break;
//           }
//         }
//         break;
//       }

//       case types.DELETE_TAB: {
//         delete draft.tabs[action.payload];
//         break;
//       }

//       case types.LAUNCH_CONTENT: {
//         // Fired when user clicks launch button on the error page. Send msg to background to launch
//         port.postMessage({
//           action: 'launchContentScript',
//           payload: action.payload,
//           tabId: currentTab,
//         });
//         break;
//       }

//       case types.NO_DEV: {
//         const { payload } = action;
//         if (tabs[currentTab]) {
//           const { reactDevToolsInstalled } = payload[currentTab].status;
//           tabs[currentTab].status.reactDevToolsInstalled = reactDevToolsInstalled;
//         }
//         break;
//       }

//       case types.TOGGLE_EXPANDED: {
//         // find correct node from currLocation and toggle isExpanded
//         const checkChildren = (node) => {
//           if (_.isEqual(node, action.payload)) {
//             node.isExpanded = !node.isExpanded;
//             return;
//           }
//           if (node.children) {
//             node.children.forEach((child) => {
//               checkChildren(child);
//             });
//           }
//         };
//         checkChildren(tabs[currentTab].currLocation.stateSnapshot);
//         break;
//       }

//       case types.SET_CURRENT_LOCATION: {
//         const { payload } = action;
//         const persistIsExpanded = (newNode, oldNode) => {
//           newNode.isExpanded = oldNode ? oldNode.isExpanded : true;
//           if (newNode.children) {
//             newNode.children.forEach((child, i) => {
//               persistIsExpanded(child, oldNode?.children[i]);
//             });
//           }
//         };
//         persistIsExpanded(
//           payload[currentTab].currLocation.stateSnapshot,
//           tabs[currentTab].currLocation.stateSnapshot,
//         );
//         tabs[currentTab].currLocation = payload[currentTab].currLocation;
//         break;
//       }
      
//       case types.SET_CURRENT_TAB_IN_APP: {
//         draft.currentTabInApp = action.payload;
//         break;
//       }

//       case types.TUTORIAL_SAVE_SERIES_TOGGLE: {
//         tabs[currentTab] = { ...tabs[currentTab], seriesSavedStatus: action.payload }; // sets the tab[currentTab]'s 'seriesSavedStatus' property to the payload.
//         break;
//       }

//       default:
//         throw new Error(`nonexistent action: ${action.type}`);
//     }
//   });
