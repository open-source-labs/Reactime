import React from 'react';
import PropTypes from 'prop-types';
import { changeView, changeSlider } from '../actions/actions';

/* // gabi and nate :: index and delta props were removed from Action.jsx  */
// viewIndex and handleonkeyDown added to props
const Action = props => {
  const {
    selected, index, sliderIndex, dispatch, displayName, componentName, state, viewIndex, handleOnkeyDown,
  } = props;

  return (
    <div
      // Edwin: invoking keyboard functionality; functionality is in ActionContainer;
      onKeyDown={e => handleOnkeyDown(e, viewIndex)}
      className={selected ? 'action-component selected' : 'action-component'}
      onClick={() => {
        dispatch(changeView(index));
      }}
      role="presentation"
      style={index >= sliderIndex ? { color: '#5f6369' } : {}}
      tabIndex={index}
    >
      <div className="action-component-text">
        {`${displayName}:  ${componentName} `}
      </div>
      <button
        className="jump-button"
        onClick={e => {
          e.stopPropagation();
          dispatch(changeSlider(index));
          dispatch(changeView(index));
        }}
        tabIndex={index}
        type="button"
      >
        Jump
      </button>
    </div>
  );
};
// gabi and nate :: added displayName, componentName and State props to propTypes
Action.propTypes = {
  sliderIndex: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired, 
  componentName: PropTypes.string.isRequired, 
  state: PropTypes.object.isRequired,
  handleOnkeyDown: PropTypes.func.isRequired,
  viewIndex: PropTypes.number.isRequired,
};

export default Action;
