import React, { Component } from "react";
import AsyncSelect from "react-select/lib/Async";
const axios = require("axios");

export class BwmSelectLocation extends Component {
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

  onChange = (value) => {
    this.setState({ value })
    this.onSuccess(value)
  }

  onSuccess(value){
      const {input: {onChange}} = this.props;
      onChange(value);
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
        />
      </div>
    );
  }
}
