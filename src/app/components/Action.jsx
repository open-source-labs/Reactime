import React from 'react';
import PropTypes from 'prop-types';
import { changeView, changeSlider } from '../actions/actions';

const Action = props => {
  const {
    selected, index, delta, sliderIndex, dispatch,
  } = props;

  // function arrowKeys(event, indexx) {
  //   if (event.keyCode === 40) {
  //     indexx += 1;
  //     console.log('down was pushed; index : ', indexx);
  //     dispatch(changeView(indexx));
  //   } else if (event.keyCode === 38) {

  //     console.log('up was pushed indexx, : ', indexx);
  //     dispatch(changeView(indexx));
  //   }
  // }

  return (
    <div
      className={selected ? 'action-component selected' : 'action-component'}
      onClick={() => dispatch(changeView(index))}
      role="presentation"
      style={index > sliderIndex ? { color: '#5f6369' } : {}}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          e.stopPropagation();
          dispatch(changeView(index));
          dispatch(changeSlider(index));
        }
      }}
      tabIndex={index}
    >
      <div className="action-component-text">
        {`${index
        }:   ${delta}`}

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

Action.propTypes = {
  sliderIndex: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  delta: PropTypes.string.isRequired,
};

export default Action;
