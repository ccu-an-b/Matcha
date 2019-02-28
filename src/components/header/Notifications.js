import React from 'react';
import {Link} from 'react-router-dom';
import userService from 'services/user-service';
import TimeAgo from 'react-timeago';
import { formatter, imgPath, toCapitalize, imagesLoaded } from 'helpers';
import io from "socket.io-client";

const socket = io(window.location.hostname + ':3001');

const type = {
    "1": "visited your profile",
    "2": "liked your profile",
    "3": "and you matched",
    "-2": "unliked you",
    "-3": "unmatched you"
}
export default class Notifications extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            unread: 0,
            notifications: [],
            show: false,
            isLoading: true,
            loadImg: true
        }
    }

    componentWillMount(){
        this.updateNotifications()
    }

    componentDidMount(){
        socket.on('RECEIVE_NOTIFICATION', (data) => {
            if (data && data[0].user_id === this.props.userId && !this.state.isLoading ){
                this.props.addNotification(data, 'notification', '')
                this.updateNotifications();
            }
            else if (data && data[0].user_for_id === this.props.userId && !this.state.isLoading && window.location.pathname !== '/chat')
            {
                this.props.addNotification(data, 'message', '')
            }
        });
    }
    componentWillUnmount(){
        socket.off('RECEIVE_NOTIFICATION')
    }
    updateNotifications(){
        userService.getNotifcationsAll()
            .then((notifications) => {
                this.setState({notifications: notifications.data})
                let unread = 0;
                notifications.data.map((notification) => {
                    if(notification.read === 0)
                        unread+=1
                    return true
                })
                return unread;
            })
            .then((unread) => this.setState({unread, isLoading: false}))
    }

    handleImageChange = () => {
        this.setState({
          loadImg: !imagesLoaded(this.imgElement)
        });
    };

    renderNotifications(notifications){
        return notifications.map((notification, index) => {
            return (
                <Link className="dropdown-item" to={`/profile/${notification.username}`} key={index}>
                    <div className={this.state.loadImg ? "img_loading img_none": "img_loading" }>
                        <img    src={imgPath(notification.profile_img)} 
                                alt="notification-img"
                                onLoad={this.handleImageChange}
                                onError={this.handleImageChange}/>
                    </div>
                    <div className="notif-content">
                        <h3>{toCapitalize(notification.username)} {type[notification.type]}</h3>
                        <h4><TimeAgo date={parseInt(notification.date, 10)} formatter={formatter} /></h4>
                    </div>
                </Link>
            )
        })
    }

    readNotification = () =>{
        this.setState({unread: 0, show: !this.state.show})
        userService.readNotification()
    }

    render(){
        const {showSearch} = this.props;
        const {notifications, unread, show} = this.state
        if (notifications){
            return (
                <div className="dropdown">
                    <a className="nav-link notification" onClick={() => this.readNotification()}>
                        Notifications
                        {unread !== 0 ? <div className="notification-bubble">{unread}</div> : ""}
                    </a>
    
                    {show && !showSearch &&
                        <div className="dropdown-menu my-dropdown show" aria-labelledby="dropdownMenuButton" ref={element => {this.imgElement = element;}}>
                            {notifications.length ? this.renderNotifications(notifications) : <h2>You have no notifications</h2>}
                        </div>
                    }
                </div>
            )
        }
        else {
            return (
                <a className="nav-link notification">Notifications</a>
            )
        }
    }
}
