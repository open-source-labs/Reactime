import React from 'react';
import MainSlider from '../components/MainSlider';

const TravelContainer = ({
  playForward,
  moveBackward,
  moveForward,
  snapshotsLength,
  handleChangeSnapshot,
  handleJumpSnapshot,
  snapshotIndex,
}) => (
  <div className="travel-container">
    <div className="play-button" onClick={playForward}>
      play
    </div>
    <MainSlider
      snapshotLength={snapshotsLength}
      handleChangeSnapshot={handleChangeSnapshot}
      snapshotIndex={snapshotIndex}
      handleJumpSnapshot={handleJumpSnapshot}
    />
    <div className="backward-button" onClick={moveBackward}>
      {'<'}
    </div>
    <div className="forward-button" onClick={moveForward}>
      {'>'}
    </div>
  </div>
);
export default TravelContainer;
