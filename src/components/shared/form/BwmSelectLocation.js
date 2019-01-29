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

  render() {
    return (
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={this.fetchOptions}
      />
    );
  }
}
