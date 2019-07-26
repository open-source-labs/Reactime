import React, { Component } from 'react';
import Slider from '../components/Slider'




class TravelContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <div className="travel-container">TravelContainer</div>
      <Slider 
        className="travel-slider" 
        snapshotLength = {this.props.snapshotsLength} 
        handleChangeSnapshot = {this.props.handleChangeSnapshot}
        snapshotIndex = {this.props.snapshotIndex}
      />
      {`snapshot inex in slider ${this.props.snapshotIndex}`}
      </div>
    )

  }
}
export default TravelContainer;
