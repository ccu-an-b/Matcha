import React from 'react';
import { Link } from 'react-router-dom';
import { imgPath, toCapitalize } from 'helpers';
import userService from 'services/user-service';
export class ConnectedUsers extends React.Component {

    constructor() {
        super()
        this.state = {
            profiles: [],
            isLoading: true
        }
    }
    componentDidMount() {
        return userService.getNotificationsType(3).then((profiles) => {
            this.setState({ profiles: profiles.data, isLoading: false });
        })
            .catch((err) => { console.log(err) })
    }
    renderProfiles = profiles => {
        return profiles.map((profile, index) => {
            return (
                <Link to={`/profile/${profile.username}`} key={index}>
                    <div className="one-match" id={profile.username}>
                        <div className="one-match-content">
                            <img src={imgPath(profile.profile_img)} alt="profile_img" />
                            <div className="match-info">
                                <h4>{toCapitalize(profile.username)}</h4>
                                {profile.online ? <h5 className="match-online">Online</h5> : <h5 className="match-offline">Offline</h5>}
                            </div>
                        </div>
                    </div>
                </Link>
            )
        });
    }
    render() {
        const { profiles, isLoading } = this.state
        return (
            <div className="display-matchs">
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