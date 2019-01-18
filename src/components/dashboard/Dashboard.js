import React from 'react';
import { connect } from 'react-redux';
import authService from 'services/auth-service';
import * as actions from 'actions'; 

import { Redirect } from 'react-router-dom';
import { ProfileGrid } from './ProfileGrid';
import ProfileForm from './ProfileForm';


export class Dashboard extends React.Component {
    constructor(){
        super()
        this.state ={
            errors:[],
            redirect: false
        }
        this.completeProfile = this.completeProfile.bind(this);
    }

    completeProfile(profileData){
        if (profileData.image)
        {
            actions.uploadImage(profileData.image.slice()).then(
                (uploadedImage) => {
                    profileData.image = uploadedImage;
                    actions.completeProfile(profileData).then(
                        () => this.setState({redirect: true}),
                        (errors) => this.setState({errors})
                    )}
                )
        }
        else
        {
            actions.completeProfile(profileData).then(
                () => this.setState({redirect: true}),
                (errors) => this.setState({errors})
            );
        }
    }

    render(){

        if (this.state.redirect) {
            return <Redirect to={{pathname:'/'}}/>
        }

        if(authService.getUserProfileStatus())
        {
            return (
                <div className="dashboard">
                    <ProfileGrid/>
                </div>
            )
        }
        else
        {   
            return (
                <div className="dashboard">
                    <div className="profile-not-completed">
                        <div className="header">
                            <h1>Can't wait for your next date ?</h1>
                        </div>
                            <p>Before you start looking for new matchs you have to complete your profile information.</p>
                    </div>
                    <div className="profile-form">
                        <div className="header">
                            <h1>Create your profile</h1>
                        </div>
                    <ProfileForm  submitCb={this.completeProfile} />
                    </div>
                </div>
            )
        }
       
    }
}
function mapStateToProps(state) {
    return{
        auth: state.auth,
        dashboard: state.dashboard
    }
}

export default connect(mapStateToProps)(Dashboard)