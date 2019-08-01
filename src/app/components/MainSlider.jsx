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
  snapshotLength,
  sliderIndex,
  handleJumpSnapshot,
  pause,
}) =>
  (
    <Slider
      min={0}
      max={snapshotLength - 1}
      value={sliderIndex}
      onChange={(index) => {
        const newIndex = index === -1 ? 0 : index;
        handleJumpSnapshot(newIndex);
        pause();
      }}
      handle={handle}
    />
  );

MainSlider.propTypes = {
  snapshotLength: PropTypes.number.isRequired,
  sliderIndex: PropTypes.number.isRequired,
  handleJumpSnapshot: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
};

export default MainSlider;
