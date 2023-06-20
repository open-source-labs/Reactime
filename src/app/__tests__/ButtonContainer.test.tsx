import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
import ButtonsContainer from '../containers/ButtonsContainer';
import { useStoreContext } from '../store';
import userEvent from '@testing-library/user-event';
import { toggleMode } from '../actions/actions';

// const { Steps } = require('intro.js-react');
jest.mock('../store');
const mockedUsedStoreContext = jest.mocked(useStoreContext);
// useStoreContext as jest.Mock<useStoreContext>.mockImplementaton(() => [state, dispatch])

global.URL.createObjectURL = jest.fn(() => 'https://pdf.com');
global.URL.revokeObjectURL = jest.fn();

describe('Unit testing for ButtonContainer', () => {
  beforeEach;

  const state = {
    tabs: {
      87: {
        snapshots: [1, 2, 3, 4],
        sliderIndex: 0,
        viewIndex: -1,
        mode: {
          paused: false,
          locked: false,
          persist: false,
        },
      },
    },
    currentTab: 87,
  };

  const currentTab = state.tabs[state.currentTab];
  const dispatch = jest.fn();
  const exportHandler = jest.fn().mockImplementation(() => 'clicked');
  const importHandler = jest.fn();
  const fileDownload = jest.fn();

  mockedUsedStoreContext.mockImplementation(() => [state, dispatch]);
  // useStoreContext.mockImplementation(() => [state, dispatch]);

  beforeEach(() => {
    dispatch.mockClear();
    mockedUsedStoreContext.mockClear();
    currentTab.mode = {
      paused: false,
      persist: false,
    };
  });

  describe('When button container is loaded', () => {
    test('should have 4 buttons ', () => {
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')).toHaveLength(4);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Unlocked');
      expect(screen.getAllByRole('button')[1]).toHaveTextContent('Download');
      expect(screen.getAllByRole('button')[2]).toHaveTextContent('Upload');
      expect(screen.getAllByRole('button')[3]).toHaveTextContent('Tutorial');
    });
  });

  describe('When view is unlock', () => {
    test('Button should show as unlocked', () => {
      state.tabs['87'].mode.paused = true;
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Locked');
    });
  });

  describe('When view is lock', () => {
    test('Button should show as locked', () => {
      state.tabs['87'].mode.paused = false;
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Unlocked');
    });
  });

  describe('Clicking pause-button toggles locked/unlocked', () => {
    test('When button is unlocked and it is clicked', async () => {
      render(<ButtonsContainer />);
      const button = screen.getAllByRole('button')[0];
      await userEvent.click(button);
      expect(dispatch).toHaveBeenCalledWith(toggleMode('paused'));
    });
  });


  describe('Upload/Download', () => {
    test('Clicking upload and download buttons', async () => {
      render(<ButtonsContainer />);
      fireEvent.click(screen.getAllByRole('button')[1]);
      fireEvent.click(screen.getAllByRole('button')[2]);
      expect(screen.getAllByRole('button')[1]).toBeInTheDocument();
      expect(screen.getAllByRole('button')[2]).toBeInTheDocument();
    });
  });
});
