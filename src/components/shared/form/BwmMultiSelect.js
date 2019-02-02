import React from 'react';
import Select from 'react-select';

export class BwmMultiSelect extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }
    onChange = (value) => {
        this.setState({ value })
        this.onSuccess(value)
    }

    onSuccess(value){
        const {input: {onChange}} = this.props;
        onChange(value);
    }
    
    render(){
        const {className, options} = this.props
    
       return(
        <div  className = {className} >
        {options.length &&
             <Select
             closeMenuOnSelect={false}
             isMulti
             options={options}
             onChange={this.onChange}
         />
        }
        </div>
        )
    }
};