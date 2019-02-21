import React from 'react';
import Select from 'react-select';

export class BwmMultiSelect extends React.Component {

    constructor() {
        super();
        this.state = {
            value: [],
            isLoading: true,
        }
    }

    componentWillMount(){
        this.initializeValue()
    }
    
    initializeValue(){
        const {defaultValue} = this.props

        if (defaultValue){
            for (var i = 0; i < defaultValue.length ; i++)
            {
                this.onChange({value: defaultValue[i], label: defaultValue[i]})
            }
        }
        this.setState({isLoading : false})
    }

    findArray(array, value){
        return array.find( key => key.value === value) 
    }

    onChange = (value) => {
        let newVal = value
        let stateVal = this.state.value

        if (value && this.state.isLoading){
            stateVal.indexOf(newVal) === -1
            ? stateVal.push(newVal)
            : stateVal.length === 1
                ? (stateVal = [])
                : stateVal.splice(stateVal.indexOf(newVal), 1)

            this.setState({ value: stateVal })
            this.onSuccess(stateVal)      
        }
        else if (value)
        {
            this.setState({ value})
            this.onSuccess(value)
        }
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
                value ={this.state.value}
            />
        }
        </div>
        )
    }
};

