import React, { Component } from 'react';
import MainSlider from '../components/Slider'




class TravelContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="travel-container">
        <div>
          Travel Container-playbutton
          {`travelContainer snapshotIndex ${this.props.snapshotIndex}`}
        </div>
        <MainSlider
          className = 'mainSlider'
          snapshotLength = {this.props.snapshotsLength} 
          handleChangeSnapshot = {this.props.handleChangeSnapshot}
          snapshotIndex = {this.props.snapshotIndex}
        />
        <div>forward and backward</div>
      </div>
    )

  }
}
export default TravelContainer;
