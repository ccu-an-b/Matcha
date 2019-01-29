import React from 'react';
import TimeAgo from 'react-timeago';
import { imgPath, toCapitalize, formatter } from 'helpers';
import userService from 'services/user-service';
export class ProfileMatch extends React.Component {

    constructor(){
        super()
        this.state ={
            profiles: [],
            isLoading : true
        }
        this.renderProfiles = this.renderProfiles.bind(this);
    }
    componentDidMount(){
        return userService.getNotificationsType(3).then((profiles)=>{
            this.setState({profiles: profiles.data, isLoading : false})
        })
        .catch((err) => {console.log(err)})
    }
    renderProfiles(profiles){
        return profiles.map((profile, index) => {
            return(
                <div className="one-match" key={index} id={profile.username}>
                    <div className="one-match-content">
                    <img src={ imgPath(profile.profile_img)} alt="profile_img"/>
                    <div className="match-info">
                    <h4>{toCapitalize(profile.username)}, {profile.age} </h4>
                        <h5 >Matched <TimeAgo date={parseInt(profile.date, 10)} formatter={formatter} /> </h5>
                    </div>
                    </div>
                </div>
            )
        });
    }
    render(){
        const {profiles, isLoading }= this.state
        return(
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