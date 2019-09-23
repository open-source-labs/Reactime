import React from 'react';
import PropTypes from 'prop-types';

import { changeView, changeSlider } from '../actions/actions';

// Launch Feature: Figure out changeView vs changeSlider
// Should we make the btn bigger instead and keep the functionality? 
// div onclick event triggers the changeView method 

const Action = props => {
  const {
    selected, index, sliderIndex, dispatch,
  } = props;

  return (
    <div
      className={selected ? 'action-component selected' : 'action-component'}
      onClick={() => dispatch(changeView(index))}
      role="presentation"
      style={index > sliderIndex ? { color: '#5f6369' } : {}}
    >
      <div className="action-component-text">{index}</div>
      <button
        className="jump-button"
        onClick={e => {
          e.stopPropagation();
          dispatch(changeSlider(index));
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
  sliderIndex: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Action;
