import React, { Component } from "react";
import AsyncSelect from "react-select/lib/Async";
const axios = require("axios");

export class BwmSelectLocation extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
    }
}
  fetchOptions = inputValue => {
    return axios
      .get(
        `https://nominatim.openstreetmap.org/search/${escape(
          inputValue
        )}?format=json&addressdetails=3&limit=3`
      )
      .then(response => {
        return response.data.map(item => {
          return { value: JSON.stringify(item), label: item.display_name };
        });
      });
  };

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
    let {defaultValue, defaultLat } = this.props
 
    if (defaultValue){
      if(defaultValue.indexOf("ß") > 0)
      {
        defaultValue = "Berlin, Allemagne";
        defaultLat = 52.5170365;
      }
      
      const address = defaultValue.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(',');

      return this.fetchOptions(address[0]+address[1]).then((res)=> {
        for(var i=0; i<res.length; i++) {
            if(res[i].value.indexOf(defaultLat)!==-1) {
              this.onChange(res[0])
          }
        }
       })
    }
}

  render() {
    const { labelUp , className, placeholder } = this.props
    return (
      <div  className = {className} >
        { labelUp &&
          <label>
              {labelUp}
          </label>
        }
        <AsyncSelect
          isClearable
          cacheOptions
          defaultOptions
          loadOptions={this.fetchOptions}
          placeholder={placeholder}
          onChange={this.onChange}
          value={this.state.value}
        />
      </div>
    );
  }
}
 