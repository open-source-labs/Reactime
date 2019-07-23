import React, { Component } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';

class MainContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="main-container">
        <HeadContainer />
        <div className="body-container">
          <ActionContainer />
          <StateContainer />
        </div>
        <TravelContainer />
      </div>
    );
  }
}

export default MainContainer;
