import React from 'react';
import { connect } from 'react-redux';
import authService from 'services/auth-service';
import * as actions from 'actions'; 

import { Redirect } from 'react-router-dom';
import { ProfileGrid } from './ProfileGrid';
import ProfileForm from './ProfileForm';


export class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            errors:[],
            redirect: false,
        }
        this.completeProfile = this.completeProfile.bind(this);
        this.componentWillMounte = this.componentWillMount.bind(this);
    }

    componentWillMount(){
        const userUsername = authService.getUsername() ;
        this.props.dispatch(actions.fetchUserProfile(userUsername))
        this.props.dispatch(actions.fetchTags());
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
                () =>{ this.setState({redirect: true})},
                (errors) => this.setState({errors})
            );
        }
    }


    render(){
        const userData = this.props.user
        const optionTags = this.props.tags

        if (this.state.redirect) {
            return <Redirect to={{pathname:'/'}}/>
        }

        else if(!authService.getUserProfileStatus())
        {
            return (
                <div className="dashboard">
                {userData.length > 1 &&

                    <ProfileGrid userData ={userData} />
                }
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

                {optionTags.length > 1  && userData.length > 1 &&
                    <ProfileForm  submitCb={this.completeProfile} userData={userData}  optionsTags={optionTags}/>
                }        
                    </div>
                </div>
            )
        }
       
    }
}
function mapStateToProps(state) {
    return{
        dashboard: state.dashboard,
        user: state.user.data,
        tags: state.tags.data
    }
}

export default connect(mapStateToProps)(Dashboard)