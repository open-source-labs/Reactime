import React, { Component } from 'react';
import Action from '../components/Action';

class ActionContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { snapshots, snapshotIndex } = this.props;
    let actionsArr = [];
    if (snapshots) {
      actionsArr = snapshots.map((snapshot, index) => {
        const selected = index === snapshotIndex;
        console.log(selected);
        return <Action key={`action${index}`} snapshot={snapshot} selected={selected} />;
      });
    }
    return <div className="action-container">{actionsArr}</div>;
  }
}

export default ActionContainer;
