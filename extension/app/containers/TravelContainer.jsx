import React, { Component } from 'react';
import Slider from '../components/Slider'




class TravelContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
      <div className="travel-container">TravelContainer</div>
      <Slider/>
      </div>
    )

  }
}
export default TravelContainer;
