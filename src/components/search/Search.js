import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import queryString from 'query-string'
import { imgPath , contains, distanceInKm, getValues} from "../../helpers";
import * as actions from 'actions';
import FiltersForm from "./Filters";

class Search extends React.Component {
    _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      profiles: [],
      filtered: [],
      values: [],
    }
  }

    getSuggestions = (value) => {
        if (!value || value === '') {
            return this.props.publicData;
        }
        const regex = new RegExp('^' + value, 'i');
        return this.props.publicData.filter(profile => regex.test(profile.label))
    }

    componentWillMount() {
        const values = queryString.parse(this.props.location.search)
        this.props.dispatch(actions.fetchPublicData())
        this.setState({values})
    }

    componentWillUnmount() {
        this._isMounted = false;
    }    

    componentDidUpdate(prevProps, prevState) {
        const urlNew =this.props.location.search;
        const urlOld = prevProps.location.search;
        const {form} = this.props;
        let suggestions ;

        if (this.props.publicData && this.props.publicData.length && this.props.publicData !== prevProps.publicData)
        {
            suggestions = this.getSuggestions(queryString.parse(urlNew).search)
            if (!suggestions.length)
                suggestions= undefined;
            this.setState({
                profiles: suggestions, 
                filtered: suggestions
            })
           this._isMounted =true;
        }
        if (urlNew !== urlOld && this.props.publicData && this._isMounted){
            suggestions = this.getSuggestions(queryString.parse(urlNew).search)
            if (!suggestions.length)
                suggestions= undefined;
            // console.log(queryString.parse(urlNew).age) 
            // console.log(queryString.parse(urlNew).search) 
            // console.log(queryString.parse(urlNew).score) 
            // console.log(queryString.parse(urlNew).tags) 
            // console.log(queryString.parse(urlNew).lat) 
            // console.log(queryString.parse(urlNew).lon) 
            this.setState({
                profiles: suggestions, 
                filtered: suggestions
            })
        }
        if (this._isMounted && form.filterSearch && form.filterSearch.values && (form !== prevProps.form || this.state.profiles !== prevState.profiles)) 
        {
            const profilesFilter = this.filterProfiles(form)

            if (prevState.profilesFilter !== profilesFilter && !prevState.isLoading)
                this.setState({filtered:profilesFilter})
        }
    }

    filterProfiles(form){
        if (form.filterSearch && form.filterSearch.values){
          const filters = form.filterSearch.values;
          let filtered = this.state.profiles;
    
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
            filtered = filtered.filter(obj => distanceInKm(obj.latitude_user, obj.longitude_user,locJson.lat,locJson.lon ));
          }
          return filtered
        }
      }

    
    renderProfiles(profiles){
        return profiles.map((profile, index) => {
            return(
                <Link to={`/profile/${profile.label}`} className="one-profile" key={index}>
                    <img src={imgPath(profile.profile_img)} alt="profile_img"/>
                    <div className="one-profile-info">
                        <h4>{profile.label}, {profile.age}</h4>
                        <h5>{profile.city_user}, {profile.country_user}</h5>
                    </div>
                </Link>
            )
        })

    }
    render() {
        const {filtered} = this.state

        return(
            <div className="search-page">
                <div className="left">
                {this.props.tags &&
                    <FiltersForm tags={this.props.tags}/>
                }
                </div>
                <div className="right">
                    {filtered ? 
                        this.renderProfiles(filtered) : 
                        <h2>No result found</h2>
                    }         

                    {!this._isMounted && 
                        <div className="page loading">
                            <img src={process.env.PUBLIC_URL+'/loading.gif'} alt="loading_gif"  />
                        </div>
                    }
                </div>
            
            </div>
        )
    }
}
function mapStateToProps(state) {
  return {
    search: state.search,
    publicData: state.publicData.data,
    tags: state.tags,
    form: state.form
  };
}

export default connect(mapStateToProps)(Search);