import React, { Component } from "react";
import { Map, TileLayer } from "react-leaflet";

export  class MapView extends Component {
  state = {
    center: [48.896755, 2.318565],
    zoom: 13
  };

  render() {
    return (
      <div>
        <Map center={this.state.center} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    );
  }
}

export default MapView;
