/* eslint-disable max-len */
import React, { useState } from 'react';
import MainSlider from '../components/MainSlider';
import Dropdown from '../components/Dropdown';
import {
  playForward,
  pause,
  startPlaying,
  moveForward,
  moveBackward,
  resetSlider,
} from '../actions/actions';
import { useStoreContext } from '../store';
import { TravelContainerProps } from '../FrontendTypes';

const speeds: {
  value: number;
  label: string;
}[] = [
  { value: 2000, label: '0.5x' },
  { value: 1000, label: '1.0x' },
  { value: 500, label: '2.0x' },
];

// start slider movement
function play(
  speed: number,
  playing: boolean,
  dispatch: (a: any) => void,
  snapshotsLength: number,
  sliderIndex: number,
): void {
  if (playing) {
    dispatch(pause());
  } else {
    let currentIndex = sliderIndex;
    if (currentIndex === snapshotsLength - 1) {
      // dispatch action to reset the slider
      dispatch(resetSlider());
      currentIndex = 0;
    }
    const intervalId: NodeJS.Timeout = setInterval(() => {
      if (currentIndex < snapshotsLength - 1) {
        dispatch(playForward());
        currentIndex += 1;
      } else {
        dispatch(pause());
      }
    }, speed);
    dispatch(startPlaying(intervalId));
  }
}

function TravelContainer(props: TravelContainerProps): JSX.Element {
  const { snapshotsLength } = props;
  const [selectedSpeed, setSpeed] = useState(speeds[1]);
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { sliderIndex, playing } = tabs[currentTab];

  return (
    <div className='travel-container'>
      <button
        className='play-button'
        type='button'
        // data-testid, prop for testing in RTL
        data-testid='play-button-test'
        onClick={() => play(selectedSpeed.value, playing, dispatch, snapshotsLength, sliderIndex)}
      >
        {playing ? 'Pause' : 'Play'}
      </button>
      <MainSlider snapshotsLength={snapshotsLength} />
      <button className='backward-button' onClick={() => dispatch(moveBackward())} type='button'>
        {'<'}
      </button>
      <button className='forward-button' onClick={() => dispatch(moveForward())} type='button'>
        {'>'}
      </button>
      <Dropdown speeds={speeds} selectedSpeed={selectedSpeed} setSpeed={setSpeed} />
    </div>
  );
}

export default TravelContainer;
