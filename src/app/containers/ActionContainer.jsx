import React from 'react';
import PropTypes from 'prop-types';
import Action from '../components/Action';

const ActionContainer = ({
  snapshots,
  snapshotIndex,
  handleChangeSnapshot,
  handleJumpSnapshot,
  emptySnapshot,
}) => {
  let actionsArr = [];
  if (snapshots.length > 0) {
    actionsArr = snapshots.map((snapshot, index) => {
      const selected = index === snapshotIndex;
      return (
        <Action
          key={`action${index}`}
          index={index}
          snapshot={snapshot}
          selected={selected}
          handleChangeSnapshot={handleChangeSnapshot}
          handleJumpSnapshot={handleJumpSnapshot}
        />
      );
    });
  }
  return (
    <div className="action-container">
      <div className="action-component">
        <div className="empty-button" onClick={emptySnapshot}>
          emptySnapshot
        </div>
      </div>
      <div>{actionsArr}</div>
    </div>
  );
};

ActionContainer.propTypes = {
  snapshots: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  snapshotIndex: PropTypes.number.isRequired,
  handleChangeSnapshot: PropTypes.func.isRequired,
  handleJumpSnapshot: PropTypes.func.isRequired,
  emptySnapshot: PropTypes.func.isRequired,
};

export default ActionContainer;
