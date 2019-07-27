import React, { Component } from 'react';
import MainSlider from '../components/Slider'




class TravelContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="travel-container">
        <button>playbutton</button>
        <MainSlider
          snapshotLength = {this.props.snapshotsLength} 
          handleChangeSnapshot = {this.props.handleChangeSnapshot}
          snapshotIndex = {this.props.snapshotIndex}
        />
        <button>forward</button>
      </div>
    )

  }
}
export default TravelContainer;
