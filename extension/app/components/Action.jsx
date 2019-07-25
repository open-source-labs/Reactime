import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Action = (props) => {
  const {
    selected, handleChangeSnapshot, handleSendSnapshot, index,
  } = props;
  return (
    <div
      className={selected ? 'action-component selected' : 'action-component'}
      onClick={() => {
        handleChangeSnapshot(index);
      }}
    >
      <div className="action-component-text">{index}</div>
      <button onClick={() => handleSendSnapshot(index)}>Jump</button>
    </div>
  );
};

Action.propTypes = {
  // snapshot: PropTypes.object,
};

export default Action;
