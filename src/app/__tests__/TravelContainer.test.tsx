import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import TravelContainer from '../containers/TravelContainer';
import { useStoreContext } from '../store';

const state = {
  tabs: {
    87: {
      snapshots: [0, 1, 2, 3], // because snapshot index starts at 0
      sliderIndex: 3,
      playing: false,
    },
  },
  currentTab: 87,
};

const play = jest.fn();
const dispatch = jest.fn();
useStoreContext.mockImplementation(() => [state, dispatch]);

jest.mock('../store');

const mockSlider = jest.fn();
jest.mock('../components/MainSlider', () => (props) => {
  mockSlider(props);
  return <div>MockSlider</div>;
});

const mockDropDown = jest.fn();
jest.mock('../components/Dropdown', () => (props) => {
  mockDropDown(props);
  return <div>mockDropDown</div>;
});

describe('All elements appear in the TravelContainer module', () => {
  beforeEach(() => {
    dispatch.mockClear();
    render(<TravelContainer snapshotsLength={0} />);
  });

  test('first button contains text Play', () => {
    let buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Play');
  });

  test('MainSlider exists in document', () => {
    expect(screen.getByText('MockSlider')).toBeInTheDocument();
  });
  test('Dropdown exists in document', () => {
    expect(screen.getByText('mockDropDown')).toBeInTheDocument();
  });

  test('Backward button exists in document', () => {
    let buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveTextContent('<');
  });

  test('Foward button exists in document', () => {
    let buttons = screen.getAllByRole('button');
    expect(buttons[2]).toHaveTextContent('>');
  });
});

describe('Testing backward and forward button', () => {
  beforeEach(() => {
    dispatch.mockClear();
    render(<TravelContainer snapshotsLength={0} />);
  });

  test('Clicking < Button button will triger button', async () => {
    let buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveTextContent('<');
    fireEvent.click(buttons[1]);
    await expect(dispatch).toHaveBeenCalledTimes(1);
  });

  test('Clicking > Button button will triger button', async () => {
    let buttons = screen.getAllByRole('button');
    expect(buttons[2]).toHaveTextContent('>');
    fireEvent.click(buttons[2]);
    await expect(dispatch).toHaveBeenCalledTimes(1);
  });
});

describe('Testing play/pause button', () => {
  beforeEach(() => {
    dispatch.mockClear();
  });

  test('Play button is rendered', () => {
    render(<TravelContainer snapshotsLength={0} />);
    const playButton = screen.getByTestId('play-button-test');
    expect(playButton).toBeInTheDocument();
  });
  test('Play initially says Play', () => {
    render(<TravelContainer snapshotsLength={0} />);
    const playButton = screen.getByTestId('play-button-test');
    expect(playButton.textContent).toBe('Play');
  });

  test('Clicking Play button will triger button', async () => {
    render(<TravelContainer snapshotsLength={0} />);
    const playButton = screen.getByTestId('play-button-test');
    expect(playButton.textContent).toBe('Play');
    fireEvent.click(playButton);
    await expect(dispatch).toHaveBeenCalledTimes(1);
  });

  test('Play says Pause when `Playing` is set to False', () => {
    state.tabs[87].playing = true;
    render(<TravelContainer snapshotsLength={0} />);
    const playButton = screen.getByTestId('play-button-test');
    expect(playButton.textContent).toBe('Pause');
  });

  test('Clicking Pause button will trigger button', async () => {
    render(<TravelContainer snapshotsLength={0} />);
    const playButton = screen.getByTestId('play-button-test');
    expect(playButton.textContent).toBe('Pause');
    fireEvent.click(playButton);
    await expect(dispatch).toHaveBeenCalledTimes(1);
    state.tabs[87].playing = false;
  });
});
