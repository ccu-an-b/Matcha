import React from "react";
import MapView from './Map';
import { connect } from "react-redux";
import profileService from 'services/profile-service';
//import { format } from "url";

import { ProfilePreview } from '../dashboard/ProfilePreview';
import { ProfileInfo } from '../dashboard/ProfileInfo';
import { Filters } from './Filters';
import { MySlider } from './Sliders';
//import thunk from "redux-thunk";

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
    this.profileLike = this.profileLike.bind(this);
  }

  componentWillMount(){
    profileService.getSuggestedProfiles().then((profiles) => {
      this.setState({profiles , profilesFilter: profiles.data, isLoading: false})
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {form} = this.props

    if (form.filtersForm && form.filtersForm.values && (form !== prevProps.form || this.state.profiles !== prevState.profiles )) {
      const profilesFilter = this.filterProfiles(form)

      if (prevState.profilesFilter !== profilesFilter && !prevState.isLoading)
        this.setState({profilesFilter})
    }
  }

  updateSuggestedProfiles(){
    profileService.getSuggestedProfiles().then((profiles) => {
      this.setState({profiles})
    })
  }

  switchDisplay(){
    this.setState({showMap: !this.state.showMap})
  }

  profileShowMore(event){
    if (event.target.className === 'fas fa-plus' || event.target.className === 'button' )
    {
      const username = event.target.id;
      return profileService.setProfileView(username)
        .then (() => {this.updateSuggestedProfiles()})
        .then(() => { return profileService.getOneProfile(username)})
        .then((oneProfile) => {
          this.setState({oneProfile: oneProfile.data})
          this.profileRef.current.scrollIntoView({behavior: 'smooth'})
        })
    }
  }

  profileLike(event){
    if (event.target.className === 'fas fa-heart' || event.target.className === 'button' )
    {
      const username = event.target.id;
      return profileService.setProfileLike(username)
        .then (() => {this.updateSuggestedProfiles()})
        .then(() => { return profileService.getOneProfile(username)})
        .then((oneProfile) => {
          this.setState({oneProfile: oneProfile.data})
        })
    }
  }

  renderProfiles(profiles) {
    return profiles.map((profile, index) => {
        return(
             <ProfilePreview  key={index}
                              id={index}
                              user = {this.props.user[0].username}
                              userData={profile}
                              handleClick={this.profileShowMore} 
                              />                         
        )
    });
  }

  filterProfiles(form){
    if (form.filtersForm && form.filtersForm.values){
      const filters = form.filtersForm.values;
      let filtered = this.state.profiles.data;

      if (filters.age){
        filtered = filtered.filter(obj => obj.age >= filters.age[0] && obj.age <= filters.age[1])
      }
      if (filters.score){
        filtered = filtered.filter(obj => obj.total >= filters.score[0] && obj.total <= filters.score[1])
      }
      return filtered
    }
  }
 
  render() {
    const {user, tags} = this.props
    const {isLoading, oneProfile, showMap, profilesFilter} = this.state
  
    if (user.length > 1 && user[0].complete === 1 && !isLoading) {
      return (
        <div className="browse">
          <div className="type-display"> 
              <div className='btn button full' onClick={this.switchDisplay}>Show {showMap ? 'List' : 'Map'}</div>
          </div>
          <Filters tags={tags}/>

          {showMap &&
            <div id="leaflet-map"><MapView /></div>
          }

          {!showMap && 
            <div className="browse-listing"> 
                <MySlider profiles={this.renderProfiles(profilesFilter) } />
              {oneProfile.length >1 &&
                <div ref={this.profileRef} className="one-profile-more">
                  <ProfileInfo userData={oneProfile }  user={user[0].username} handleClick={this.profileLike} />
                </div>
              }
            </div>
          }
        </div>
      )
    } 
    else if (user.length > 1 && user[0].complete === 0 && !isLoading) {
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
    auth: state.auth,
    tags: state.tags,
    form: state.form
  };
}

export default connect(mapStateToProps)(Browse);
