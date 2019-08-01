import React from 'react';
import PropTypes from 'prop-types';

const Action = (props) => {
  const {
    selected, handleChangeSnapshot, handleJumpSnapshot, index,
  } = props;
  return (
    <div
      className={selected ? 'action-component selected' : 'action-component'}
      onClick={() => handleChangeSnapshot(index)}
      role="presentation"
    >
      <div className="action-component-text">{index}</div>
      <div
        className="jump-button"
        onClick={() => handleJumpSnapshot(index)}
        tabIndex={index}
        role="button"
      >
        Jump
      </div>
    </div>
  );
};

// Action.propTypes = {
//   selected: PropTypes.bool,
//   index: PropTypes.number,
// };

export default Action;
