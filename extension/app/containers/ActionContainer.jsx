import React, { Component } from 'react';
import Action from '../components/Action';

class ActionContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { snapshots, snapshotIndex, handleChangeSnapshot } = this.props;
    let actionsArr = [];
    if (snapshots) {
      actionsArr = snapshots.map((snapshot, index) => {
        const selected = index === snapshotIndex;
        return (
          <Action
            key={`action${index}`}
            index={index}
            snapshot={snapshot}
            selected={selected}
            handleChangeSnapshot={handleChangeSnapshot}
          />
        );
      });
    }
    return <div className="action-container">{actionsArr}</div>;
  }
}

export default ActionContainer;
