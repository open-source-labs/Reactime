import React from 'react';
import PropTypes from 'prop-types';

const Action = (props) => {
  const {
    selected, handleChangeSnapshot, handleJumpSnapshot, index, sliderIndex,
  } = props;

  return (
    <div
      className={selected ? 'action-component selected' : 'action-component'}
      onClick={() => handleChangeSnapshot(index)}
      role="presentation"
      style={index > sliderIndex ? { color: '#5f6369' } : {}}
    >
      <div className="action-component-text">{index}</div>
      <button
        className="jump-button"
        onClick={(e) => {
          e.stopPropagation();
          handleJumpSnapshot(index);
        }}
        tabIndex={index}
        type="button"
      >
        Jump
      </button>
    </div>
  );
};

Action.propTypes = {
  selected: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  handleChangeSnapshot: PropTypes.func.isRequired,
  handleJumpSnapshot: PropTypes.func.isRequired,
};

export default Action;
