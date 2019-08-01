import React from 'react';
import PropTypes from 'prop-types';
import Action from '../components/Action';

const ActionContainer = ({
  snapshots,
  viewIndex,
  handleChangeSnapshot,
  handleJumpSnapshot,
  emptySnapshot,
}) => {
  let actionsArr = [];
  if (snapshots.length > 0) {
    actionsArr = snapshots.map((snapshot, index) => {
      const selected = index === viewIndex;
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
      <div className="action-component exclude">
        <button className="empty-button" onClick={emptySnapshot} type="button">
          emptySnapshot
        </button>
      </div>
      <div>{actionsArr}</div>
    </div>
  );
};

ActionContainer.propTypes = {
  snapshots: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  viewIndex: PropTypes.number.isRequired,
  handleChangeSnapshot: PropTypes.func.isRequired,
  handleJumpSnapshot: PropTypes.func.isRequired,
  emptySnapshot: PropTypes.func.isRequired,
};

export default ActionContainer;
