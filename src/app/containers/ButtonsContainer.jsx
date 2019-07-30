import React, { Component } from 'react';

const autoBind = require('auto-bind');

class ButtonsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: false,
      locked: false,
    };

    autoBind(this);
  }

  togglePause(port) {
    const { paused } = this.state;
    port.postMessage({ action: 'setPause', payload: !paused });
    this.setState({ paused: !paused });
  }

  toggleLock(port) {
    const { locked } = this.state;
    port.postMessage({ action: 'setLock', payload: !locked });
    this.setState({ locked: !locked });
  }

  render() {
    const { paused, locked } = this.state;
    const { port } = this.props;
    return (
      <div className="buttons-container">
        <div className="pause-button" onClick={() => this.togglePause(port)}>{(paused) ? 'Resume' : 'Pause'}</div>
        <div className="lock-button" onClick={() => this.toggleLock(port)}>{(locked) ? 'Unlock' : 'Lock'}</div>
      </div>
    );
  }
}
export default ButtonsContainer;
