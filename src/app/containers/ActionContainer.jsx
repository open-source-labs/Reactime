/* eslint-disable react/no-array-index-key */
import React from 'react';
import Action from '../components/Action';

import { emptySnapshots } from '../actions/actions';
import { useStoreContext } from '../store';

function ActionContainer() {
  const [{ snapshots, sliderIndex, viewIndex }, dispatch] = useStoreContext();
  let actionsArr = [];
  // build actions array
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
}

export default ActionContainer;
