import React from "react";
import { connect } from "react-redux";
import authService from "services/auth-service";
import MapView from './Map';

export class Browse extends React.Component {
  render() {

    if (authService.getUserProfileStatus()) {
      return <div id="leaflet-map"></div>;
    } else {
      return (
        <div className="profile-not-completed">
          <div className="header">
            <h1>Can't wait for your next date ?</h1>
          </div>
          <div id="leaflet-map"><MapView /></div>
          <p>
          
            Before you start looking for new matchs you have to complete your
            profile information.
            <br /> <a href="/dashboard">Complete your profile</a>
          </p>
        </div>
      );
    }
  }
}
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Browse);
