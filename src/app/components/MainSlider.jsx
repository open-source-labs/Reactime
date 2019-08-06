import React from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import PropTypes from 'prop-types';

const { Handle } = Slider;

const handle = (props) => {
  const {
    value, dragging, index, ...restProps
  } = props;

  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const MainSlider = ({
  snapshotsLength,
  sliderIndex,
  dispatch,
}) =>
  (
    <Slider
      min={0}
      max={snapshotsLength - 1}
      value={sliderIndex}
      onChange={(index) => {
        const newIndex = index === -1 ? 0 : index;
        dispatch({ type: 'changeSlider', payload: newIndex });
        dispatch({ type: 'pause' });
      }}
      handle={handle}
    />
  );

MainSlider.propTypes = {
  snapshotsLength: PropTypes.number.isRequired,
  sliderIndex: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default MainSlider;
