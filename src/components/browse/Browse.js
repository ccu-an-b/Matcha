import React from "react";
import { connect } from "react-redux";
import MapView from './Map';

export class Browse extends React.Component {
  render() {
    const userData = this.props.user

    if (userData.length > 1 && userData[0].complete === 1) {
      return <div id="leaflet-map"><MapView /></div>;
    } 
    else {
      return (
        <div className="profile-not-completed">
          <div className="header">
            <h1>Can't wait for your next date ?</h1>
          </div>
          <p>
          
            Before you start looking for new matchs you have to complete your
            profile information.
            <br /> <a href="/dashboard">Complete your profile</a>
          </p>
          <div id="leaflet-map"><MapView /></div>
        </div>
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    user: state.user.data,
  };
}

export default connect(mapStateToProps)(Browse);
