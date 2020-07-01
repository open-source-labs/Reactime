import React from 'react';
import PropTypes from 'prop-types';
import { changeView, changeSlider } from '../actions/actions';

/* // gabi and nate :: index and delta props were removed from Action.jsx  */
// viewIndex and handleonkeyDown added to props
const Action = props => {
  const {
    selected, last, index, sliderIndex, dispatch, displayName, componentName, componentData, state, viewIndex, handleOnkeyDown,
  } = props;

  // display render time for state change in seconds and miliseconds
  const cleanTime = () => {
    let seconds;
    let miliseconds = componentData.actualDuration;
    if (Math.floor(componentData.actualDuration) > 60) {
      seconds = Math.floor(componentData.actualDuration / 60);
      seconds = JSON.stringify(seconds);
      if (seconds.length < 2) {
        seconds = '0'.concat(seconds);
      }
      miliseconds = Math.floor(componentData.actualDuration % 60);
    } else {
      seconds = '00';
    }
    miliseconds = JSON.stringify(miliseconds);
    const arrayMiliseconds = miliseconds.split('.');
    if (arrayMiliseconds[0].length < 2) {
      arrayMiliseconds[0] = '0'.concat(arrayMiliseconds[0]);
    }
    if (arrayMiliseconds[1].length > 3) {
      arrayMiliseconds[1] = arrayMiliseconds[1].slice(0, 2);
    }
    if (index == 0) {
      return `${seconds}:${arrayMiliseconds[0]}.${arrayMiliseconds[1]}`;
    }
    return `+${seconds}:${arrayMiliseconds[0]}.${arrayMiliseconds[1]}`;
  };
  const displayTime = cleanTime();

  return (
    <div
      // Edwin: invoking keyboard functionality; functionality is in ActionContainer;
      onKeyDown={e => handleOnkeyDown(e, viewIndex)}
      className={selected || last ? 'action-component selected' : 'action-component'}
      onClick={() => {
        dispatch(changeView(index));
      }}
      role="presentation"
      style={index > sliderIndex ? { color: '#5f6369' } : {}}
      tabIndex={index}
    >
      <div className="action-component-text">
        {`${displayName}:  ${componentName} `}
      </div>
      <button
        className="time-button"
        type="button"
      >
        {displayTime}
      </button>
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
