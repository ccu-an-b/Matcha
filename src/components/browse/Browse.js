import React from "react";
import MapView from './Map';
import { connect } from "react-redux";
import { Link, Redirect } from 'react-router-dom';
import profileService from 'services/profile-service';
import {contains, getValues, distanceInKm} from 'helpers'
import { ProfilePreview } from '../dashboard/ProfilePreview';
import { ProfileInfo } from '../dashboard/ProfileInfo';
import { Filters } from './Filters';
import { MySlider } from './Sliders';
import io from "socket.io-client";

const socket = io('localhost:3001');

export class Browse extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      oneProfile: [],
      showMap: true,
      isLoading: true,
      filtered: false,
      isUpdating: false,
      redirect: false,
      lat: "",
      lon: "",
      profiles: [],
    }
    this.profileRef = React.createRef()
  }

  componentWillMount(){
    profileService.getSuggestedProfiles().then((profiles) => {
      this.setState({profiles : profiles, profilesFilter: profiles, isLoading: false})
    })
    .catch((err) => console.log(err))
  }

  componentDidUpdate(prevProps, prevState) {
    const {form} = this.props

    if (form.filtersForm && form.filtersForm.values && (form !== prevProps.form || this.state.profiles !== prevState.profiles || this.state.isUpdating )) 
    {
      const profilesFilter = this.filterProfiles(form)

      if (prevState.profilesFilter !== profilesFilter && !prevState.isLoading)
        this.setState({profilesFilter, filtered:true, isUpdating: false})
    }
    else if (!prevState.isLoading && ((form.filtersForm && !form.filtersForm.values &&  prevState.filtered )|| this.state.isUpdating ))
    {
      this.setState({profilesFilter: this.state.profiles, filtered: false,  isUpdating: false, lon: "", lat: ""})
    }
  }

  updateSuggestedProfiles(){
    profileService.getSuggestedProfiles().then((profiles) => {
      this.setState({profiles, isUpdating: true})
    })
  }

  switchDisplay = () => {
    this.setState({showMap: !this.state.showMap})
  }

  profileShowMore = event => {
    if (event.target.className === 'fas fa-plus' || event.target.className === 'button' || event.target.className === 'show-more' )
    {
      const username = event.target.id;
      return profileService.setProfileView(username)
        .then((res) => socket.emit('SEND_NOTIFICATION', res.data))
        .then (() => this.updateSuggestedProfiles())
        .then(() =>  profileService.getOneProfile(username))
        .then((oneProfile) => {
          this.setState({oneProfile: oneProfile.data})
          setTimeout(() => this.profileRef.current.scrollIntoView({behavior: 'smooth'}),200)
        })
    }
  }

  profileLike = event =>{
    if (event.target.className === 'fas fa-heart' || event.target.className === 'button' )
    {
      const username = event.target.id;
      return profileService.setProfileLike(username)
        .then((res) =>{
          res.data.map((notification) => {
            socket.emit('SEND_NOTIFICATION', [notification])
            return true
          })
        })
        .then(() => this.updateSuggestedProfiles())
        .then(() => profileService.getOneProfile(username) )
        .then((oneProfile) => {
          this.setState({oneProfile: oneProfile.data})
        })
    }
  }

  renderProfiles(profiles) {
    return profiles.map((profile, index) => {
        return(
          <ProfilePreview   key={index}
                            id={index}
                            user = {this.props.user[0].username}
                            userData={profile}
                            handleClick={this.profileShowMore} 
                          />                         
        )
    });
  }

  profileBlock = event =>{
      const username = event.target.id;
      return profileService.setProfileBlock(username)
        .then ((res) => {
          this.updateSuggestedProfiles()
          this.setState({oneProfile: []})
          this.props.addNotification([res.data.success[0].detail], 'flag', 'You blocked ')
        })
  }

  profileReport = event =>{
    const username = event.target.id;
    return profileService.setProfileReport(username)
      .then ((res) => {
        this.props.addNotification([res.data.success[0].detail], 'flag', 'You reported ')
      })
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
      if(filters.tags){
        filtered = filtered.filter(obj => contains(obj.tags, getValues(filters.tags)));
      }
      if(filters.location)
      {
        const locJson = JSON.parse(filters.location.value)
        this.setState({lat : locJson.lat, lon: locJson.lon, filtered: true})
        filtered = filtered.filter(obj => distanceInKm(obj.latitude_user, obj.longitude_user,locJson.lat,locJson.lon ));
      }
      return filtered
    }
  }
  render() {
    const {user, tags} = this.props
    const {isLoading, oneProfile, showMap, profilesFilter} = this.state

    if (this.state.redirect) {
      return <Redirect to={{pathname:'/'}}/>
    }
    if (user.length > 1 && user[0].complete === 1 && !isLoading) {
      return (
        <div className="browse">
          <div className="type-display"> 
              <div className='btn button full' onClick={this.switchDisplay}>Show {showMap ? 'List' : 'Map'}</div>
          </div>
          <Filters tags={tags}/>

          {showMap &&
            <div id="leaflet-map" className="my-map">
              <MapView publicUserData={profilesFilter} showMore={this.profileShowMore} lat={this.state.lat} lon={this.state.lon} filtered={this.state.filtered}/>
            </div>
          }

          {!showMap && 
            <div className="browse-listing"> 
                <MySlider profiles={this.renderProfiles(profilesFilter) } />
            </div>
          }
            <div ref={this.profileRef} className="one-profile-more">
             {oneProfile.length > 1 &&  <ProfileInfo userData={oneProfile}  user={user[0].username} handleClick={this.profileLike} handleBlock={this.profileBlock} handleReport={this.profileReport}/>}
            </div>
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
            <br /> <Link to="/dashboard">Complete your profile</Link>
          </p>
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
