import React, { Component } from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const Handle  = Slider.Handle;


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

class mainSlider extends Component {
    constructor(props){
        super(props)
    }


    render(){
        return(
            <div>
                <Slider 
                min={0} 
                max={this.props.snapshotLength-1} 
                value = {this.props.snapshotIndex}
                onChange={(index) => {
                    this.props.handleChangeSnapshot(index)
                }}
                handle={handle}
                 >
                </Slider>
            </div>
        )
    }
}

export default mainSlider;

