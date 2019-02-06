import React from 'react';
import TimeAgo from 'react-timeago';
import { formatter, imgPath } from 'helpers';

export class ProfileActions extends React.Component {

    render() {
        const { userData, userInfo, profile} = this.props;
        
        return (
            <div className="profile-left">
                <img src={imgPath(profile[0].profile_img)} alt="profile-img"/>
                <div className="profile-picture-div">
                    <h5 className={profile[0].online === 1 ? 'online' : ''}>{profile[0].online === 1 ? 'Online' : <TimeAgo date={parseInt(profile[0].connexion, 10)} formatter={formatter} />}</h5>
                
                    {userData[0].username !== profile[0].username &&
                    <div className="profile-actions">
                        <i className="fas fa-ban" onClick={this.props.profileBlock}></i>
                        <i className="fas fa-flag" onClick={this.props.profileReport}></i>
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
        )
    }
}