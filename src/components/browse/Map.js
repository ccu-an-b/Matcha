import React, { Component } from "react";
import { connect } from "react-redux";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { imgPath } from 'helpers';

const defaultLocation = [48.896755, 2.318565];
const defaultZoom = 13;

// const openStreetMapTile = (<TileLayer
//   attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//   url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
// />);

const mapBoxTile = (<TileLayer
  url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
  attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
  id='mapbox.streets'
  accessToken='pk.eyJ1IjoidHJuZGx6IiwiYSI6ImNqczNmd3M2MDI3M3M0NG9hYXZpc2x1MGgifQ.MPY_lgQFNAsJYwdVtmkXrw'
/>);

export class MapView extends Component {

  constructor() {
    super();
    this.state = {
      center: defaultLocation,
      zoom: defaultZoom,
    };
  }

  componentWillMount() {
    const { user, publicData, lat, lon } = this.props;
    if (lat && lon)
      this.setState({ center: [lat, lon] });
    else if (user && user[0].latitude_user && user[0].longitude_user) {
      this.setState({ center: [user[0].latitude_user, user[0].longitude_user] });
    }
    else if (user && user[0].latitude_ip && user[0].longitude_ip) {
      this.setState({ center: [user[0].latitude_ip, user[0].longitude_ip] });
    }
    if (publicData && publicData.data.length > 0) {
      this.setState({ publicUserData: publicData.data });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, lat, lon, filtered } = this.props;

    if (prevProps !== this.props && lat !== "" && filtered === true) {
      this.setState({ center: [lat, lon] });
    }
    else if (prevProps !== this.props && filtered === false) {
      if (user && user[0].latitude_user && user[0].longitude_user) {
        this.setState({ center: [user[0].latitude_user, user[0].longitude_user] });
      }
      else if (user && user[0].latitude_ip && user[0].longitude_ip) {
        this.setState({ center: [user[0].latitude_ip, user[0].longitude_ip] });
      }
    }
  }
  createMarker(position, index, content) {
    return (<Marker key={index} position={position}>
      <Popup>{content}</Popup>
    </Marker>);
  }

  popupContent = (user) => {
    return (
      <div className="map-profile">
        <img id={user.username} src={imgPath(user.profile_img)} alt="profile_img" className="show-more" onClick={this.props.showMore} />
        <span>
          <h4>{user.username}</h4>
          <h5>{user.age}</h5>
        </span>
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
    const { publicUserData } = this.props;

    return (
      <Map center={this.state.center} zoom={this.state.zoom}>
        {mapBoxTile}
        {publicUserData && this.createMarkersList(publicUserData)}
      </Map>
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
