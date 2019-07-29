import React, { Component } from 'react';
import MainSlider from '../components/MainSlider'




class TravelContainer extends Component {
  constructor(props) {
    super(props);
  }

  

  render() {
    return (
      <div className="travel-container">
        <div className="play-button" onClick={this.props.playForward}>
            play
        </div>
        <MainSlider
          snapshotLength = {this.props.snapshotsLength} 
          handleChangeSnapshot = {this.props.handleChangeSnapshot}
          snapshotIndex = {this.props.snapshotIndex}
          handleJumpSnapshot={this.props.handleJumpSnapshot}
        />
        <div className="backward-button" onClick={this.props.moveBackward}>
          {'<'}
        </div>
        <div className="forward-button" onClick={this.props.moveForward}>
          {'>'}
        </div>
      </div>
    );
  }
}
export default TravelContainer;
