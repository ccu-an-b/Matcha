import React from 'react';
import { connect } from 'react-redux';
import authService from 'services/auth-service';

export class Browse extends React.Component {
    
    render(){

        if(authService.getUserProfileStatus())
        {
            return (
                <div>Ok: ready for browsing</div>
            )
        }
        else
        {   
            return (
                <div class="profile-not-completed">
                    <div class="header">
                        <h1>Can't wait for your next date ?</h1>
                    </div>
                        <p>Before you start looking for new matchs you have to complete your profile information. <a href="/dashboard">Complete your profile</a></p>
                </div>
            )
        }
       
    }
}
function mapStateToProps(state) {
    return{
        auth: state.auth,
    }
}

export default connect(mapStateToProps)(Browse)