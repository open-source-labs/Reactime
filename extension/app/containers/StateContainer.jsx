import React, { Component } from 'react';
import ReactJson from 'react-json-view';

const JsonDisplay = snapshot => (
  <ReactJson enableClipboard={false} theme="solarized" groupArraysAfterLength={50} src={snapshot} />
);
class StateContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let snapshotObjs = [];
    const { snapshot } = this.props;
    if (snapshot) {
      snapshotObjs = snapshot.map(component => JsonDisplay(component));
    }
    return <div className="state-container">{snapshotObjs}</div>;
  }
}

export default StateContainer;
