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
      sliderIndex: 0,
      viewIndex: -1,
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
          const sliderIndex = payload.length - 1;
          // set state with the information received from the background script
          this.setState({ snapshots: payload, sliderIndex });
          break;
        }
        case 'initialConnectSnapshots': {
          const { snapshots, mode } = payload;
          const viewIndex = -1;
          const sliderIndex = 0;
          this.setState({ snapshots, mode, viewIndex, sliderIndex });
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
    const { snapshots, sliderIndex } = this.state;
    this.pause();
    if (snapshots.length > 0 && sliderIndex > 0) {
      const newIndex = sliderIndex - 1;
      // second callback parameter of setState to invoke handleJumpSnapshot
      this.setState({ sliderIndex: newIndex }, this.handleJumpSnapshot(newIndex));
    }
  }

  moveForward() {
    const { snapshots, sliderIndex } = this.state;
    this.pause();
    if (sliderIndex < snapshots.length - 1) {
      const newIndex = sliderIndex + 1;
      this.setState({ sliderIndex: newIndex }, this.handleJumpSnapshot(newIndex));
    }
  }

  play(speed = 1000) {
    globalPlaying = !globalPlaying;
    this.setState({ playing: globalPlaying }, () => {
      const { playing } = this.state;
      if (playing) {
        intervalId = setInterval(() => {
          const { snapshots, sliderIndex } = this.state;
          if (sliderIndex < snapshots.length - 1) {
            const newIndex = sliderIndex + 1;
            this.setState({ sliderIndex: newIndex }, this.handleJumpSnapshot(newIndex));
          } else {
            // clear interval when play reaches the end
            globalPlaying = false;
            clearInterval(intervalId);
            this.setState({ playing: false });
          }
        }, speed);
      } else {
        // menas already playing, user wants to pause so clearinterval using global vairable
        clearInterval(intervalId);
      }
    });
  }

  pause() {
    this.setState({ playing: false }, clearInterval(intervalId));
  }

  emptySnapshot() {
    const { port, snapshots } = this.state;
    this.setState({ snapshots: [snapshots[0]], sliderIndex: 0, viewIndex: -1 });
    port.postMessage({ action: 'emptySnap' });
  }

  // change the view index
  // this will change the state shown in the state container but won't change the DOM
  handleChangeSnapshot(viewIndex) {
    const { viewIndex: oldViewIndex } = this.state;
    // unselect view if same index was selected
    if (viewIndex === oldViewIndex) this.setState({ viewIndex: -1 });
    else this.setState({ viewIndex });
  }

  // changes the slider index
  // this will change the dom but not the state shown in the state container
  handleJumpSnapshot(sliderIndex) {
    const { snapshots, port } = this.state;
    port.postMessage({ action: 'jumpToSnap', payload: snapshots[sliderIndex] });
    this.setState({ sliderIndex });
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
    const {
      mode,
      mode: { locked, paused, persist },
      port,
    } = this.state;
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
    const {
      snapshots, viewIndex, sliderIndex, mode, playing, playSpeed,
    } = this.state;

    // if viewIndex is -1, then use the sliderIndex instead
    const snapshotView = (viewIndex === -1) ? snapshots[sliderIndex] : snapshots[viewIndex];

    return (
      <div className="main-container">
        <HeadContainer />
        <div className="body-container">
          <ActionContainer
            snapshots={snapshots}
            viewIndex={viewIndex}
            sliderIndex={sliderIndex}
            handleChangeSnapshot={this.handleChangeSnapshot}
            handleJumpSnapshot={this.handleJumpSnapshot}
            emptySnapshot={this.emptySnapshot}
          />
          {(snapshots.length) ? <StateContainer snapshot={snapshotView} /> : null}
          <TravelContainer
            snapshotsLength={snapshots.length}
            sliderIndex={sliderIndex}
            handleJumpSnapshot={this.handleJumpSnapshot}
            moveBackward={this.moveBackward}
            moveForward={this.moveForward}
            play={this.play}
            pause={this.pause}
            playing={playing}
            playSpeed={playSpeed}
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
