import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
import MainSlider from '../components/MainSlider';
import { useStoreContext } from '../store';

jest.mock('../store');
const mockeduseStoreContext = jest.mocked(useStoreContext);

describe('Unit testing for MainSlider.jsx', () => {
  const props = {
    snapshotsLength: 1,
  };

  const state = {
    tabs: {
      100: {
        sliderIndex: 1,
      },
    },
    currentTab: 100,
  };

  const dispatch = jest.fn();
  mockeduseStoreContext.mockImplementation(() => [state, dispatch]);

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
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow','0')
    });
  });
});
