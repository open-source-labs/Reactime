import React, { Component } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';

class MainContainer extends Component {
  constructor() {
    super();
    this.state = {
      snapshots: [{ state: 'snapshot1' }, { state: 'snapshot2' }, { state: 'snapshot3' }],
      snapshotIndex: 0,
      port: null,
    };

    this.handleChangeSnapshot = this.handleChangeSnapshot.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    const port = chrome.runtime.connect();
    port.onMessage.addListener((message) => {
      console.log('message from content script', message);
    });
    port.onDisconnect.addListener((obj) => {
      console.log('disconnected port', obj);
    });
    this.setState({ port });
  }

  // this method changes the snapshotIndex state
  // snapshotIndex could be changed from either the ActionContainer or the TravelContainer
  handleChangeSnapshot(snapshotIndex) {
    // const { port } = this.state;
    // port.postMessage({ message: snapshotIndex });
    this.setState({ snapshotIndex });
  }

  render() {
    const { snapshots, snapshotIndex } = this.state;

    return (
      <div className="main-container">
        <HeadContainer />
        <div className="body-container">
          <ActionContainer
            snapshots={snapshots}
            snapshotIndex={snapshotIndex}
            handleChangeSnapshot={this.handleChangeSnapshot}
          />
          <StateContainer snapshot={snapshots[snapshotIndex]} />
        </div>
        <TravelContainer />
      </div>
    );
  }
}

export default MainContainer;
