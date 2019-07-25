import React, { Component } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';

class MainContainer extends Component {
  constructor() {
    super();
    this.state = {
      snapshots: [],
      snapshotIndex: 0,
      port: null,
    };

    this.handleChangeSnapshot = this.handleChangeSnapshot.bind(this);
    this.handleSendSnapshot = this.handleSendSnapshot.bind(this);
  }

  componentDidMount() {
    // open connection with background script
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener((snapshots) => {
      console.log('message from background script', snapshots);
      const snapshotIndex = snapshots.length - 1;

      // set state with the information received from the background script
      this.setState({ snapshots, snapshotIndex });
    });

    // console log if the port with background script disconnects
    port.onDisconnect.addListener((obj) => {
      console.log('disconnected port', obj);
    });

    // assign port to state so it could be used by other components
    this.setState({ port });
  }

  // change the snapshot index
  // --> 1. affects the action that is highlighted
  // --> 2. moves the slider
  handleChangeSnapshot(snapshotIndex) {
    this.setState({ snapshotIndex });
  }

  // when the jump button is clicked, send a message to npm package with the selected snapshot
  handleSendSnapshot(snapshotIndex) {
    const { snapshots, port } = this.state;
    port.postMessage({ action: 'jumpToSnap', payload: snapshots[snapshotIndex] });
  }

  render() {
    const { snapshots, snapshotIndex } = this.state;

    return (
      <div className="main-container">
        main-conatiner
        <HeadContainer />
        <div className="body-container">
          <ActionContainer
            snapshots={snapshots}
            snapshotIndex={snapshotIndex}
            handleChangeSnapshot={this.handleChangeSnapshot}
            handleSendSnapshot={this.handleSendSnapshot}
          />
          <StateContainer snapshot={snapshots[snapshotIndex]} />
        </div>
        <TravelContainer
          snapshotsLength={snapshots.length}
          handleChangeSnapshot={this.handleChangeSnapshot}
          snapshotIndex={snapshotIndex}
        />
      </div>
    );
  }
}

export default MainContainer;
