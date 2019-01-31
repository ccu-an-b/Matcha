import React from "react";
import { connect } from "react-redux";
import profileService from 'services/profile-service';

import { ProfilePreview } from '../dashboard/ProfilePreview';
import { ProfileInfo } from '../dashboard/ProfileInfo';


export class Profile extends React.Component {

  constructor(){
    super();
    this.state = {
      profile: [],
      isLoading: true,
      username: "",

    }
  }

  componentWillMount(){
    const username = this.props.match.params.username;
    this.updateProfile(username)
    this.setState({username})
  }

  updateProfile(username){
    profileService.getOneProfile(username).then((profile) => {
      this.setState({profile: profile.data, isLoading: false})
    })
  }

  profileLike(event){
    if (event.target.className === 'fas fa-heart' || event.target.className === 'button' )
    {
      const username = event.target.id;
      return profileService.setProfileLike(username)
        .then (() => {this.updateSuggestedProfiles()})
        .then(() => { return profileService.getOneProfile(username)})
        .then((oneProfile) => {
          this.setState({profile: oneProfile.data})
        })
    }
  }

 

  render() {
    const userData = this.props.user
    const {profile} = this.state
    if (userData.length > 0 && !this.state.isLoading)
    {
        return(
            <div className="profile-page">
                    <ProfilePreview userData= {profile[0] } user = {userData[0].username}/>
                    <div className="one-profile-more">
                        <ProfileInfo userData= {profile } user = {userData[0].username} handleClick = {this.showEdit}/> 
                    </div>
            </div>
        )

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
    profile : state.profile,
    user: state.user.data,
    auth: state.auth
  };
}

export default connect(mapStateToProps)(Profile);
