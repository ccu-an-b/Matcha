import React from 'react';
import LoginForm from '../landing/LoginForm';
import ChangePasswordForm from './ChangePasswordForm';
import Modal from '../shared/modal/Modal';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from 'actions';
import userService from 'services/user-service';

export class Password extends React.Component {

    constructor() {
        super();
        this.state = {
            errors:[],
            isChange: false,
            success:[],
            keyExist: true
        }
    }
    componentWillMount(){
        const activationKey = this.props.match.params.key;
        if (activationKey){
            return userService.getFromKey({key : this.props.match.params.key })
                .then((res) => {
                    if (res.error)
                        this.setState({keyExist: false})
                })
        }
    }
    
    changePassword = (userData) =>{
        userData.key =this.props.match.params.key
        return userService.changePassword(userData)
        .then((res) => {
            if (res.error)
                throw(res.error)
            this.setState({isChange: true})
        })
        .catch((err) => this.setState({errors: [err[0]]}))
    }

    logInUser = userData =>{
        this.props.dispatch(actions.login(userData));
    }

    render() {
        const { isAuth, errors} = this.props.auth;
        const  {success, isChange, keyExist} = this.state

        if (isAuth || !keyExist || !this.props.match.params.key){
            return <Redirect to={{pathname: '/dashboard'}} />
        }
    
        else
        {
            return (
                <div className="landing-body">
                   <div className="landing-shade">
                    </div>
                    <nav className="nav">
                        <div className="button cl-org" >SIGN IN</div>  
                    </nav>
                    <div className="landing-content">
                        <h1>Match me if you can...</h1>
                        <div className="button sign_up full" >Sign up</div>
                    </div>
    
                    {isChange ?
                        <Modal show={true} handleClose={this.hideModal} children={<LoginForm submitCb={this.logInUser} errors={errors} success={success} changePassword={true}/>} modalType={"form"} close={true}/> :
                        <Modal show={true} handleClose={this.hideModal} children={<ChangePasswordForm submitCb={this.changePassword} errors={errors}/>} modalType={"form"} close={true}/>
                    }
                  
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
export default connect(mapStateToProps)(Password);