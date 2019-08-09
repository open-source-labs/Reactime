import React from 'react';
import PropTypes from 'prop-types';
import Action from '../components/Action';

import { emptySnapshots } from '../actions/actions';

const ActionContainer = ({
  snapshots,
  sliderIndex,
  viewIndex,
  dispatch,
}) => {
  let actionsArr = [];
  if (snapshots.length > 0) {
    actionsArr = snapshots.map((snapshot, index) => {
      const selected = index === viewIndex;
      return (
        <Action
          key={`action${index}`}
          index={index}
          selected={selected}
          dispatch={dispatch}
          sliderIndex={sliderIndex}
        />
      );
    });
  }
  return (
    <div className="action-container">
      <div className="action-component exclude">
        <button className="empty-button" onClick={() => dispatch(emptySnapshots())} type="button">
          emptySnapshot
        </button>
      </div>
      <div>{actionsArr}</div>
    </div>
  );
};

ActionContainer.propTypes = {
  snapshots: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  sliderIndex: PropTypes.number.isRequired,
  viewIndex: PropTypes.number.isRequired,
};

export default ActionContainer;
