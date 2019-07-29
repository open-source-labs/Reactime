import React from 'react';
import Slider from '../components/Slider';

const TravelContainer = ({
  snapshotsLength,
  handleChangeSnapshot,
  handleJumpSnapshot,
  snapshotIndex,
}) => (
  <div className="travel-container">
    <Slider
      className="travel-slider"
      snapshotLength={snapshotsLength}
      handleChangeSnapshot={handleChangeSnapshot}
      handleJumpSnapshot={handleJumpSnapshot}
      snapshotIndex={snapshotIndex}
    />
    {`travelContainer snapshotIndex ${snapshotIndex}`}
  </div>
);

export default TravelContainer;
