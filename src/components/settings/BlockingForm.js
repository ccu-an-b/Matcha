import React from 'react';
import userService from 'services/user-service';
import { imgPath } from 'helpers';

export class BlockingForm extends React.Component {
    
    constructor(){
        super();
        this.state = {
            selectProfile: false,
        }
    }

    componentWillMount(){
        return userService.getBlockedProfiles()
        .then((profiles) => {this.setState({profiles})})
    }

    renderProfiles(profiles){
        return profiles.map((profile, key) => {
            return (
                <img src={imgPath(profile[0].profile_img)} alt="profile_img" id={profile[0].username} key={key}/>
            )
        })
    }

    render() {
        const {profiles, selectProfile} = this.state
 
        if (profiles){
            return (
                <form>
                    <h1>Manage blocked profiles</h1>
                    <div className="profiles">
                    {profiles.data.length ? this.renderProfiles(profiles.data) :  <p>You didn't blocked anyone.</p>}
                    </div>
                    <button className="button full" disabled={!selectProfile ? "disabled" :"" }>
                        Unblock
                    </button>     
                </form>
            ) 
        }
        else {
            return (
                <div className="page loading">
                   <img src={process.env.PUBLIC_URL+'/loading.gif'} alt="loading_gif"  />
                </div>
            )
        }
    }
}