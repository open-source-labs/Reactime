import React, { Component } from 'react';
// import Example from '../components/Slider'
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
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



class TravelContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
      <div className="travel-container">TravelContainer</div>
      <div>
       <Slider min={0} max={20} defaultValue={3} handle={handle} />
      </div>
      </div>
    )

  }
}
export default TravelContainer;
