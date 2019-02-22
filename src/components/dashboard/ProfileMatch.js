import React from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { imgPath, toCapitalize, formatter, imagesLoaded } from 'helpers';
import userService from 'services/user-service';
export class ProfileMatch extends React.Component {

    constructor(){
        super()
        this.state ={
            profiles: [],
            isLoading : true,
            loadImg: true,
        }
    }
    componentDidMount(){
        return userService.getNotificationsType(3).then((profiles)=>{
            this.setState({profiles: profiles.data, isLoading : false})
        })
        .catch((err) => {console.log(err)})
    }

    handleImageChange = () => {
        this.setState({
          loadImg: !imagesLoaded(this.imgElement)
        });
    };

    renderProfiles = profiles =>{
        return profiles.map((profile, index) => {
            return(
                <Link to={`/profile/${profile.username}`} key={index}>
                    <div className="one-match" id={profile.username}>
                        <div className="one-match-content">
                        <div className={this.state.loadImg ? "img_loading img_none": "img_loading" }>
                            <img    src={ imgPath(profile.profile_img)} 
                                    alt="profile_img"
                                    onLoad={this.handleImageChange}
                                    onError={this.handleImageChange}
                            />
                        </div>
                        <div className="match-info">
                        <h4>{toCapitalize(profile.username)}, {profile.age} </h4>
                            <h5 >Matched <TimeAgo date={parseInt(profile.date, 10)} formatter={formatter} /> </h5>
                        </div>
                        </div>
                    </div>
                </Link>
            )
        });
    }
    render(){
        const {profiles, isLoading }= this.state
        return(
            <div className="display-matchs" ref={element => {this.imgElement = element;}}>
                {!isLoading && profiles.length > 0 &&
                    this.renderProfiles(profiles) 
                }
                {!isLoading && !profiles.length &&  
                    <h2>You don't have any matchs </h2>
                }
            </div>
        )
    }
}