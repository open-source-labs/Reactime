import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import { changeSlider, pause } from '../../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { HandleProps, MainSliderProps, MainState, RootState } from '../../FrontendTypes';

const { Handle } = Slider; // component constructor of Slider that allows customization of the handle

const handle = (props: HandleProps): JSX.Element => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <Tooltip // Tooltip that pop's up when clicking/dragging the slider thumb/handle that displays the current snapshot index
      className='travel-tooltip'
      prefixCls='rc-slider-tooltip'
      overlay={value} // the currentIndex
      visible={dragging} // tooltip only visible when slider thumb is click and/or dragged
      placement='top' // display the tooltip above the slider thumb
      key={index}
    >
      <Handle
        value={value} // the currentIndex / slider thumb position on the slider
        {...restProps}
      />
    </Tooltip>
  );
};

function MainSlider(props: MainSliderProps): JSX.Element {
  const dispatch = useDispatch();
  const { snapshotsLength } = props; // destructure props to get our total number of snapshots
  const [sliderIndex, setSliderIndex] = useState(0); // create a local state 'sliderIndex' and set it to 0.
  const { tabs, currentTab }: MainState = useSelector((state: RootState) => state.main);
  const { currLocation } = tabs[currentTab]; // we destructure the currentTab object

  useEffect(() => {
    if (currLocation) {
      // if we have a 'currLocation'
      //@ts-ignore
      setSliderIndex(currLocation.index); // set our slider thumb position to the 'currLocation.index'
    } else {
      setSliderIndex(0); // just set the thumb position to the beginning
    }
  }, [currLocation]); // if currLocation changes, rerun useEffect

  return (
    <Slider
      className='travel-slider'
      color='#0af548'
      min={0} // index of our first snapshot
      max={snapshotsLength - 1} // index of our last snapshot
      value={sliderIndex} // currently slider thumb position
      onChange={(index: any) => {
        // when the slider position changes
        setSliderIndex(index); // update the sliderIndex
      }}
      onAfterChange={() => {
        // after updating the sliderIndex
        dispatch(changeSlider(sliderIndex)); // updates currentTab's 'sliderIndex' and replaces our snapshot with the appropriate snapshot[sliderIndex]
        dispatch(pause()); // pauses playing and sets currentTab object'a intervalId to null
      }}
      handle={handle}
    />
  );
}

export default MainSlider;
