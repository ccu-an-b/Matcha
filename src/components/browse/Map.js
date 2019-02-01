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
    console.log(this.props);
	  const { user, publicData } = this.props;
	  if (user && user[0].latitude_ip && user[0].longitude_ip) {
		  this.setState({ center: [user[0].latitude_ip, user[0].longitude_ip]});
	  }
	  if (publicData && publicData.data.length > 0) {
		  this.setState({ publicUserData: publicData.data });
	  }
  }

  createMarkers(publicData) {
	 return publicData.map((user, index) => {
		 if (user.latitude_ip && user.longitude_ip) {
			return (
			<Marker key={index} position={[user.latitude_ip, user.longitude_ip]}>
				<Popup>{user.username}</Popup>
			</Marker>);
		 } else { return null; }
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
