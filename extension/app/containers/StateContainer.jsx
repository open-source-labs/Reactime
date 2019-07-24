import React, { Component } from 'react';
import ReactJson from 'react-json-view';

class StateContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { snapshot } = this.props;
    return (
      <div className="state-container">
        <ReactJson
          enableClipboard={false}
          theme="solarized"
          groupArraysAfterLength={50}
          src={snapshot}
        />
      </div>
    );
  }
}

export default StateContainer;
