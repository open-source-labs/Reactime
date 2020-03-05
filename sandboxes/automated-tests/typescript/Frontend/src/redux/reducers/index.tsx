import { combineReducers } from 'redux';

import coreReducer from './coreReducer';

//Root Reducer
const reducers = combineReducers({
  core: coreReducer
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
