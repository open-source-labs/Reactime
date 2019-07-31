import React, { Component } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';
import ButtonsContainer from './ButtonsContainer';

const autoBind = require('auto-bind');

// global variable for play function
let globalPlaying = false;
let intervalId = null;

class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snapshots: [],
      snapshotIndex: 0,
      port: null,
      playing: false,
      mode: {
        locked: false,
        paused: false,
        persist: false,
      },
    };

    autoBind(this);
  }

  componentDidMount() {
    // open connection with background script
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener((message) => {
      const { action, payload } = message;
      switch (action) {
        case 'sendSnapshots': {
          const snapshotIndex = payload.length - 1;
          // set state with the information received from the background script
          this.setState({ snapshots: payload, snapshotIndex });
          break;
        }
        case 'initialConnectSnapshots': {
          const { snapshots, mode } = payload;
          const snapshotIndex = snapshots.length - 1;
          this.setState({ snapshots, snapshotIndex, mode });
          break;
        }
        default:
      }
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
    this.pause();
    if (snapshots.length > 0 && snapshotIndex > 0) {
      const newIndex = snapshotIndex - 1;
      // second callback parameter of setState to invoke handleJumpSnapshot
      this.setState({ snapshotIndex: newIndex }, this.handleJumpSnapshot(newIndex));
    }
  }

  moveForward() {
    const { snapshots, snapshotIndex } = this.state;
    this.pause();
    if (snapshotIndex < snapshots.length - 1) {
      const newIndex = snapshotIndex + 1;
      this.setState({ snapshotIndex: newIndex }, this.handleJumpSnapshot(newIndex));
    }
  }

  play() {
    globalPlaying = !globalPlaying;
    this.setState({ playing: globalPlaying }, () => {
      if (this.state.playing) {
        intervalId = setInterval(() => {
          const { snapshots, snapshotIndex } = this.state;
          if (snapshotIndex < snapshots.length - 1) {
            const newIndex = snapshotIndex + 1;
            this.setState({ snapshotIndex: newIndex }, this.handleJumpSnapshot(newIndex));
          } else {
            // clear interval when play reaches the end
            globalPlaying = false;
            clearInterval(intervalId);
            this.setState({ playing: false })
          }
        }, 1000);
      } else {
        clearInterval(intervalId);
      }
    });
  }

  pause() {
    this.setState({ playing: false }, clearInterval(intervalId));
  }

  emptySnapshot() {
    const { port, snapshots } = this.state;
    this.setState({ snapshots: [snapshots[0]], snapshotIndex: 0 });
    port.postMessage({ action: 'emptySnap' });
  }

  // change the snapshot index
  // this will change the state shown in the state container but won't change the DOM
  handleChangeSnapshot(snapshotIndex) {
    // snapshotIndex
    // --> 1. affects the action that is highlighted
    // --> 2. moves the slider
    this.setState({ snapshotIndex });
  }

  handleJumpSnapshot(snapshotIndex) {
    const { snapshots, port } = this.state;
    port.postMessage({ action: 'jumpToSnap', payload: snapshots[snapshotIndex] });
  }

  importSnapshots() {
    const { snapshots } = this.state;

    // create invisible download anchor link
    const fileDownload = document.createElement('a');

    // set file in anchor link
    fileDownload.href = URL.createObjectURL(
      new Blob([JSON.stringify(snapshots)], { type: 'application/json' }),
    );

    // set anchor as file download and click it
    fileDownload.setAttribute('download', 'snapshot.json');
    fileDownload.click();

    // remove file url
    URL.revokeObjectURL(fileDownload.href);
  }

  exportSnapshots() {
    const fileUpload = document.createElement('input');
    fileUpload.setAttribute('type', 'file');

    fileUpload.onchange = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({ snapshots: JSON.parse(reader.result) });
      };
      reader.readAsText(event.target.files[0]);
    };

    fileUpload.click();
  }

  toggleMode(targetMode) {
    const { mode, mode: { locked, paused, persist }, port } = this.state;
    switch (targetMode) {
      case 'paused':
        port.postMessage({ action: 'setPause', payload: !paused });
        mode.paused = !paused;
        break;
      case 'locked':
        port.postMessage({ action: 'setLock', payload: !locked });
        mode.locked = !locked;
        break;
      case 'persist':
        port.postMessage({ action: 'setPersist', payload: !persist });
        mode.persist = !persist;
        break;
      default:
    }
    this.setState({ mode });
  }

  render() {
    const { snapshots, snapshotIndex, mode, playing } = this.state;
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
          {(snapshots.length) ? <StateContainer snapshot={snapshots[snapshotIndex]} /> : null}
          <TravelContainer
            snapshotsLength={snapshots.length}
            snapshotIndex={snapshotIndex}
            handleChangeSnapshot={this.handleChangeSnapshot}
            handleJumpSnapshot={this.handleJumpSnapshot}
            moveBackward={this.moveBackward}
            moveForward={this.moveForward}
            play={this.play}
            playing={playing}
            pause={this.pause}
          />
          <ButtonsContainer
            mode={mode}
            toggleMode={this.toggleMode}
            importSnapshots={this.importSnapshots}
            exportSnapshots={this.exportSnapshots}
          />
        </div>
      </div>
    );
  }
}

export default MainContainer;
