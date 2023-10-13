import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActionContainer from '../containers/ActionContainer';
import TravelContainer from '../containers/TravelContainer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { store } from '../RTKstore';
import { mainSlice } from '../RTKslices'

//Note for testing:
//typically, jest.mock is commonly used in unit testing to isolate the code under test. 
//In contrast, when performing integration testing of components with a real Redux store, 
//you typically don't need to use jest.mock because you're interested in testing how the real components interact with the actual store. 
//The decision to use jest.mock depends on the type of testing (unit or integration) and your specific testing goals.


const customInitialState = {
    main: {
      port: null,
      currentTab: null,
      currentTitle: 'No Target',
      tabs: {},
      currentTabInApp: null,
      connectionStatus: true,
      reconnectRequested: false,
    },
  };

const customStore = configureStore({
  reducer: {
    main: mainSlice.reducer,
  },
  preloadedState: customInitialState, // Provide custom initial state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const render = component => rtlRender(
    <Provider store={customStore}>
      {component}
    </Provider>
);

describe('Integration testing for ActionContainer.tsx', () => {
    test('renders the ActionContainer component', () => {
        //tests that the clearButton is rendered by testing if we can get "Clear"
        render(<ActionContainer />);
        const clearButton = screen.getByText('Clear'); // Use an existing element
        //need to click the clear button or anything for state to be defined?
        // fireEvent.click()
        expect(clearButton).toBeInTheDocument();
      });
})



