import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainSlider from '../components/MainSlider';
import { mainSlice } from '../RTKslices'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';


const customTabs = {
    100: {
        sliderIndex: 1,
      },
  }


const customInitialState = {
    main: {
      port: null,
      currentTab: 87, 
      currentTitle: null,
      tabs: customTabs, // Replace with the actual (testing) tab data
      currentTabInApp: null,
      connectionStatus: false,
      connectRequested: true,
    },
  };

const customStore = configureStore({
    reducer: {
      main: mainSlice.reducer,
    },
    preloadedState: customInitialState, 
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

const render = component => rtlRender(
    <Provider store={customStore}>
      {component}
    </Provider>
);

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'), // Use the actual react-redux module except for the functions you want to mock
    useDispatch: jest.fn(), // set up a mock function for useDispatch
  }));