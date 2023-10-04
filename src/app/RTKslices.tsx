import { createSlice } from '@reduxjs/toolkit';
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

export const historySlice = createSlice({
  name: 'history',
  initialState: initialState,
  reducers: {
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
  },
});



export const { changeView, changeSlider, setCurrentTabInApp } = historySlice.actions;
