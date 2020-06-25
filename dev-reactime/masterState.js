/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
// Export two functions that either saves the AST state object into an array
// or returns the array for use
const masterState = [];
const hooksComponentsActions = {};

module.exports = {
  saveState: state => {
    for (const key in state) {
      masterState.push(state[key]);
    }
    return masterState;
  },
  returnState: () => masterState,
  saveHooksComponent: comp => {
    for (const key in comp) {
      hooksComponentsActions[key] = comp[key];
    }
  },
};
