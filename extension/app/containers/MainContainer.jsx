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
    this.emptySnapshot = this.emptySnapshot.bind(this)
  }

  
  
  componentDidMount() {
    const port = chrome.runtime.connect();
    port.onMessage.addListener((snapshots) => {
      console.log('message from background script', snapshots);
      this.setState({ snapshots });
    });
    port.onDisconnect.addListener((obj) => {
      console.log('disconnected port', obj);
    });
    this.setState({ port });
  }
  
  emptySnapshot(){
    const { port } = this.state;

    this.setState({ snapshots: [] })
    
    port.postMessage({action: 'emptySnap', payload: [] });
  }

  // this method changes the snapshotIndex state
  // snapshotIndex could be changed from either the ActionContainer or the TravelContainer
  handleChangeSnapshot(snapshotIndex) {
    this.setState({ snapshotIndex });
  }

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
            emptySnapshot = {this.emptySnapshot}
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
