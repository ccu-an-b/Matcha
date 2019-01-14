import React from 'react';
import { connect } from 'react-redux';
import authService from 'services/auth-service';

import { ProfileGrid } from './ProfileGrid';

export class Dashboard extends React.Component {
    constructor(){
        super()
        this.state ={
            errors:[],
        }
    }

    render(){

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
                <div>not complete</div>
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