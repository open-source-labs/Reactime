import React, { Component } from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';


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

class mainSlider extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Slider
          min={0}
          max={this.props.snapshotLength - 1}
          value={this.props.snapshotIndex}
          onChange={(index) => {
            index = index === -1 ? 0 : index;
            this.props.handleChangeSnapshot(index);
            this.props.handleJumpSnapshot(index);
          }}
          handle={handle}
        />
    );
  }
}

export default mainSlider;
