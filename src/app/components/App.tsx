import React, { useReducer } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import MainContainer from '../containers/MainContainer';
import { StoreContext } from '../store';
import mainReducer from '../reducers/mainReducer.js';
import { InitialStateProps } from '../FrontendTypes';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
// currentTab is the current active tab within Google Chrome.
// This is used to decide what tab Reactime should be monitoring. This can be "locked"
// currentTabInApp is the current active tab within Reactime (Map, Performance, History, etc).
// This is used to determine the proper tutorial to render when How To button is pressed.

// we initialize what our initialState is here
const initialState: InitialStateProps = {
  port: null,
  currentTab: null,
  currentTitle: 'No Target',
  tabs: {},
  currentTabInApp: null,
};

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
    <Router> {/* we wrap our application with the <Router> tag so that all components that are nested will have the react-router context */}
      <StoreContext.Provider value={useReducer(mainReducer, initialState)}> {/* we wrap our MainContainer with the provider so that we will be able to use the store context. We create our store by using useReducer and passing it into the value property */}
        <MainContainer />
      </StoreContext.Provider>
    </Router>
    </ThemeProvider>
  );
}

export default App;
