import React from 'react';
import TimeAgo from 'react-timeago';
import { formatter } from 'helpers';

// export function ProfilePreview(props) {
export class ProfilePreview extends React.Component {

    render(){
        const userData = this.props.userData;
        const user = this.props.user

        let isUser;
        user === userData.username ? isUser = true : isUser= false
        return (
            <div className="profile grid-area">
            <div className="img">
                <img src={process.env.PUBLIC_URL+'img/'+userData.profile_img} alt="profile_img"/>
                <h3>{userData.first_name}</h3>
                
                <h5 className={userData.online === 1 ? 'online' : ' ' }>
                    {userData.online === 1 ? 'Online' : <TimeAgo date={parseInt(userData.connexion, 10)} formatter={formatter} /> }
                </h5>
                <div className="button" id={userData.username} onClick={this.props.handleClick}>
                    {isUser &&
                        <i className="fas fa-sliders-h"></i>
                    }
                    {!isUser &&
                        // <i className="fas fa-heart"></i>
                        <i id={userData.username} className="fas fa-plus"></i>
                    }
                </div>
            </div>
            <div className="profile-data">
                <div className="data-details">
                <h5>Age</h5>
                <h4>{userData.age}</h4>
                </div>
                <div className="data-details">
                <h5>Location</h5>
                <h4>{userData.location}</h4>
                </div>
                <div className="data-details">
                <h5>Score</h5>
                <h4>150</h4>
                </div>
            </div>
            {/* <div className="profile-more">
            <h5 id={userData.username} onClick={this.props.handleClick}>Show more</h5>
            </div> */}
        </div>
        )
    }
    
}