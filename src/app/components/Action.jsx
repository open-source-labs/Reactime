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
      <div className="jump-button" onClick={() => handleSendSnapshot(index)}>
        Jump
      </div>
    </div>
  );
};

Action.propTypes = {
  selected: PropTypes.bool,
  index: PropTypes.number,
};

export default Action;
