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
    
    onChange = (value) => {
        this.setState({ value })
        this.onSucces(value)
    }

    onSucces(value){
        const {input: {onChange}} = this.props;
        onChange(value);
    }

    render() {

        return (<div  className = {this.props.className} >

            { this.props.labelUp &&
                <label>
                    {this.props.labelUp}
                </label>
            }
            <Select
                allowCreate={true}
                options={this.props.options}
                onChange={this.onChange}
                value ={this.state.value}
                id="Element"
                multi 
           />
           </div>
        )
    }
}




