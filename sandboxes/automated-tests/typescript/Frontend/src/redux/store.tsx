import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers/index';

// composeWithDevTools allows for easy access to Redux dev tools
const store = createStore(reducers, composeWithDevTools());

export default store;
