import React from 'react';
import {Redirect} from 'react-router-dom';
import LoginForm from '../landing/LoginForm';
import Modal from '../shared/modal/Modal';
import { connect } from 'react-redux';
import * as actions from 'actions';

export class Activate extends React.Component {
    constructor() {
        super();
        this.state = {
            errors:[],
            success: [],
        }
    }
    componentWillMount(){
        const activationKey = this.props.match.params.key;
        alert(activationKey)
    }
    render() {
        const { isAuth, errors} = this.props.auth;

        if (isAuth){
            return <Redirect to={{pathname: '/dashboard'}} />
        }
        
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

               {/* <Modal show={this.state.show} handleClose={this.hideModal} children={<LoginForm submitCb={this.logInUser} errors={errors} success={this.state.success} />} modalType={"form"}/> : "" }  */}
               
            </div>
            
        )
    }
}

function mapStateToProps(state){
    return {
        auth: state.auth,
    }
}
export default connect(mapStateToProps)(Activate);