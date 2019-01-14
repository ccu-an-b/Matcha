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
        actions.completeProfile(profileData).then(
            () => this.setState({redirect: true}),
            (errors) => this.setState({errors})
        )
    }

    render(){

        if (this.state.redirect) {
            return <Redirect to={{pathname:'/'}}/>
        }

        if(authService.getUserProfileStatus())
        {
            return (
                <div class="dashboard">
                    <ProfileGrid/>
                </div>
            )
        }
        else
        {   
            return (
                <div class="dashboard">
                    <div class="profile-not-completed">
                        <div class="header">
                            <h1>Can't wait for your next date ?</h1>
                        </div>
                            <p>Before you start looking for new matchs you have to complete your profile information.</p>
                    </div>
                    <div class="profile-form">
                    <ProfileForm  submitCb={this.completeProfile}       
                                    errors={this.state.errors}/>
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