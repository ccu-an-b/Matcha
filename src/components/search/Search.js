import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import queryString from 'query-string'
import { imgPath } from "../../helpers";

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
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
        this.setState({values})
    }

    componentDidUpdate(prevProps) {
        const urlNew = queryString.parse(this.props.location.search);
        const urlOld = queryString.parse( prevProps.location.search);

        if (urlNew !== urlOld ){
            console.log(urlNew.age) 
            console.log(urlNew.search) 
            console.log(urlNew.score) 
            console.log(urlNew.tags) 
            console.log(urlNew.lat) 
            console.log(urlNew.lon) 
        }
        if (this.props.publicData && this.props.publicData.length && this.props.publicData !== prevProps.publicData )
            this.setState({profiles: this.getSuggestions(urlNew.search), filtered: this.getSuggestions(urlNew.search)})
    }

    
    renderProfiles(profiles){
        return profiles.map((profile, index) => {
            return(
                <Link to={`/profile/${profile.label}`} className="one-profile">
                    <img src={imgPath(profile.profile_img)}/>
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
                </div>
                <div className="right">
                    {filtered && this.renderProfiles(filtered)
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
    tags: state.tags
  };
}

export default connect(mapStateToProps)(Search);
