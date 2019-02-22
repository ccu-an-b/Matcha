import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { imgPath , contains, distanceInKm, getValues, string_to_array, sort_profiles} from "../../helpers";
import * as actions from 'actions';
import FiltersForm from "./Filters";
import SortForm from "./Sort";

class Search extends React.Component {
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {
        profiles: [],
        filtered: [],
        values: [],
        order: false,
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
        const {profiles, order, filtered} = this.state;
        let suggestions ;

        if (this.props.publicData && this.props.publicData.length && this.props.publicData !== prevProps.publicData)
        {
            suggestions = this.getSuggestions(queryString.parse(urlNew).search)
            if (!suggestions.length)
                suggestions= undefined;
            this.setState({
                profiles: suggestions, 
                filtered: suggestions,
            })
            
           this._isMounted =true;
        }
        if (urlNew !== urlOld && this.props.publicData && this._isMounted){
            suggestions = this.getSuggestions(queryString.parse(urlNew).search)
            if (!suggestions.length)
                suggestions= undefined;
            this.setState({
                profiles: suggestions, 
                filtered: suggestions,
            })
        }
        if (this._isMounted && form.filterSearch && form.filterSearch.values && (form.filterSearch !== prevProps.form.filterSearch || profiles !== prevState.profiles)) 
        {
            const profilesFilter = this.filterProfiles(form)

            if (prevState.profilesFilter !== profilesFilter && !prevState.isLoading)
                this.setState({filtered:profilesFilter})
        }
        if (this._isMounted && form.sortSearch && form.sortSearch.values && (form.sortSearch !== prevProps.form.sortSearch || profiles !== prevState.profiles || order !== prevState.order)) 
        {
            if (form.sortSearch.values.sort)
                this.setState({filtered: sort_profiles(filtered, form.sortSearch.values.sort.value, order ? 'asc' : 'desc')})
            else
                this.setState({filtered: sort_profiles(filtered, "username", order ? 'asc' : 'desc')})
        }
    }

    filterProfiles(form){
        if (form.filterSearch && form.filterSearch.values)
        {
            const filters = form.filterSearch.values;
            let filtered = this.state.profiles;
    
            if (filters.age)
                filtered = filtered.filter(obj => obj.age >= filters.age[0] && obj.age <= filters.age[1])
            
            if (filters.score)
                filtered = filtered.filter(obj => obj.total >= filters.score[0] && obj.total <= filters.score[1])
            
            if (filters.tags)
                filtered = filtered.filter(obj => contains(obj.tags, getValues(filters.tags)));
            
            if (filters.location)
            {
                const locJson = JSON.parse(filters.location.value)
                filtered = filtered.filter(obj => distanceInKm(obj.latitude_user, obj.longitude_user,locJson.lat,locJson.lon ));
            }
            return filtered
        }
      }

    orderProfiles = () => {
        const {form} = this.props;
        if (form.sortSearch && form.sortSearch.values)
            this.setState({order: !this.state.order})
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
        const {filtered, order} = this.state;
        const values = queryString.parse(this.props.location.search);

        return(
            <div className="search-page">
                <div className="left">
                <SortForm
                    order={order}
                    triggerOrder={this.orderProfiles}
                />
                {this.props.tags &&
                    <FiltersForm 
                        tags={this.props.tags}
                        defaultAge={string_to_array(values.age)} 
                        defaultScore={string_to_array(values.score)} 
                        defaultTags={string_to_array(values.tags)} 
                        defaultLat={values.lat} 
                        defaultLocation={values.location} 
                    />
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
