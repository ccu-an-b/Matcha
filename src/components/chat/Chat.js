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
            heIsTyping: false,
            iAmTyping: false,
            messageTo: 0,
            messageToProfile: [],
            message: '',
            unreadMessages: [],
            profiles: [],
            isLoading: true,
            socketMessages: [],
            isRoomHistoryLoaded: false,
        };
        this.convRef = React.createRef()
        this.profilRef = React.createRef()

        socket.on('RECEIVE_CHAT_MESSAGE', (data) => {
            const { unreadMessages, currentRoom, socketMessages } = this.state;
            const { userId } = this.props.auth;
            if (data.room_id === currentRoom) {
                this.setState({ socketMessages: [...socketMessages, data] });
                if (userId !== data.user_from_id) {
                    messagesService.setRoomMessagesRead(currentRoom, { readerUserId: data.user_for_id });
                }
            }
            else {
                this.setState({ unreadMessages: this.getUnreadMessages(unreadMessages, data) });
            }
        });

        socket.on('RECEIVE_MESSAGE_TYPING_NOTIFICATION', (data) => {
            const { userId } = this.props.auth;
            if (data.typingUserId !== userId) {
                if (data.isTyping) {
                    this.setState({ heIsTyping: true })
                } else {
                    this.setState({ heIsTyping: false })
                }
            }
        })
    }

    getUnreadMessages = (unreadMessages, data) => {
        let newUnreadMessages = unreadMessages;
        if (unreadMessages.find((message) => message.room_id === data.room_id)) {
            newUnreadMessages = unreadMessages.map((room) => {
                if (room.room_id === data.room_id) {
                    return { room_id: room.room_id, count: Number(room.count) + 1 }
                } return room;
            })
        } else {
            newUnreadMessages.push({ room_id: data.room_id, count: 1 })
        }
        return newUnreadMessages;
    }

    componentWillUnmount(){
        socket.off('RECEIVE_CHAT_MESSAGE')
    }
    
    sendMessage = (ev) => {
        const userId = this.props.user[0].id;
        const { currentRoom, messageTo, message } = this.state;
        ev.preventDefault();
        if (message && currentRoom && userId && messageTo) {
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
        const typingNotification = {
            room_id: this.state.currentRoom,
            typingUserId: this.props.auth.userId,
            isTyping: false,
        }
        this.setState({ iAmTyping: false });
        socket.emit('SEND_MESSAGE_TYPING_NOTIFICATION', typingNotification);
    }

    selectRoom = (profile) => {
        const resetUnreadMessages = this.state.unreadMessages.map((room) => {
            if (room.room_id === profile.match_id) {
                return { room_id: room.room_id, count: 0 }
            } return room;
        })
        this.setState({
            messageTo: profile.user_from_id,
            currentRoom: profile.match_id,
            socketMessages: [],
            unreadMessages: resetUnreadMessages,
        });
        profileService.getOneProfile(profile.username).then((profile) => this.setState({ messageToProfile: profile.data }))
    }

    componentDidMount() {
        messagesService.countUnreadRoomMessages()
            .then((result) => {
                this.setState({ unreadMessages: result.data, });
            })
            .catch((err) => console.log(err));
        userService.getNotificationsType(3)
            .then((profiles) => {
                this.setState({ profiles: profiles.data, isLoading: false });
                profiles.data.forEach((profile) => {
                    socket.emit('CONNECT_TO_ROOM', profile.match_id);
                })
            })
            .catch((err) => { console.log(err) })
    }

    componentWillUnmount() {
        socket.off('RECEIVE_CHAT_MESSAGE')
    }

    iAmTyping = (event) => {
        this.setState({ message: event.target.value });
        if (!this.state.iAmTyping) {
            const typingNotification = {
                room_id: this.state.currentRoom,
                typingUserId: this.props.auth.userId,
                isTyping: true,
            }
            this.setState({ iAmTyping: true });
            socket.emit('SEND_MESSAGE_TYPING_NOTIFICATION', typingNotification);
        }
    }

    renderProfiles = (profiles) => {
        const { unreadMessages } = this.state;
        return profiles.map((profile, index) => {
            const unreadMessagesForUser = unreadMessages.find((message) => message.room_id === profile.match_id)
            return (
                <Link to={"#"} onClick={() => this.selectRoom(profile)} key={index}>
                    <div className="one-match" id={profile.username}>
                        <div className="one-match-content">
                            <img src={imgPath(profile.profile_img)} alt="profile_img" />
                            <div className="match-info">
                                <h4>{toCapitalize(profile.username)}</h4>
                                <h5 className={profile.online ? 'online' : ""}>
                                    {profile.online ? 'Online' : <TimeAgo date={parseInt(profile.connexion, 10)} formatter={formatter} />}
                                </h5>
                                {unreadMessagesForUser ? unreadMessagesForUser.count : 0} unread messages
                                <h5>
                                </h5>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        });
    }


    render() {
        const {
            messageTo,
            messageToProfile,
            socketMessages,
            heIsTyping,
            currentRoom,
            profiles,
            isLoading,
            message } = this.state;
        return (
            <div className="chat-container" id="chat-container">
                <div className="row chat">
                    <div className="col-4 matchs" ref={this.profileRef}>
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
                            <div className="col-8 chat-container" ref={this.convRef}>
                                <div className="message-to">
                                    {messageToProfile.length &&
                                        <Link to={`./profile/${messageToProfile[0].username}`}>
                                            <img src={imgPath(messageToProfile[0].profile_img)} alt="messageTo" />
                                            <div className="message-to-info">
                                                <h1>{messageToProfile[0].username}</h1>
                                                <h5 className={messageToProfile[0].online ? 'online' : ""}>
                                                    {messageToProfile[0].online ? 'Online' : <TimeAgo date={parseInt(messageToProfile[0].connexion, 10)} formatter={formatter} />}
                                                </h5>
                                            </div>
                                        </Link>
                                    }
                                </div>
                                <Chatbox
                                    roomId={currentRoom}
                                    socketMessages={socketMessages}
                                    isTyping={heIsTyping}
                                />
                                <div className="chat-form-group">
                                    <div className="chat-send">
                                        <input
                                            type="text"
                                            placeholder="Message"
                                            className="form-control"
                                            value={message}
                                            onChange={this.iAmTyping}
                                        />
                                        <button
                                            onClick={this.sendMessage}
                                            className={message.length ? "btn active" : "btn"}
                                        >Send</button>
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
