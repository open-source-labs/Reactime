import React, { Component } from 'react';
import MainSlider from '../components/Slider'




class TravelContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="travel-container">
        <div className="empty-button" onClick={console.log('hello')}>
            play
        </div>
        <MainSlider
          snapshotLength = {this.props.snapshotsLength} 
          handleChangeSnapshot = {this.props.handleChangeSnapshot}
          snapshotIndex = {this.props.snapshotIndex}
        />
        <div className="backward-button" onClick={console.log('backward')}>
          {'<'}
        </div>
        <div className="forward-button" onClick={console.log('forward')}>
          {'>'}
        </div>
      </div>
    )

  }
}
export default TravelContainer;
