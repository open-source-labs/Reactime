import React, { Component } from 'react';
import Action from '../components/Action';

class ActionContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { snapshots } = this.props;
    let actionsArr = [];
    if (snapshots) {
      actionsArr = snapshots.map((snapshot, index) => (
        <Action key={`action${index}`} snapshot={snapshot} />
      ));
    }
    return <div className="action-container">{actionsArr}</div>;
  }
}

export default ActionContainer;
