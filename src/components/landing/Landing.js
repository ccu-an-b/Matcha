import React from 'react';
import { Link , Redirect, withRouter} from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { connect } from 'react-redux';
import * as actions from 'actions';

export class Landing extends React.Component {
    
    constructor() {
        super();
        this.state = {
            isSignIn: false,
            errors:[],
            redirect: false,
            success: [],
        }
        this.logInUser = this.logInUser.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }

    navigate() {
        this.setState({
            errors:[],
            isSignIn: !this.state.isSignIn
        })
    }

    registerUser(userData){
        actions.register(userData).then(
            (registered) => this.setState({isSignIn: true, success: "Welcome to Matcha !"}),
            (errors) => this.setState({errors})
        );
    }
    
    logInUser(userData){
        this.props.dispatch(actions.login(userData));
    }

    render() {
        const { isAuth, errors} = this.props.auth;
        const { successRegister } = this.props.location.state || false;
        
        const { redirect } = this.state;
        
        if (redirect){
            // return <Redirect to={{pathname: '/', state: { isSignIn: true, redirect:false}}} />
            return 
        }

        return (
            
            <div className="landing-body">
               <div className="landing-shade">
               <nav className="nav">
                    <a onClick={() => { this.navigate()}} className="nav-link">{ this.state.isSignIn ? "SIGN UP" : 'SIGN IN'}</a>  
                </nav>
                        <div className="card text-white landing-content mb-3" >
                            <div className="card-header">
                                <img src={process.env.PUBLIC_URL + '/matcha_logo_3.png'} alt="landing-background"/>
                            </div>
                            <div className="card-body">
                                { this.state.isSignIn ? <LoginForm submitCb={this.logInUser} errors={errors} /> : <RegisterForm submitCb={this.registerUser} errors={this.state.errors} /> }                           
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
export default connect(mapStateToProps)(Landing);