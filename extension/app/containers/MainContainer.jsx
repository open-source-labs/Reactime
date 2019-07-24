import React, { Component } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';

class MainContainer extends Component {
  constructor() {
    super();
    this.state = {
      snapshots: [{ state: 'snapshot1' , state2: 'othercomp snapshot1'}, { state: 'snapshot2' }, { state: 'snapshot3' }],
      snapshotIndex: 0,
    };

    this.handleChangeSnapshot = this.handleChangeSnapshot.bind(this);
  }

  componentDidMount() {
    // add a listener to capture messages from our backend
    // this should be in the inject script
    // window.addEventListener(
    //   'message',
    //   (event) => {
    //     // We only accept messages from ourselves
    //     if (event.source !== window) return;
    //     console.log(`Message received from backend: ${event.payload}`);
    //   },
    //   false,
    // );
  }

  handleChangeSnapshot(snapshotIndex) {
    console.log('handleChangeSnapshot', snapshotIndex);
    // change snapshotIndex
    // snapshotIndex could be changed from either the ActionContainer or the TravelContainer
    this.setState({ snapshotIndex });
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
          />
          <StateContainer snapshot={snapshots[snapshotIndex]} />
        </div>
        <TravelContainer
          snapshotsLength = {snapshots.length}
          handleChangeSnapshot = {this.handleChangeSnapshot}
          snapshotIndex = {snapshotIndex}
        />
      </div>
    );
  }
}

export default MainContainer;
