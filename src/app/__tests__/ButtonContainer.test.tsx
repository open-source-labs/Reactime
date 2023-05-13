import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
import ButtonsContainer from '../containers/ButtonsContainer';
import { useStoreContext } from '../store';

// const { Steps } = require('intro.js-react');
jest.mock('../store');

global.URL.createObjectURL = jest.fn(() => 'https://pdf.com');
global.URL.revokeObjectURL = jest.fn();

const fileDownload = {
  href: jest.fn(),
};

const URL = { revokeObjectURL: jest.fn() };
// @ts-ignore
// jest.spyOn(document, 'createElement').mockImplementation(() => fileDownload);

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

  useStoreContext.mockImplementation(() => [state, dispatch]);

  beforeEach(() => {
    dispatch.mockClear();
    useStoreContext.mockClear();
    currentTab.mode = {
      paused: false,
      persist: false,
    };
  });

  describe('When button container is loaded', () => {
    test('should have 5 buttons ', () => {
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')).toHaveLength(5);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Lock');
      expect(screen.getAllByRole('button')[1]).toHaveTextContent('Split');
      expect(screen.getAllByRole('button')[2]).toHaveTextContent('Download');
      expect(screen.getAllByRole('button')[3]).toHaveTextContent('Upload');
      expect(screen.getAllByRole('button')[4]).toHaveTextContent('How to use');
    });
  });

  describe('When view is unlock', () => {
    test('Button should show as unlocked', () => {
      state.tabs['87'].mode.paused = true;
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Unlock');
    });
  });

  describe('Upload/Download', () => {
    test('Clicking upload and download buttons', async () => {
      render(<ButtonsContainer />);
      fireEvent.click(screen.getAllByRole('button')[2]);
      fireEvent.click(screen.getAllByRole('button')[3]);
      expect(screen.getAllByRole('button')[2]).toBeInTheDocument();
      expect(screen.getAllByRole('button')[3]).toBeInTheDocument();
    });
  });
});
