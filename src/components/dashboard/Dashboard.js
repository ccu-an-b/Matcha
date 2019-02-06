import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions'; 
import authService from 'services/auth-service';
import { ProfileGrid } from './ProfileGrid';
import ProfileForm from './ProfileForm';

export class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            errors:[],
        }
    }

    componentDidMount(){
       this.updateProps()
    }

    updateProps(){
        this.props.dispatch(actions.fetchUserProfile(authService.getUsername()))
        this.props.dispatch(actions.fetchTags())
    }
    completeProfile = profileData =>{
        if (profileData.image)
        {
            actions.uploadImage(profileData.image.slice()).then(
                (uploadedImage) => {
                    profileData.image = uploadedImage;
                    actions.completeProfile(profileData).then(
                        () => this.updateProps(),
                        (errors) => this.setState({errors})
                    )}
                )
        }
        else
        {
            actions.completeProfile(profileData).then(
                () =>  this.updateProps(),
                (errors) => this.setState({errors})
            )
        }
    }

    render(){
        const userData = this.props.user
        const optionTags = this.props.tags

        if(userData.length > 1 && userData[0].complete === 1)
        {
            return (
                <div className="dashboard">
                {userData.length > 1 && userData[0].id === this.props.auth.userId  &&

                    <ProfileGrid userData ={userData} editProfile={this.completeProfile} optionsTags={optionTags}/>
                }
                </div>
            )
        }
        else if(userData.length > 1 && userData[0].complete === 0)
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

                {optionTags.length > 1  && userData.length > 1 && userData[0].id === this.props.auth.userId &&
                    <ProfileForm  submitCb={this.completeProfile} userData={userData}  optionsTags={optionTags}/>
                }        
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="page loading">
                   <img src={process.env.PUBLIC_URL+'loading.gif'} alt="loading_gif"  />
                </div>
            )
        }
    }
}
function mapStateToProps(state) {
    return{
        dashboard: state.dashboard,
        user: state.user.data,
        tags: state.tags.data,
        auth: state.auth,
        form: state.form
    }
}

export default connect(mapStateToProps)(Dashboard)