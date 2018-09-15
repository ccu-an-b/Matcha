import React from 'react';
import { Link , withRouter} from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { connect } from 'react-redux';
import * as actions from 'actions';

export class Landing extends React.Component {
    
    constructor() {
        super();
        this.state = {
            isSignIn: false
        }
        this.logInUser = this.logInUser.bind(this);
    }

    navigate() {
        this.setState({
            isSignIn: !this.state.isSignIn
        })
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
               <nav className="nav">
                    <a onClick={() => { this.navigate()}} className="nav-link" href="#">{ this.state.isSignIn ? "SIGN UP" : 'SIGN IN'}</a>  
                </nav>
                        <div className="card text-white landing-content mb-3" >
                            <div className="card-header">
                                <img src={process.env.PUBLIC_URL + '/matcha_logo_3.png'} alt="landing-background"/>
                            </div>
                            <div className="card-body">
                                { this.state.isSignIn ? <LoginForm submitCb={this.logInUser} errors={errors} /> : <RegisterForm submitCb={this.logInUser} errors={errors} /> }                           
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