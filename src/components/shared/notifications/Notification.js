import React from 'react';
import { imgPath, toCapitalize } from 'helpers';
export default class Notification extends React.Component  {
   
   render(){

        const {type, profile, message} = this.props
        if (type === 'notification')
        {
            return(
                <div className="notification-box">
                    <img src={imgPath(profile[0].profile_img)} alt="profile_img"/>
                    <h2>{toCapitalize(profile[0].username)}</h2>
                    <p>{message}</p>
                </div>
            )
        }
        if (type === 'flag')
        {
            return(
                <div className="notification-box flag">
                    <img src={imgPath(profile[0].profile_img)} alt="profile_img"/>
                    <p>{message}{toCapitalize(profile[0].username)}.</p>
                </div>
            )
        }
        if (type === 'success')
        {
            return(
                <div className="notification-box success">
                    <p>{message}</p>
                </div>
            )
        }
   }
  }