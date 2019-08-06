import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MainSlider from '../components/MainSlider';
import Dropdown from '../components/Dropdown';

const speeds = [
  { value: 2000, label: '0.5x' },
  { value: 1000, label: '1.0x' },
  { value: 500, label: '2.0x' },
];

const TravelContainer = (props) => {
  const [selectedSpeed, setSpeed] = useState(speeds[1]);

  const {
    moveBackward,
    moveForward,
    snapshotsLength,
    handleJumpSnapshot,
    sliderIndex,
    play,
    playing,
    pause,
  } = props;

  return (
    <div className="travel-container">
      <button className="play-button" type="button" onClick={() => play(selectedSpeed.value)}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <MainSlider
        snapshotLength={snapshotsLength}
        sliderIndex={sliderIndex}
        handleJumpSnapshot={handleJumpSnapshot}
        pause={pause}
      />
      <button className="backward-button" onClick={moveBackward} type="button">
        {'<'}
      </button>
      <button className="forward-button" onClick={moveForward} type="button">
        {'>'}
      </button>
      <Dropdown
        speeds={speeds}
        selectedSpeed={selectedSpeed}
        setSpeed={setSpeed}
      />
    </div>
  );
}


TravelContainer.propTypes = {
  pause: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  moveBackward: PropTypes.func.isRequired,
  moveForward: PropTypes.func.isRequired,
  snapshotsLength: PropTypes.number.isRequired,
  handleJumpSnapshot: PropTypes.func.isRequired,
  sliderIndex: PropTypes.number.isRequired,
  playing: PropTypes.bool.isRequired,
};
export default TravelContainer;
