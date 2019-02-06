import React from "react";
import { connect } from "react-redux";
import { Link , Redirect} from 'react-router-dom';
import profileService from 'services/profile-service';

import { ProfileInfo } from '../dashboard/ProfileInfo';
import { ProfileActions } from './ProfileActions';

export class Profile extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      notFound: false,
      redirect: false
    }
  }

  componentWillMount(){
    const username = this.props.match.params.username;
    this.updateProfile(username)
    this.setState({username})
  }

  updateProfile(username){
    return profileService.getOneProfile(username).then((profile) => {
      if(!profile.data || profile.data[0].complete === 0|| profile.data[0].match < 0){
        throw profile
      }
      this.setState({profile: profile.data})
      if(this.state.isLoading){
        profileService.setProfileView(username)
      }
    })
    .then(() => profileService.getUserInfo(username))
    .then((userInfo) => this.setState({userInfo: userInfo.data, isLoading: false}))
    .catch(() => {this.setState({notFound: true,  isLoading: false})})

  }

  profileLike = () => {
      return profileService.setProfileLike(this.state.username)
        .then (() => this.updateProfile(this.state.username))
  }
  profileBlock = () => {
      return profileService.setProfileBlock(this.state.username)
        .then (() => {
            this.setState({redirect: true})
            this.props.addNotification(this.state.profile, 'flag', 'You blocked ')
        })
  }
  profileReport = () =>{
      // const username = event.target.id;
      return profileService.setProfileReport(this.state.username)
        .then (() => {
          this.props.addNotification(this.state.profile, 'flag', 'You reported ')
        })
    }
  

  render() {
    const userData = this.props.user
    const {profile, userInfo, notFound, isLoading} = this.state
    
    if (this.state.redirect) {
        return <Redirect to={{pathname:'/'}}/>
    }
    else if(notFound){
      return (
        <div className="profile-not-completed">
        <div className="header">
          <h1>Not found</h1>
        </div>
        <p>
          Sorry the profile you're looking for can't be display.
          <br /> <Link to="/browse">Return to browse</Link>
        </p>
      </div>
      )
    }
    else if (userData.length > 0 && !isLoading)
    {
        return(
            <div className="profile-page">
              <ProfileActions profile={profile} userInfo={userInfo} userData={userData} profileBlock={this.profileBlock} profileReport={this.profileReport}/> 
              <div className="one-profile-more">
                  <ProfileInfo userData={profile} user={userData[0].username} handleClick={this.profileLike} handleBlock={this.profileBlock}/> 
              </div>
            </div>
        )
    }
    else {
        return (
            <div className="page loading">
               <img src={process.env.PUBLIC_URL+'/loading.gif'} alt="loading_gif"  />
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
