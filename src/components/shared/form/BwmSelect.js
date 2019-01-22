import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
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
    initializeValue(){
        const { options, defaultValue, valueStart } = this.props

        if (defaultValue && this.state.start){
            this.onChange(options[defaultValue])
            this.setState({start: false})
        }
        else if (this.state.start) {
            this.onChange(options[valueStart])
            this.setState({start: false})
        }
    }
    render() {

        const { options, labelUp , className } = this.props

        setTimeout( () => this.initializeValue(), 300)
  
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

function mapStateToProps(state) {
    return{
       select: state.select,
    }
}

export default connect(mapStateToProps)(Select)


