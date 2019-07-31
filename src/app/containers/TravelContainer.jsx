import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainSlider from '../components/MainSlider';
import Dropdown from '../components/Dropdown';

const options = [
  { value: 2000, label: '0.5x' },
  { value: 1000, label: '1.0x' },
  { value: 500, label: '2.0x' },
];

class TravelContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { playSpeed: 1000, selectedOption: options[1] };
    this.handleChangeSpeed = this.handleChangeSpeed.bind(this);
  }

  handleChangeSpeed(selectedOption) {
    const playSpeed = selectedOption.value;
    this.setState({ selectedOption, playSpeed });
  }

  render() {
    const { playSpeed, selectedOption } = this.state;
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

    return (
      <div className="travel-container">
        <div className="play-button" onClick={() => play(playSpeed)}>
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
        <Dropdown
          options={options}
          selectedOption={selectedOption}
          handleChangeSpeed={this.handleChangeSpeed}
        />
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
