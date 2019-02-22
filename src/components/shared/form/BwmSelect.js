import React from 'react';
import Select from 'react-select';

export class BwmSelect extends React.Component {
    
    constructor() {
        super();
        this.state = {
          value: "",
          isClearable: true,
        }
    }
    componentDidMount(){
        this.initializeValue()
    }

    onChange = (value) => {
        this.setState({ value })
        this.onSuccess(value)
    }

    onSuccess(value){
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
    toggleClearable = () =>
    this.setState(state => ({ isClearable: !state.isClearable }));

    render() {

        const { options, labelUp , className } = this.props
        const {isClearable} = this.state
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
                isClearable={isClearable}
                value ={this.state.value}
                id="Element"
                multi 
            />
            </div>
        )
        
    }
}