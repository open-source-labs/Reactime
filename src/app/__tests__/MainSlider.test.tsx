import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainSlider from '../components/TimeTravel/MainSlider';
import { mainSlice } from '../slices/mainSlice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const customTabs = {
  100: {
    sliderIndex: 1,
  },
};

const customInitialState = {
  main: {
    port: null,
    currentTab: 100,
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
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const render = (component) => rtlRender(<Provider store={customStore}>{component}</Provider>);

describe('Unit testing for MainSlider.jsx', () => {
  const props = {
    snapshotsLength: 1,
  };

  describe('When user only has one snapshot to view', () => {
    test('Component should have min, max, value with correct values to indicate slider position for correct tab', () => {
      render(<MainSlider {...props} />);
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemin', '0');
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '0');
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('When there are multiple snapshots and we are looking in between', () => {
    const props = {
      snapshotsLength: 3,
    };

    test('Component should have min, max, value with correct values to indicate slider position when there are multiple snapshots', () => {
      render(<MainSlider {...props} />);
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '2');
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemin', '0');
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0');
    });
  });
});
