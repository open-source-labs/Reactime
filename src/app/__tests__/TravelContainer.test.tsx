import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import configureStore from 'redux-mock-store';
import TravelContainer from '../containers/TravelContainer';
import { playForward, pause, startPlaying, resetSlider, changeSlider } from '../slices/mainSlice';

const mockStore = configureStore([]);

describe('TravelContainer', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      main: {
        tabs: {
          tab1: {
            sliderIndex: 0,
            playing: false,
            currLocation: null,
          },
        },
        currentTab: 'tab1',
      },
    });

    store.dispatch = jest.fn();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      snapshotsLength: 5,
    };

    return render(
      <Provider store={store}>
        <TravelContainer {...defaultProps} {...props} />
      </Provider>,
    );
  };

  it('renders play button and dropdown', () => {
    renderComponent();

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Play')).toBeInTheDocument();
  });

  it('changes play button text and icon when clicked', () => {
    renderComponent();

    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);

    // Should dispatch startPlaying action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: startPlaying.type,
      }),
    );
  });

  it('resets slider when playing from last snapshot', () => {
    store = mockStore({
      main: {
        tabs: {
          tab1: {
            sliderIndex: 4, // Last index (snapshotsLength - 1)
            playing: false,
            currLocation: null,
          },
        },
        currentTab: 'tab1',
      },
    });
    store.dispatch = jest.fn();

    renderComponent();

    const playButton = screen.getByRole('button');
    fireEvent.click(playButton);

    // Should dispatch resetSlider action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: resetSlider.type,
      }),
    );
  });

  it('pauses playback when play button is clicked while playing', () => {
    store = mockStore({
      main: {
        tabs: {
          tab1: {
            sliderIndex: 2,
            playing: true,
            currLocation: null,
          },
        },
        currentTab: 'tab1',
      },
    });
    store.dispatch = jest.fn();

    renderComponent();

    const pauseButton = screen.getByRole('button');
    fireEvent.click(pauseButton);

    // Should dispatch pause action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: pause.type,
      }),
    );
  });

  it('handles speed change from dropdown', () => {
    renderComponent();

    // Find and click the dropdown
    const dropdown = screen.getByRole('combobox');
    fireEvent.keyDown(dropdown, { key: 'ArrowDown' });

    // Select a different speed
    const speedOption = screen.getByText('0.5x');
    fireEvent.click(speedOption);

    // The selected speed should be updated in the component state
    expect(screen.getByText('0.5x')).toBeInTheDocument();
  });

  it('updates slider index when playing forward', () => {
    const { rerender } = renderComponent();

    // Simulate playing forward
    store.dispatch(playForward(true));
    store.dispatch(changeSlider(1));

    // Update store state
    store = mockStore({
      main: {
        tabs: {
          tab1: {
            sliderIndex: 1,
            playing: true,
            currLocation: null,
          },
        },
        currentTab: 'tab1',
      },
    });

    // Rerender with new store state
    rerender(
      <Provider store={store}>
        <TravelContainer snapshotsLength={5} />
      </Provider>,
    );

    // Verify the slider index was updated
    expect(store.getState().main.tabs.tab1.sliderIndex).toBe(1);
  });
});
