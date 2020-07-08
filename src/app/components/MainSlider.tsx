/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import PropTypes from 'prop-types';

import { changeSlider, pause } from '../actions/actions.ts';
import { useStoreContext } from '../store';

const { Handle } = Slider;

const handle = props => {
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

function MainSlider({ snapshotsLength }) {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { sliderIndex } = tabs[currentTab];

  return (
    <Slider
      min={0}
      max={snapshotsLength - 1}
      value={sliderIndex}
      onChange={index => {
        const newIndex = index === -1 ? 0 : index;
        dispatch(changeSlider(newIndex));
        dispatch(pause());
      }}
      handle={handle}
    />
  );
}

MainSlider.propTypes = {
  snapshotsLength: PropTypes.number.isRequired,
};

export default MainSlider;
