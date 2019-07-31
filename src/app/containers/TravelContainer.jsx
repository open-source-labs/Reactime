import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import MainSlider from '../components/MainSlider';

class TravelContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { playSpeed: 1000 };
  }

  render() {
    const { playSpeed } = this.state;
    const {
      moveBackward,
      moveForward,
      snapshotsLength,
      handleChangeSnapshot,
      handleJumpSnapshot,
      snapshotIndex,
      play,
      playing,
      pause,
    } = this.props;

    const options = [
      { value: '2000', label: '0.5x' },
      { value: '1000', label: '1.0x' },
      { value: '500', label: '2.0x' },
    ];
    const selectedOption = options[0];

    return (
      <div className="travel-container">
        <div
          className="play-button"
          onClick={() => {
            play(playSpeed);
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
        <div className="backward-button" role="button" onClick={moveBackward}>
          {'<'}
        </div>
        <div className="forward-button" role="button" onClick={moveForward}>
          {'>'}
        </div>
        {/* <Select
        value={selectedOption}
        onChange={() => {
          console.log('select => value changed');
        }}
        options={options}
      /> */}
      </div>
    );
  }
}

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
