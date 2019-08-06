import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MainSlider from '../components/MainSlider';
import Dropdown from '../components/Dropdown';

const speeds = [
  { value: 2000, label: '0.5x' },
  { value: 1000, label: '1.0x' },
  { value: 500, label: '2.0x' },
];

function play(speed, playing, dispatch, snapshotsLength, sliderIndex) {
  if (playing) {
    dispatch({ type: 'pause' });
  } else {
    const intervalId = setInterval(() => {
      if (sliderIndex < snapshotsLength - 1) {
        dispatch({
          type: 'moveForward',
          payload: true,
        });
      } else {
        dispatch({ type: 'pause' });
      }
    }, speed);
    dispatch({ type: 'play', payload: intervalId });
  }
}

const TravelContainer = (props) => {
  const [selectedSpeed, setSpeed] = useState(speeds[1]);

  const {
    snapshotsLength,
    sliderIndex,
    playing,
    dispatch,
  } = props;

  return (
    <div className="travel-container">
      <button className="play-button" type="button" onClick={() => play(selectedSpeed.value, playing, dispatch, snapshotsLength, sliderIndex)}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <MainSlider
        snapshotsLength={snapshotsLength}
        sliderIndex={sliderIndex}
        dispatch={dispatch}
      />
      <button className="backward-button" onClick={() => dispatch({ type: 'moveBackward' })} type="button">
        {'<'}
      </button>
      <button className="forward-button" onClick={() => dispatch({ type: 'moveForward' })} type="button">
        {'>'}
      </button>
      <Dropdown
        speeds={speeds}
        selectedSpeed={selectedSpeed}
        setSpeed={setSpeed}
      />
    </div>
  );
};


TravelContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  snapshotsLength: PropTypes.number.isRequired,
  sliderIndex: PropTypes.number.isRequired,
  playing: PropTypes.bool.isRequired,
};
export default TravelContainer;
