/* eslint-disable max-len */
import React, { useState } from 'react';
import Dropdown from '../components/TimeTravel/Dropdown';
import {
  playForward,
  pause,
  startPlaying,
  moveForward,
  moveBackward,
  resetSlider,
  changeSlider,
} from '../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MainState, RootState, TravelContainerProps } from '../FrontendTypes';
import { Button } from '@mui/material';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';

/*
  This container renders the time-travel play button, seek bar, playback controls, and the playback speed dropdown, located towards the bottom of the application, above the locked, download, upload, and tutorial buttons
*/

// This object is used to create the options in the playback speed 'Dropdown' component
const speeds: {
  value: number;
  label: string;
}[] = [
  { value: 2000, label: '0.5x' },
  { value: 1000, label: '1.0x' },
  { value: 500, label: '2.0x' },
];
//NOTE HERE REMOVED THE DISPATCH FUNCTION IN THE TYPE SCRIPT:
//USING THE BUILT IN DISPATCH
function play( // function that will start/pause slider movement
  speed: number,
  playing: boolean,
  dispatch: (a: any) => void,
  snapshotsLength: number,
  sliderIndex: number,
): void {
  if (playing) {
    // if already playing, clicking the button will pause the slider
    dispatch(pause());

  } else {
    let currentIndex = sliderIndex; // the 'currentIndex' will be wherever the 'sliderIndex' is
    if (currentIndex === snapshotsLength - 1) {
      // if we reach the last snapshot, reset the slider and the currentIndex
      dispatch(resetSlider());
      currentIndex = 0;
    }
    const intervalId: NodeJS.Timeout = setInterval(() => {
      // sets interval period to wait before advancing 'currentIndex'/slider
      if (currentIndex < snapshotsLength - 1) {
        // as long as we're not the last snapshot, increment slider up through our dispatch and increment index
        dispatch(playForward(true));
        currentIndex += 1;
        dispatch(changeSlider(currentIndex));
      } else {
        dispatch(pause()); // pause the slider when we reach the end
      }
    }, speed);
    dispatch(startPlaying(intervalId)); // set's tabs[currentTab].playing to true and tabs[currentTab].intervalId to line 45's 'setInterval()'
  }
}

function TravelContainer(props: TravelContainerProps): JSX.Element {
  const { snapshotsLength } = props;
  const [selectedSpeed, setSpeed] = useState(speeds[1]); // create a new local state selectedSpeed and set it to the second element of the 'speeds' array (1.0x speed)

  const dispatch = useDispatch();
  const { tabs, currentTab }: MainState = useSelector((state: RootState) => state.main);
  const { sliderIndex, playing } = tabs[currentTab];

  return (
    <div className='travel-container'>
      <Button
        className='play-button'
        variant='contained'
        sx={{ height: 25, p: 0, mr: 1, ml: 1 }}
        type='button'
        // data-testid, prop for testing in RTL
        data-testid='play-button-test'
        //REMOVED DISPATCH FROM PLAY
        // @ts-ignore
        onClick={() => play(selectedSpeed.value, playing, dispatch, snapshotsLength, sliderIndex)}
      >
        {playing ? 'Pause' : 'Play'}
      </Button>
      <Button
        variant='contained'
        className='backward-button'
        onClick={() => dispatch(moveBackward(false))}
        type='button'
        sx={{ height: 25, minWidth: 30, p: 0, mr: 1 }}
        aria-label='Backward'
      >
        <FastRewindIcon className='backward-button-icon' />
      </Button>
      <Button
        variant='contained'
        className='forward-button'
        onClick={() => dispatch(moveForward(false))}
        type='button'
        sx={{ height: 25, minWidth: 30, p: 0 }}
        aria-label='Forward'
      >
        <FastForwardIcon className='forward-button-icon' />
      </Button>
      <Dropdown speeds={speeds} selectedSpeed={selectedSpeed} setSpeed={setSpeed} />
    </div>
  );
}

export default TravelContainer;
