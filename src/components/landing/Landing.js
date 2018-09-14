import React from 'react';
import { Link , withRouter} from 'react-router-dom';
import LoginForm from './LoginForm';
import { connect } from 'react-redux';
import * as actions from 'actions';

export class Landing extends React.Component {

    constructor() {
        super();

        this.logInUser = this.logInUser.bind(this);
    }
    logInUser(userData){
        this.props.dispatch(actions.login(userData));
    }

    render() {
        const { isAuth, errors} = this.props.auth;
        const { successRegister } = this.props.location.state || false;


        return (
            
            <div className="landing-body">
               <div className="landing-shade">
                    <div className="card text-white landing-content mb-3" >
                        <div className="card-header"><img src={process.env.PUBLIC_URL + '/matcha_logo_3.png'} alt="landing-background"/></div>
                        <div className="card-body">
                            <LoginForm submitCb={this.logInUser} errors={errors} />                           
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state){
    return {
        auth: state.auth
    }
}
export default withRouter(connect(mapStateToProps)(Landing));