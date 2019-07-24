import React, { Component } from 'react';

const { linkState, timeJump, getShot } = require('react-time-travel');

class TestComp extends Component {
  constructor(props) {
    super(props);
    this.state = { testkey: 'testval' };
    linkState(this);
    this.currentSnap = getShot();
  }

  render() {
    return (
      <div>
        <button onClick={() => {
          this.currentSnap = getShot();
        }}>
          get current snap
        </button>
        <button onClick={() => timeJump(this.currentSnap)}>
          jump
        </button>
      </div>
    );
  }
}

export default TestComp;
