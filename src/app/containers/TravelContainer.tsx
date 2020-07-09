import React, { useState } from 'react';
import MainSlider from '../components/MainSlider.tsx';
import Dropdown from '../components/Dropdown.tsx';
import {
  playForward, pause, startPlaying, moveForward, moveBackward, resetSlider,
} from '../actions/actions.ts';
import { useStoreContext } from '../store.tsx';

const speeds = [
  { value: 2000, label: '0.5x' },
  { value: 1000, label: '1.0x' },
  { value: 500, label: '2.0x' },
];

// start slider movement
function play(speed:number, playing:boolean, dispatch:(a:()=>void) => void, snapshotsLength:number, sliderIndex:number) {
  if (playing) {
    dispatch(pause());
  } else {
    let currentIndex = sliderIndex;
    if (currentIndex === snapshotsLength - 1) {
      // dispatch action to reset the slider
      dispatch(resetSlider());
      currentIndex = 0;
    }
    const intervalId = setInterval(() => {
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

interface TravelContainerProps {
  snapshotsLength: number,
}

function TravelContainer(props:TravelContainerProps) {
  const { snapshotsLength } = props
  const [selectedSpeed, setSpeed] = useState(speeds[1]);
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { sliderIndex, playing } = tabs[currentTab];

  return (
    <div className="travel-container">
      <button
        className="play-button"
        type="button"
        onClick={() => play(selectedSpeed.value, playing, dispatch, snapshotsLength, sliderIndex)}
      >
        {playing ? 'Pause' : 'Play'}
      </button>
      <MainSlider snapshotsLength={snapshotsLength} sliderIndex={sliderIndex} dispatch={dispatch} />
      <button className="backward-button" onClick={() => dispatch(moveBackward())} type="button">
        {'<'}
      </button>
      <button className="forward-button" onClick={() => dispatch(moveForward())} type="button">
        {'>'}
      </button>
      <Dropdown speeds={speeds} selectedSpeed={selectedSpeed} setSpeed={setSpeed} />
    </div>
  );
}

export default TravelContainer;
