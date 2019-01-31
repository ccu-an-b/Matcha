import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import React from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';

const Range = Slider.Range;
const Handle = Slider.Handle;


function log(value) {
  console.log(value); 
}

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

export class BwmIntervalSlider extends React.Component {
    
      onSliderChange = (value) => {
        log(value);
      }
     
      onChange = (value) => {
        this.setState({ value })
        this.onSuccess(value)
      }
      
      onSuccess(value){
          const {input: {onChange}} = this.props;
          onChange(value);
      }

      render() {
        const {min, max } = this.props;
        return (
          <div className="slider-interval">
            <Range defaultValue={[min, max]} 
                    min={min} 
                    max={max}
                    onChange={this.onChange} 
                    handle={handle}
            />
          </div>
        );
      }
}