import React, { Component } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';
import ButtonsContainer from './ButtonsContainer';

const autoBind = require('auto-bind');

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snapshots: [],
      snapshotIndex: 0,
      currentIndex: null,
      port: null,
      pause: false,
    };

    autoBind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    // open connection with background script
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener((snapshots) => {
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

  moveBackward() {
    const { snapshots, snapshotIndex } = this.state;
    if (snapshots.length > 0 && snapshotIndex > 0) {
      const newIndex = snapshotIndex - 1;
      this.handleJumpSnapshot(newIndex);
      this.setState({ snapshotIndex: newIndex });
    }
  }

  moveForward() {
    const { snapshots, snapshotIndex } = this.state;
    if (snapshotIndex < snapshots.length - 1) {
      const newIndex = snapshotIndex + 1;
      this.handleJumpSnapshot(newIndex);
      this.setState({ snapshotIndex: newIndex });
    }
  }

  playForward() {
    const play = setInterval(() => {
      const { snapshots, snapshotIndex } = this.state;
      if (snapshotIndex < snapshots.length - 1) {
        const newIndex = snapshotIndex + 1;
        this.handleJumpSnapshot(newIndex);
        this.setState({ snapshotIndex: newIndex });
      } else clearInterval(play);
    }, 1000);
    play();
  }

  emptySnapshot() {
    const { port, snapshots } = this.state;
    this.setState({ snapshots: [snapshots[0]], snapshotIndex: 0 });
    port.postMessage({ action: 'emptySnap' });
  }

  // change the snapshot index, this will change the state shown in the state container but won't change the DOM
  handleChangeSnapshot(snapshotIndex) {
    // snapshotIndex
    // --> 1. affects the action that is highlighted
    // --> 2. moves the slider
    this.setState({ snapshotIndex });
  }

  handleJumpSnapshot(snapshotIndex) {
    const { snapshots, port } = this.state;
    this.setState({ currentIndex: snapshotIndex });
    port.postMessage({ action: 'jumpToSnap', payload: snapshots[snapshotIndex] });
  }

  render() {
    const { snapshots, snapshotIndex, port } = this.state;
    return (
      <div className="main-container">
        <HeadContainer />
        <div className="body-container">
          <ActionContainer
            snapshots={snapshots}
            snapshotIndex={snapshotIndex}
            handleChangeSnapshot={this.handleChangeSnapshot}
            handleJumpSnapshot={this.handleJumpSnapshot}
            emptySnapshot={this.emptySnapshot}
          />
          <StateContainer snapshot={snapshots[snapshotIndex]} />
          <TravelContainer
            playing = {playing}
            snapshotsLength={snapshots.length}
            handleChangeSnapshot={this.handleChangeSnapshot}
            handleJumpSnapshot={this.handleJumpSnapshot}
            snapshotIndex={snapshotIndex}
            moveBackward={this.moveBackward}
            moveForward={this.moveForward}
            playForward={this.playForward}
          />
          <ButtonsContainer port={port} />
        </div>
      </div>
    );
  }
}

export default MainContainer;
