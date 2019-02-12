import React from 'react';
import {Link} from 'react-router-dom';
import userService from 'services/user-service';
import TimeAgo from 'react-timeago';
import { formatter, imgPath, toCapitalize } from 'helpers';

const type = {
    "1": "visited your profile",
    "2": "liked your profile",
    "3": "and you matched",
    "-2": "unliked you",
    "-3": "unmatched you"
}
export default class Notifications extends React.Component{

    constructor(){
        super();
        this.state = {
            notifications: []
        }
    }

    componentWillMount(){
        userService.getNotifcationsAll()
            .then((notifications) => {this.setState({notifications: notifications.data})})
    }

    renderNotifications(notifications){
        return notifications.map((notification, index) => {
            return (
                <Link className="dropdown-item" to={`/profile/${notification.username}`} key={index}>
                    <img src={imgPath(notification.profile_img)} alt="notification-img"/>
                    <div className="notif-content">
                        <h3>{toCapitalize(notification.username)} {type[notification.type]}</h3>
                        <h4><TimeAgo date={parseInt(notification.date, 10)} formatter={formatter} /></h4>
                    </div>
                </Link>
            )
        })
    }
    render(){
        const {notifications} = this.state

        return (
            <div className="dropdown">
                <a className="nav-link" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Notifications</a>
                <div className="dropdown-menu my-dropdown" aria-labelledby="dropdownMenuButton">
                    {notifications.length ? this.renderNotifications(notifications) : "You have no notifications"}
                </div>
            </div>
        )
    }

}
