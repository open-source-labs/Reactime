import React, { Component } from 'react';
import ReactJson from 'react-json-view';

const JsonDisplay = (snapshot, index) => (
  <ReactJson
    key={`JsonDisplay${index}`}
    enableClipboard={false}
    theme="solarized"
    groupArraysAfterLength={50}
    src={snapshot}
  />
);
class StateContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let snapshotObjs = [];
    const { snapshot } = this.props;
    if (snapshot) {
      console.log('snapshot in statecontainer' , snapshot);
      snapshotObjs = snapshot.map((component, index) => JsonDisplay(component, index));
    }
    return <div className="state-container">{snapshotObjs}</div>;
  }
}

export default StateContainer;
