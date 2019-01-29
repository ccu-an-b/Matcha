import React from "react";
import MapView from './Map';

import { connect } from "react-redux";
import profileService from 'services/profile-service';
//import { format } from "url";

import { ProfilePreview } from '../dashboard/ProfilePreview';
import { ProfileInfo } from '../dashboard/ProfileInfo';

var Coverflow = require('react-coverflow');

export class Browse extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showMap: true,
      oneProfile: [],
      isLoading: true,

    }
    this.profileRef = React.createRef()
    this.switchDisplay = this.switchDisplay.bind(this);
    this.profileShowMore = this.profileShowMore.bind(this);
  }

  componentWillMount(){
    this.updateSuggestedProfiles()
  }

  updateSuggestedProfiles(){
    profileService.getSuggestedProfiles().then((profiles) => {
      this.setState({profiles, isLoading: false})
    })
  }

  switchDisplay(){
    this.setState({showMap: !this.state.showMap})
  }

  profileShowMore(event){
    if (event.target.className === 'fas fa-plus' || event.target.className === 'button' )
    {
      const username = event.target.id;
      profileService.setProfileView(username)
        .then(() => { return profileService.getOneProfile(username)})
        .then((oneProfile) => {
          this.setState({oneProfile: oneProfile.data})
          this.profileRef.current.scrollIntoView({behavior: 'smooth'})
        })
        .then (() => {this.updateSuggestedProfiles()})
    }
  }

  renderProfiles(profiles) {
    return profiles.data.map((profile, index) => {
        return(
             <ProfilePreview  key={index}
                              user = {this.props.user[0].username}
                              userData={profile}
                              handleClick={this.profileShowMore} />   
                               
        )
    });
  }
  
  render() {
    const userData = this.props.user

    if (userData.length > 1 && userData[0].complete === 1) {
      return (
        <div className="browse">
          <div className="type-display"> 
              <div className='btn button full' onClick={this.switchDisplay}>Show {this.state.showMap ? 'List' : 'Map'}</div>
          </div>

          {this.state.showMap &&
            <div id="leaflet-map"><MapView /></div>
          }
          {!this.state.showMap &&
            <div className="browse-listing"> 
              <Coverflow
                ref={this.myRef} 
                width='100%'
                height={600}
                displayQuantityOfSide={this.state.profiles.data.length/2}
                navigation={false}
                enableHeading={false}
                infiniteScroll={true}
                background-color="transparent"
                otherFigureScale = {0.8}
                otherFigureOpacity= {1}
                currentFigureScale = {1}
              >
                <div
                  onClick={() => this.fn()}
                  onKeyDown={() => this.fn()}
                  role="menuitem"
                  tabIndex="0"
                >
                </div>
                {!this.state.isLoading && 
                    this.renderProfiles(this.state.profiles) 
                }
              </Coverflow>
              {this.state.oneProfile.length >1 &&
                <div ref={this.profileRef} className="one-profile-more">
                  <ProfileInfo userData= {this.state.oneProfile }  user = {this.props.user[0].username}/>
                </div>
              }
            </div>
          }
        </div>
      )
    } 
    else if (userData.length > 1 && userData[0].complete === 0) {
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
    else {
      return (
          <div className="page loading">
             <img src={process.env.PUBLIC_URL+'loading.gif'} alt="loading_gif"  />
          </div>
      )
    }
  }
}
function mapStateToProps(state) {
  return {
    browse: state.browse,
    user: state.user.data,
    auth: state.auth
  };
}

export default connect(mapStateToProps)(Browse);
