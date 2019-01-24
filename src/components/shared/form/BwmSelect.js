import React from 'react';
import Select from 'react-select';

export class BwmSelect extends React.Component {
    
    constructor() {
        super();
        this.state = {
          value: "",
        }
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount(){
        this.initializeValue()
    }

    onChange = (value) => {
        this.setState({ value })
        this.onSucces(value)
    }

    onSucces(value){
        const {input: {onChange}} = this.props;
        onChange(value);
    }
    
    initializeValue(){
        const { options, defaultValue, valueStart } = this.props

        if (defaultValue || defaultValue === 0 ){
            this.onChange(options[defaultValue])
        }
        else {
            this.onChange(options[valueStart])
        }
    }

    render() {

        const { options, labelUp , className } = this.props
  
        return (<div  className = {className} >

            { labelUp &&
                <label>
                    {labelUp}
                </label>
            }
         <Select
                allowCreate={true}
                options={options}
                onChange={this.onChange}
                value ={this.state.value}
                id="Element"
                multi 
            />
            </div>
        )
        
    }
}