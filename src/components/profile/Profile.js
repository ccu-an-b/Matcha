import React from "react";
import { connect } from "react-redux";
import { Link , Redirect} from 'react-router-dom';
import profileService from 'services/profile-service';
import TimeAgo from 'react-timeago';
import { imgPath, formatter } from 'helpers';

import { ProfileInfo } from '../dashboard/ProfileInfo';


export class Profile extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      profile: [],
      isLoading: true,
      username: "",
      notFound: false,
      redirect: false
    }
    this.profileLike = this.profileLike.bind(this);
    this.profileBlock = this.profileBlock.bind(this);
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

  profileLike(event){
    if (event.target.className === 'fas fa-heart' || event.target.className === 'button' )
    {
      const username = event.target.id;
      return profileService.setProfileLike(username)
        .then (() => this.updateProfile(username))
    }
  }
  profileBlock(event){
    if (event.target.className === 'fas fa-ban')
    {
      // const username = event.target.id;
      return profileService.setProfileBlock(this.state.username)
        .then (() => this.setState({redirect: true}))
    }
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
                    <div className="profile-left">
                      <img src={imgPath(profile[0].profile_img)} alt="profile-img"/>
                      <div className="profile-picture-div">
                      <h5 className={profile[0].online === 1 ? 'online' : ''}>{profile[0].online === 1 ? 'Online' : <TimeAgo date={parseInt(profile[0].connexion, 10)} formatter={formatter} />}</h5>
                       {userData[0].username !== profile[0].username &&
                        <div className="profile-actions">
                          <i className="fas fa-ban" onClick={this.profileBlock}></i>
                          <i className="fas fa-flag"></i>
                        </div>
                       }
                      </div>
                      {userInfo&& userInfo[0].type > 1 &&
                        <div className={userInfo[0].type === 3 ? "profile-user-info match" : "profile-user-info like" }>
                         {userInfo[0].type === 2 &&
                             <h2>Liked your profile</h2>
                         }
                         {userInfo[0].type === 3 &&
                             <h2>It's a match !</h2>
                         }
                        </div>
                      }
                      {userInfo&& userData[0].username !== profile[0].username &&
                        <div className="profile-user-info">
                         {parseInt(userInfo[0].seen,10) > 0 &&
                             <h2>Checked your profile <span>{userInfo[0].seen}</span> times</h2>
                         }
                         {parseInt(userInfo[0].seen,10) <= 0 &&
                             <h2>Haven't check your profile yet</h2>
                         }
                        </div>
                      }
                    </div>

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
