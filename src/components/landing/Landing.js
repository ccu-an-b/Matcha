import React from 'react';
import {Redirect} from 'react-router-dom';
import LoginForm from './LoginForm';
import Modal from '../shared/modal/Modal';
import RegisterForm from './RegisterForm';
import PasswordForm from './PasswordForm';
import { connect } from 'react-redux';
import * as actions from 'actions';
import userService from 'services/user-service';


export class Landing extends React.Component {

    constructor() {
        super();
        this.state = {
            isSignIn: false,
            isSignUp: false,
            isPassword: false,
            errors:[],
            redirect: false,
            success: [],
            show:false,
            test:false,
        }
    }

    showModal = formType => {
        if(formType === "signIn")
            this.setState({
                show: true, 
                isSignIn: true ,
            })
        else if(formType === "signUp")
            this.setState({
                show: true, 
                isSignUp: true ,
            })
        else
            this.setState({
                show: true, 
                isSignIn: false,
                isPassword: true ,
            })
    }
    
    hideModal = event => {
        if(event.target.id.includes('closeModal') ||event.target.nodeName === 'path' || event.target.nodeName ==='svg')
        {
            this.setState({
                show: false ,
                isSignIn: false,
                isSignUp: false,
                isPassword: false,
                errors:[],
            })
        }
    }

    registerUser = userData => {
        this.setState({errors: []})
        actions.register(userData)
        .then((res) => {
            if (res.error)
                    throw(res.error)
            this.setState({
                isSignUp: false,
                isSignIn: true,
                success: "Welcome to Matcha ! Check your email to activate your account. "})
        })
        .catch((errors) =>  this.setState({errors: [errors[0]]}))
    }
    
    logInUser = userData => {
        this.setState({errors: []})
        this.props.dispatch(actions.login(userData));
    }

    passwordUser = userData => {
        this.setState({errors: []})
        return userService.forgottenPassword(userData)
        .then((res) => {
            if (res.error)
                throw(res.error)
            this.setState({
                openTab: 0,
                success: "Check your email we sent you a retrieving link !"
            })
    
        })
        .catch((err) => this.setState({errors: [err[0]]}))
    }
    render() {
        const { isAuth, errors} = this.props.auth;

        if (isAuth){
            return <Redirect to={{pathname: '/dashboard'}} />
        }
        else
        {
            return (
            
                <div className="landing-body">
                   <div className="landing-shade">
                    </div>
                    <nav className="nav">
                        <div className="button cl-org" onClick={() => { this.showModal('signIn')}}>SIGN IN</div>  
                    </nav>
                    <div className="landing-content">
                        <h1>Match me if you can...</h1>
                        <div className="button sign_up full" onClick={() => { this.showModal('signUp')}}>Sign up</div>
                    </div>
    
                   { this.state.isSignIn ? <Modal show={this.state.show} handleClose={this.hideModal} children={<LoginForm submitCb={this.logInUser} errors={errors} success={this.state.success} activate={false} handlePassword={this.showModal} />} modalType={"form"}/> : "" } 
                   { this.state.isSignUp ? <Modal show={this.state.show} handleClose={this.hideModal} children={<RegisterForm submitCb={this.registerUser} errors={this.state.errors}  />}  modalType={"form"} /> : "" } 
                   { this.state.isPassword ? <Modal show={this.state.show} handleClose={this.hideModal} children={<PasswordForm submitCb={this.passwordUser} errors={this.state.errors}  success={this.state.success} />}  modalType={"form"} /> : "" } 
                </div>
                
            )
        }
        
    }
}


function mapStateToProps(state){
    return {
        auth: state.auth,
    }
}
export default connect(mapStateToProps)(Landing);