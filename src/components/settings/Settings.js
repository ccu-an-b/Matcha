import React from "react";
import GeneralForm from './GeneralForm';
import PasswordForm from './PasswordForm';
import DeleteForm from "./DeleteForm";
import {BlockingForm} from "./BlockingForm";
import userService from 'services/user-service';

export default class Settings extends React.Component {
    constructor (props){
        super(props);
        this.state = {
          openTab: 0,
          errors: [],
        };
      }
      
    switchTab = (index) => {
    this.setState({openTab: index, errors:[]})
    }

    handleLogout = () => {
        this.props.logout();
        this.props.history.push('/');
    }

    updatePassword = userData =>{
        this.setState({errors:[]})
        return userService.updatePassword(userData)
            .then((res) => {
                if (res.error)
                    throw(res.error)
                this.setState({openTab: 0})
                this.props.addNotification(this.state.profile, 'success', res.success[0].detail)
            })
            .catch((err) => this.setState({errors: [err[0]]}))
    }

    updateGeneral = userData =>{
        this.setState({errors:[]})
        return userService.updateGeneral(userData)
            .then((res) => {
                if (res.error)
                    throw(res.error)
                this.props.addNotification(this.state.profile, 'success', res.success[0].detail)
                if (res.redirect){
                    this.props.addNotification(this.state.profile, 'success', 'You can now log in with your new username')
                    this.handleLogout()
                }
            })
            .catch((err) => this.setState({errors: [err[0]]}))
    }
    
    updateDelete = userData =>{
        this.setState({errors:[]})
        return userService.updateDelete(userData)
            .then((res) => {
                if (res.error)
                    throw(res.error)
                this.props.addNotification(this.state.profile, 'success', 'You successfully deleted your Matcha account.')
                this.handleLogout()
            })
            .catch((err) => this.setState({errors: [err[0]]}))
    }

    updateBlocked = (e, userData) => {
        e.preventDefault();
        this.setState({errors:[]})
        return userService.updateBlocked(userData)
        .then((res) => {
            this.setState({openTab: 0})
            this.props.addNotification(this.state.profile, 'success', res.success[0].detail)
        })
        .catch((err) => console.log(err[0].detail))
    }

    render() {
    const {openTab, errors} = this.state;
    
    return( 
        <div className="settings-container">
            <div className="left-column">
                <ul>
                <li onClick={() => this.switchTab(0)}>
                    <i className="fas fa-user"></i>General
                </li>
                <li onClick={() => this.switchTab(1)}>
                    <i className="fas fa-shield-alt"></i>Password
                    </li>
                <li onClick={() => this.switchTab(2)}>
                    <i className="fas fa-ban"></i>Blocking
                </li>
                <li onClick={() => this.switchTab(3)}>
                    <i className="fas fa-minus-circle"></i>Delete profile
                </li>
                </ul>  
            </div>
            <div className="settings-tab">
            {openTab === 0 &&
                <GeneralForm submitCb={this.updateGeneral} errors={errors} />
            }
            {openTab === 1 &&
                <PasswordForm submitCb={this.updatePassword} errors={errors} />
            }
            {openTab === 2 &&
                <BlockingForm submitCb={this.updateBlocked} />
            }
            {openTab === 3 &&
                <DeleteForm submitCb={this.updateDelete} errors={errors} />
            }
            </div>
        </div>
    )
    }
}