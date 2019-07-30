import React from 'react';
import PropTypes from 'prop-types';
import MainSlider from '../components/MainSlider';

const TravelContainer = ({
  moveBackward,
  moveForward,
  snapshotsLength,
  handleChangeSnapshot,
  handleJumpSnapshot,
  snapshotIndex,
  play,
  playing,
  playSpeed,
  pause,
}) => {
  const options = ['0.5x', '1.0x', '2.0x'];
  const defaultOption = options[0];
  return (
    <div className="travel-container">
      <div
        className="play-button"
        onClick={() => {
          play(300);
          console.log('play clicked');
        }}
      >
        {playing ? 'Pause' : 'Play'}
      </div>
      <MainSlider
        snapshotLength={snapshotsLength}
        handleChangeSnapshot={handleChangeSnapshot}
        snapshotIndex={snapshotIndex}
        handleJumpSnapshot={handleJumpSnapshot}
        pause={pause}
      />
      <div className="backward-button" onClick={moveBackward}>
        {'<'}
      </div>
      <div className="forward-button" onClick={moveForward}>
        {'>'}
      </div>
    </div>
  );
};

TravelContainer.propTypes = {
  pause: PropTypes.func.isRequried,
  play: PropTypes.func.isRequired,
  moveBackward: PropTypes.func.isRequired,
  moveForward: PropTypes.func.isRequired,
  snapshotsLength: PropTypes.number.isRequired,
  handleChangeSnapshot: PropTypes.func.isRequired,
  handleJumpSnapshot: PropTypes.func.isRequired,
  snapshotIndex: PropTypes.number.isRequired,
};
export default TravelContainer;
