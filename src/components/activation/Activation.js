import React from 'react';
import LoginForm from '../landing/LoginForm';
import Modal from '../shared/modal/Modal';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from 'actions';
import userService from 'services/user-service';

export class Activation extends React.Component {

    constructor() {
        super();
        this.state = {
            errors:[],
            success: [],   
            keyExist: true
        }
    }
    componentWillMount(){
        const activationKey = this.props.match.params.key;

        if (activationKey){
            return userService.getFromKey({key : activationKey })
                .then((res) => {
                    if (res.error)
                        throw res.error
                    this.props.dispatch(actions.fetchUserByKey(activationKey));
                })
                .catch(() => this.setState({keyExist: false}))
        }
    }
    
    logInUser = userData =>{
        this.props.dispatch(actions.login(userData));
    }

    render() {
        const { isAuth, errors} = this.props.auth;
        const userActivate = this.props.userActivate;

        if (isAuth)
        {
            return <Redirect to={{pathname: '/dashboard'}} />
        }
        else if(userActivate && this.props.match.params.key && this.state.keyExist) 
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
    
                   <Modal show={true} handleClose={this.hideModal} children={<LoginForm submitCb={this.logInUser} errors={errors} success={this.state.success} activate={true}/>} modalType={"form"} close={true}/>
                </div>
                
            )
        }
        else if(!this.props.match.params.key || !this.state.keyExist)
        {
            return <Redirect to={{pathname: '/'}} />
        }  
    }
}


function mapStateToProps(state){
    return {
        auth: state.auth,
        userActivate: state.userActivate.data,
    }
}
export default connect(mapStateToProps)(Activation);