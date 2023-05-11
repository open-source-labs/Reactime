import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import ButtonsContainer from '../containers/ButtonsContainer';
import { useStoreContext } from '../store';

jest.mock('../store');

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

  useStoreContext.mockImplementation(() => [state, dispatch]);

  beforeEach(() => {
    dispatch.mockClear();
    useStoreContext.mockClear();
    currentTab.mode = {
      paused: false,
      persist: false,
    };
  });

  test('should have 5 buttons ', () => {
    render(<ButtonsContainer />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
    expect(screen.getAllByRole('button')[0]).toHaveTextContent('Lock');
    expect(screen.getAllByRole('button')[1]).toHaveTextContent('Split');
    expect(screen.getAllByRole('button')[2]).toHaveTextContent('Download');
    expect(screen.getAllByRole('button')[3]).toHaveTextContent('Upload');
    expect(screen.getAllByRole('button')[4]).toHaveTextContent('How to use');
  });

  describe('When view is unlock', () => {
    test('Button should show as unlocked', () => {
      state.tabs['87'].mode.paused = true;
      render(<ButtonsContainer />);
      expect(screen.getAllByRole('button')[0]).toHaveTextContent('Unlock');
    });
  });
});
