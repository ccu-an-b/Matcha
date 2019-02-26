import React from 'react';
import TimeAgo from 'react-timeago';
import { formatter, imgPath ,toCapitalize, imagesLoaded} from 'helpers';
import { Link } from 'react-router-dom';

export class ProfilePreview extends React.Component {

    constructor(){
        super()
        this.state ={
            loadImg: true,
        }
    }

    handleImageChange = () => {
        this.setState({
          loadImg: !imagesLoaded(this.imgElement)
        });
    };

    getUserLocation(userData) {
        if (userData.city_user && userData.country_user) {
            return `${userData.city_user}, ${userData.country_user}`;
        } else if (userData.city_ip && userData.country_ip) {
            return `${userData.city_ip}, ${userData.country_ip}`;
        } else {
            return "Unknown";
        }
    }

    render() {
        const { userData, user, onClick, onKeyDown, id } = this.props;
   
        let isUser;

        user === userData.username ? isUser = true : isUser = false
        return (
            <div className="profile grid-area" onClick={onClick} onKeyDown={onKeyDown} id={id}  ref={element => {this.imgElement = element;}}>
                <div className={this.state.loadImg ? "img_loading img_none img": "img_loading img" }>
                    <img    src={imgPath(userData.profile_img)} 
                            alt="profile_img" 
                            onLoad={this.handleImageChange}
                            onError={this.handleImageChange}
                    />
                    <h3>{toCapitalize(userData.username)}</h3>

                    <h5 className={userData.online === 1 || isUser ? 'online' : ' '}>
                        {userData.online === 1 || isUser? 'Online' : <TimeAgo date={parseInt(userData.connexion, 10)} formatter={formatter} />}
                    </h5>
                  
                        {isUser &&
                            <Link to="/settings">
                                <div className="button" id={userData.username} >
                                    <i className="fas fa-sliders-h"></i>
                                </div>
                            </Link>
                        
                        }
                        {!isUser &&
                            <div className="button" id={userData.username} onClick={this.props.handleClick}>
                                <i id={userData.username} className="fas fa-plus"></i>
                            </div>
                        }
                </div>
                <div className="profile-data">
                    <div className="data-details">
                        <h5>Age</h5>
                        <h4>{userData.age}</h4>
                    </div>
                    <div className="data-details">
                        <h5>Location</h5>
                        <h4>{this.getUserLocation(userData)}</h4>
                    </div>
                    <div className="data-details">
                        <h5>Score</h5>
                        <h4>{userData.total}</h4>
                    </div>
                </div>
            </div>
        )
    }

}