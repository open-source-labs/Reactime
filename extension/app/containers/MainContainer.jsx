import React, { Component } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';

class MainContainer extends Component {
  constructor() {
    super();
    this.state = { snapshots: [], snapshotIndex: 0 };

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

    // MOCK DATA -- FOR TESTING PURPOSES ONLY
    this.setState({
      snapshots: [{ state: 'snapshot1' }, { state: 'snapshot2' }, { state: 'snapshot3' }],
      snapshotIndex: 1,
    });
  }

  handleChangeSnapshot(snapshotIndex) {
    console.log('handleChangeSnapshot');
    // change snapshotIndex
    // snapshotIndex could be changed from either the ActionContainer or the TravelContainer
    this.setState({ snapshotIndex });
  }

  render() {
    const { snapshots, snapshotIndex } = this.state;

    return (
      <div className="main-container">
        <HeadContainer />
        <div className="body-container">
          <ActionContainer snapshots={snapshots} snapshotIndex={snapshotIndex} />
          <StateContainer snapshot={snapshots[snapshotIndex]} />
        </div>
        <TravelContainer />
      </div>
    );
  }
}

export default MainContainer;
