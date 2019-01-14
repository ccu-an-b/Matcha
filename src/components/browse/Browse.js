import React from 'react';
import { connect } from 'react-redux';
import authService from 'services/auth-service';

export class Browse extends React.Component {
    
    render(){

        if(authService.getUserProfileStatus())
        {
            return (
                <div>ok 1</div>
            )
        }
        else
        {   
            return (
                <div>not complete 1</div>
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