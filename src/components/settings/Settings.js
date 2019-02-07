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
        };
        this.switchTab = this.switchTab.bind(this)
      }
      
    switchTab(index) {
    this.setState({openTab: index})
    }

    updatePassword = userData =>{
        return userService.updatePassword(userData)
            .then(() => {
                this.setState({openTab: 0})
                this.props.addNotification(this.state.profile, 'success', 'Your password has been updated !')
            })
            .catch((err) => console.log(err))
    }
    
    render() {
    const {openTab} = this.state;
    
    return( 
        <div className="settings-container">
            <div className="left-column">
                <ul>
                <li onClick={this.switchTab.bind(this, 0)}>
                    <i className="fas fa-user"></i>General
                </li>
                <li onClick={this.switchTab.bind(this, 1)}>
                    <i className="fas fa-shield-alt"></i>Password
                    </li>
                <li onClick={this.switchTab.bind(this, 2)}>
                    <i className="fas fa-ban"></i>Blocking
                </li>
                <li onClick={this.switchTab.bind(this, 3)}>
                    <i className="fas fa-minus-circle"></i>Delete profile
                </li>
                </ul>  
            </div>
            <div className="settings-tab">
            {openTab === 0 &&
                <GeneralForm />
            }
            {openTab === 1 &&
                <PasswordForm submitCb={this.updatePassword}/>
            }
            {openTab === 2 &&
                <BlockingForm />
            }
            {openTab === 3 &&
                <DeleteForm />
            }
            </div>
        </div>
    )
    }
}