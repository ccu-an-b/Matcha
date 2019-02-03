import React, { Component } from "react";
import { connect } from "react-redux";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { imgPath } from 'helpers';

const defaultLocation = [48.896755, 2.318565];
const defaultZoom = 13;

export class MapView extends Component {

  state = {
    center: defaultLocation,
    zoom: defaultZoom,
  };

  componentDidMount() {
    const { user, publicData } = this.props;
    if (user && user[0].latitude_user && user[0].longitude_user) {
      this.setState({ center: [user[0].latitude_user, user[0].longitude_user] });
    }
    else if (user && user[0].latitude_ip && user[0].longitude_ip) {
      this.setState({ center: [user[0].latitude_ip, user[0].longitude_ip] });
    }
    if (publicData && publicData.data.length > 0) {
      this.setState({ publicUserData: publicData.data });
    }
  }

  createMarker(position, index, content) {
    return (<Marker key={index} position={position}>
      <Popup>{content}</Popup>
    </Marker>);
  }

  popupContent = (user) => {
    return (
      <div >
        <img style={{
          borderRadius: '50%',
          height: '40px',
          width: '40px'
        }} src={imgPath(user.profile_img)} alt="profile_img" />
        <span style={{
          margin: '4px'
        }}>{user.username}</span>
      </div>
    );
  }

  createMarkersList(publicData) {
    return publicData.map((user, index) => {
      if (user.latitude_user && user.longitude_user) {
        const position = [user.latitude_user, user.longitude_user];
        return this.createMarker(position, index, this.popupContent(user));
      } else if (user.latitude_ip && user.longitude_ip) {
        const position = [user.latitude_ip, user.longitude_ip];
        return this.createMarker(position, index, this.popupContent(user));
      } else { return null; }
    })
  }

  render() {
    const { publicUserData } = this.state;
    console.log(publicUserData);
    return (
      <div>
        <Map center={this.state.center} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {publicUserData && this.createMarkersList(publicUserData)}
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
