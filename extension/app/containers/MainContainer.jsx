import React, { Component } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';

class MainContainer extends Component {
  constructor() {
    super();
    this.state = { snapshots: [] };
  }

  componentDidMount() {
    // add a listener to capture messages from our backend
    window.addEventListener(
      'message',
      (event) => {
        // We only accept messages from ourselves
        if (event.source !== window) return;
        console.log(`Message received from backend: ${event.payload}`);
      },
      false,
    );

    // TESTING PURPOSES ONLY
    this.setState({
      snapshots: [{ state: 'snapshot1' }, { state: 'snapshot2' }, { state: 'snapshot3' }],
    });
  }

  render() {
    const { snapshots } = this.state;

    return (
      <div className="main-container">
        <HeadContainer />
        <div className="body-container">
          <ActionContainer snapshots={snapshots} />
          <StateContainer />
        </div>
        <TravelContainer />
      </div>
    );
  }
}

export default MainContainer;
