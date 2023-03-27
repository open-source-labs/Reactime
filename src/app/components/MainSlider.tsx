import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import { changeSlider, pause } from '../actions/actions';
import { useStoreContext } from '../store';

const { Handle } = Slider;

interface handleProps {
  value: number;
  dragging: boolean;
  index: number;
}

const handle = (props: handleProps) => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <Tooltip
      prefixCls='rc-slider-tooltip'
      overlay={value}
      visible={dragging}
      placement='top'
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

interface MainSliderProps {
  snapshotsLength: number;
}

function MainSlider(props: MainSliderProps) {
  const { snapshotsLength } = props;
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { currLocation } = tabs[currentTab];
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    if (currLocation) {
      setSliderIndex(currLocation.index);
    } else {
      setSliderIndex(0);
    }
  }, [currLocation]);

  return (
    <Slider
      min={0}
      max={snapshotsLength - 1}
      value={sliderIndex}
      onChange={(index: any) => {
        setSliderIndex(index);
      }}
      onAfterChange={() => {
        dispatch(changeSlider(sliderIndex));
        dispatch(pause());
      }}
      handle={handle}
    />
  );
}

export default MainSlider;
