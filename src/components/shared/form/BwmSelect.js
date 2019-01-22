import React from 'react';
import Select from 'react-select';

export class BwmSelect extends React.Component {
    
    constructor() {
        super();
        this.state = {
          value: "",
          start: true
        }
        this.onChange = this.onChange.bind(this);
    }
    
    onChange = (value) => {
        this.setState({ value })
        this.onSucces(value)
    }

    onSucces(value){
        const {input: {onChange}} = this.props;
        onChange(value);
    }

    render() {

        const { options, defaultValue, labelUp , className, valueStart } = this.props
        
        setTimeout(() => {
            if (defaultValue && this.state.start){
                this.onChange(options[defaultValue])
                this.setState({start: false})
            }
            else if (this.state.start) {
                this.onChange(options[valueStart])
                this.setState({start: false})
            }
        }, 100)
        
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




