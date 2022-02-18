/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as types from '../constants/actionTypes';

export const save = (tabsObj) => ({
  type: types.SAVE,
  payload: tabsObj,
});
export const deleteSeries = () => ({
  type: types.DELETE_SERIES,
})
export const toggleMode = (mode) => ({
  type: types.TOGGLE_MODE,
  payload: mode,
});

export const addNewSnapshots = (tabsObj) => ({
  type: types.NEW_SNAPSHOTS,
  payload: tabsObj,
});

export const initialConnect = (tabsObj) => ({
  type: types.INITIAL_CONNECT,
  payload: tabsObj,
});

export const setPort = (port) => ({
  type: types.SET_PORT,
  payload: port,
});

export const emptySnapshots = () => ({
  type: types.EMPTY,
});

export const changeView = (index) => ({
  type: types.CHANGE_VIEW,
  payload: index,
});

export const changeSlider = (index) => ({
  type: types.CHANGE_SLIDER,
  payload: index,
});

export const moveBackward = () => ({
  type: types.MOVE_BACKWARD,
  payload: false,
});

export const moveForward = () => ({
  type: types.MOVE_FORWARD,
  payload: false,
});

export const playForward = () => ({
  type: types.MOVE_FORWARD,
  payload: true,
});

export const pause = () => ({
  type: types.PAUSE,
});

export const startPlaying = (intervalId) => ({
  type: types.PLAY,
  payload: intervalId,
});

export const importSnapshots = (newSnaps) => ({
  type: types.IMPORT,
  payload: newSnaps,
});

export const setTab = (tab) => ({
  type: types.SET_TAB,
  payload: tab,
});

export const deleteTab = (tab) => ({
  type: types.DELETE_TAB,
  payload: tab,
});

export const noDev = (tab) => ({
  type: types.NO_DEV,
  payload: tab,
});

export const launchContentScript = (tab) => ({
  type: types.LAUNCH_CONTENT,
  payload: tab,
});

export const resetSlider = () => ({
  type: types.SLIDER_ZERO,
});

export const onHover = (rtid) => ({
  type: types.ON_HOVER,
  //the payload should be something to relate the component we're hovering and highlight that component on the DOM
  payload: rtid,
});

export const onHoverExit = (rtid) => ({
  type: types.ON_HOVER_EXIT,
  payload: rtid,
});

export const setCurrentLocation = (tabsObj) => ({
  type: types.SET_CURRENT_LOCATION,
  payload: tabsObj,
})
