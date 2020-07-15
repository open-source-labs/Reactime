import { combineReducers } from 'redux';

import coreReducer from './coreReducer';

const reducers = combineReducers({
  core: coreReducer
});

export default reducers;
