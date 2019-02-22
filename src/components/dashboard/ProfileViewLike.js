import React from 'react';
import { imgPath, toCapitalize, imagesLoaded } from 'helpers';
import { Link } from 'react-router-dom';
import userService from 'services/user-service';

export class ProfileViewLike extends React.Component {

    constructor(){
        super()
        this.state ={
            profiles: [],
            isLoading : true,
            loadImg: true,
        }
    }

    componentDidMount(){
        return userService.getNotificationsType(this.props.type).then((profiles)=>{
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
                <Link key={index} to={`/profile/${profile.username}`}>
                    <div className={profile.online === 0 ?"one-profile" : "one-profile online"} id={profile.username}>
                        <div className= {this.state.loadImg ? "img img_loading img_none": "img img_loading" }>
                        <img    src={ imgPath(profile.profile_img)} 
                                alt="profile_img"
                                onLoad={this.handleImageChange}
                                onError={this.handleImageChange}
                        />
                        </div>
                        <h4>{toCapitalize(profile.username)}</h4>
                    </div>   
                </Link>           
            )
        });
    }
    render(){
        const {profiles, isLoading }= this.state
        return(
            <div className="profiles-display" ref={element => {this.imgElement = element;}}>
                {!isLoading && profiles.length > 0 &&
                    this.renderProfiles(profiles) 
                }
                {!isLoading && !profiles.length &&  
                    <h2>You don't have any activity yet ...</h2>
                }
            </div>
        )
    }
}
