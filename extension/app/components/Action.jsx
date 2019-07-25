import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Action = (props) => {
  const {
    snapshot, selected, handleChangeSnapshot, index,
  } = props;
  return (
    <div
      className={selected ? 'action-component selected' : 'action-component'}
      onClick={() => {
        handleChangeSnapshot(index);
      }}
    >
      {index}
      <button>Jump</button>
    </div>
  );
};

Action.propTypes = {
  // snapshot: PropTypes.object,
};

export default Action;
