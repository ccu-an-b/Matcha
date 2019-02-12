import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { formatter, imgPath, toCapitalize } from 'helpers';
import userService from 'services/user-service';
import messagesService from 'services/message-service';
import profileService from 'services/profile-service';
import Chatbox from "./Chatbox";

const socket = io('localhost:3001');

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRoom: 0,
            messageTo: 0,
            messageToProfile: [],
            message: '',
            messages: [],
            profiles: [],
            isLoading: true,
            isRoomHistoryLoaded: false,
        };
    }

    sendMessage = (ev) => {
        const userId = this.props.user[0].id;
        const { currentRoom, messageTo, message } = this.state;
        ev.preventDefault();
        if (message !== '') {
            const fullMessage = {
                room_id: currentRoom,
                user_from_id: userId,
                user_for_id: messageTo,
                content: message
            }
            messagesService.sendMessage(fullMessage);
            socket.emit('SEND_CHAT_MESSAGE', fullMessage);
        }
        this.setState({ message: '' });
    }

    switchRoom = (profile) => {
        socket.emit('SWITCH_ROOM', profile.username, profile.match_id);
        this.setState({
            messageTo: profile.user_from_id,
            currentRoom: profile.match_id
        });
        profileService.getOneProfile(profile.username).then((profile) => this.setState({messageToProfile: profile.data}))
    }

    componentDidMount() {

        userService.getNotificationsType(3).then((profiles) => {
            this.setState({ profiles: profiles.data, isLoading: false });
        })
            .catch((err) => { console.log(err) })
    }

    renderProfiles = (profiles) => {
        return profiles.map((profile, index) => {
            return (
                <Link to={"#"} onClick={() => this.switchRoom(profile)} key={index}>
                    <div className="one-match" id={profile.username}>
                        <div className="one-match-content">
                            <img src={imgPath(profile.profile_img)} alt="profile_img" />
                            <div className="match-info">
                                <h4>{toCapitalize(profile.username)}</h4>
                                <h5 className={profile.online ? 'online': ""}>
                                {profile.online ? 'Online' : <TimeAgo date={parseInt(profile.connexion, 10)} formatter={formatter} />}
                                </h5>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        });
    }


    render() {

        const { messageTo, messageToProfile, currentRoom, profiles, isLoading, message} = this.state;

        return (
            <div id="chat-container">
                <div className="row chat">
                    <div className="col-4 matchs">
                    <div className="header">
                        <h1>Chat with your matchs !</h1>
                    </div>
                    <div className="chat-left">
                        <div className="display-matchs">
                            {!isLoading && profiles.length > 0 &&
                                this.renderProfiles(profiles)
                            }
                            {!isLoading && !profiles.length &&
                                <h2>You don't have any matchs </h2>
                            }
                        </div>
                    </div>
                    </div>
                    {(!messageTo || !currentRoom) ? (
                    <div className="col-8 chat-container">
                        <h1>SELECT SOMEONE TO CHAT WITH</h1>
                    </div>) : (
                        <div className="col-8 chat-container">
                            <div className="message-to">
                                {messageToProfile.length &&
                                <Link to={`./profile/${messageToProfile[0].username}`}>
                                    <img src={imgPath(messageToProfile[0].profile_img)} alt="messageTo"/>
                                    <div className="message-to-info">
                                        <h1>{messageToProfile[0].username}</h1>
                                        <h5 className={messageToProfile[0].online ? 'online': ""}>
                                            {messageToProfile[0].online ? 'Online' : <TimeAgo date={parseInt(messageToProfile[0].connexion, 10)} formatter={formatter} />}
                                        </h5>
                                    </div>
                                </Link>
                                }
                            </div>
                            <Chatbox roomId={currentRoom} />
                            <div className="chat-form-group">
                                <div className="chat-send">
                                    <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                                    <button onClick={this.sendMessage} className={message.length ? "btn  active": "btn"}>Send</button>
                                </div>
                            </div>
                        </div>)}
                </div>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        browse: state.browse,
        user: state.user.data,
        auth: state.auth,
        tags: state.tags,
        form: state.form
    };
}

export default connect(mapStateToProps)(Chat);
