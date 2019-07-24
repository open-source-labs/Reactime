import React, { Component } from 'react';
// import Example from '../components/Slider'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';



class TravelContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
      <div className="travel-container">TravelContainer</div>
      <div>
       <Slider />
      </div>
      </div>
    )

  }
}
export default TravelContainer;
