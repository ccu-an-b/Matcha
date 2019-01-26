import React, { Component } from "react";
import { connect } from "react-redux";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

const defaultLocation = [48.896755, 2.318565];
const defaultZoom = 13;

export  class MapView extends Component {

  state = {
    center: defaultLocation,
    zoom: defaultZoom,
  };

  componentDidMount() {
	  const { user, publicData } = this.props;
	  if (user && user[0].geoloc) {
		  this.setState({ center: user[0].geoloc.split(',', 2)});
	  }
	  if (publicData && publicData.data.length > 0) {
		  this.setState({ publicUserData: publicData.data });
	  }
  }

  createMarkers(publicData) {
	 return publicData.map((user) => {
		 console.log(user)
		 if (user.geoloc) {
			return (
			<Marker position={user.geoloc.split(',', 2)}>
				<Popup>{user.username}</Popup>
			</Marker>);
		 }
	 })
  }

  render() {
	const { publicUserData } = this.state;
    return (
      <div>
        <Map center={this.state.center} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
		  {publicUserData && this.createMarkers(publicUserData)}
        </Map>
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
	  user: state.user.data,
	  publicData: state.publicData,
	};
  } 
  
  export default connect(mapStateToProps)(MapView);
