import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { formatter, formatterChat,imgPath, toCapitalize,imagesLoaded } from 'helpers';
import messagesService from 'services/message-service';
import profileService from 'services/profile-service';
import Chatbox from "./Chatbox";

const socket = io(window.location.hostname + ':3001');

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
            showLeft:false,
            loadImg: true,
        };
        this.convRef = React.createRef()
        this.profilRef = React.createRef()
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

        socket.on('RECEIVE_CHAT_MESSAGE', (data) => {
            const { unreadMessages, currentRoom, socketMessages } = this.state;
            const { userId } = this.props.auth;

            this.updateComponent();
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
            const { currentRoom } = this.state;
            if (data.typingUserId !== userId) {
                if (data.isTyping && data.room_id === currentRoom) {
                    this.setState({ heIsTyping: true })
                } else {
                    this.setState({ heIsTyping: false })
                }
            }
        })
        this.updateComponent();
    }

    updateComponent = () =>{
        messagesService.countUnreadRoomMessages()
            .then((result) => {
                this.setState({ unreadMessages: result.data, });
            })
            .catch((err) => console.log(err));

        messagesService.getConversations()
            .then((profiles) => {
                this.setState({ profiles: profiles.data, isLoading: false });
                profiles.data.forEach((profile) => {
                    socket.emit('CONNECT_TO_ROOM', profile.match_id);
                })
            })
            .catch((err) => { console.log(err) })
    }
    componentWillUnmount(){
        socket.off('RECEIVE_CHAT_MESSAGE')
        socket.off('RECEIVE_MESSAGE_TYPING_NOTIFICATION')
        window.removeEventListener("resize", this.updateWindowDimensions);
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

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };
    
    sendMessage = async (ev) => {
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
            const data = await messagesService.sendMessage(fullMessage);
            socket.emit('SEND_CHAT_MESSAGE', data.data[0]);
            socket.emit('SEND_NOTIFICATION', data.data);
        }
        this.setState({ message: '' });
        const typingNotification = {
            room_id: this.state.currentRoom,
            typingUserId: this.props.auth.userId,
            isTyping: false,
        }
        this.setState({ iAmTyping: false });
        socket.emit('SEND_MESSAGE_TYPING_NOTIFICATION', typingNotification);
        this.updateComponent()
    }

    selectRoom = (profile) => {
        if (window.innerWidth < 1000)
            this.setState({showLeft: true})
        
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

    backToProfiles = () =>{
        this.setState({showLeft: false})
    }

    handleImageChange = () => {
        this.setState({
          loadImg: !imagesLoaded(this.imgElement)
        });
    };

    renderProfiles = (profiles) => {
        const { unreadMessages } = this.state;
        return profiles.map((profile, index) => {
            const unreadMessagesForUser = unreadMessages.find((message) => message.room_id === profile.match_id)
            return (
                <Link to={"#"} onClick={() => this.selectRoom(profile)} key={index}>
                    <div className="one-match" id={profile.username}>
                        <div className= {profile.online ? "one-match-content online" : "one-match-content"}>
                            <div className={this.state.loadImg ? "img_loading img_none": "img_loading" }>
                                <img    src={imgPath(profile.profile_img)}
                                        alt="profile_img" 
                                        onLoad={this.handleImageChange}
                                        onError={this.handleImageChange}/>
                            </div>
                            <div className="match-info">
                                <div className="username">
                                    <h4>{toCapitalize(profile.username)}</h4>
                                    <h5>
                                       <TimeAgo date={parseInt(profile.date, 10)} formatter={formatterChat} />
                                    </h5>
                                </div>
                                <div className='preview'>
                                    <h5>
                                        {profile.last_msg}
                                    </h5>
                                    {unreadMessagesForUser && unreadMessagesForUser.count > 0 ?<div className="unread">{unreadMessagesForUser.count }</div> : "" }
                                </div>
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
            message,
            showLeft } = this.state;
        return (
            <div className="chat-container" id="chat-container">
                <div className={showLeft ? "row chat active" : "row chat"}>
                    <div className="col-4 matchs" ref={this.profileRef}>
                        <div className="header">
                            <h1>Chat with your matchs !</h1>
                        </div>
                        <div className="chat-left">
                            <div className="display-matchs" ref={element => {this.imgElement = element;}}>
                                {!isLoading && profiles.length > 0 &&
                                    this.renderProfiles(profiles)
                                }
                                {!isLoading && !profiles.length &&
                                    <h2>You don't have any matchs </h2>
                                }
                            </div>
                        </div>
                    </div>
                    {(!messageTo || !currentRoom) ? 
                        <div className="col-8 chat-container">
                            <h1>SELECT SOMEONE TO CHAT WITH</h1>
                        </div> : 
                            <div className="col-8 chat-container" ref={this.convRef}>
                                <Chatbox
                                    roomId={currentRoom}
                                    socketMessages={socketMessages}
                                    isTyping={heIsTyping}
                                />
                                <div className="message-to">
                                    <div className="message-to-container">
                                    <div className="back">
                                        <i className="fas fa-chevron-left" onClick={() => this.backToProfiles()}></i>
                                    </div>
                                    {messageToProfile.length ? 
                                        <Link to={`./profile/${messageToProfile[0].username}`}>
                                            <img src={imgPath(messageToProfile[0].profile_img)} alt="messageTo" />
                                            <div className="message-to-info">
                                                <h1>{messageToProfile[0].username}</h1>
                                                <h5 className={messageToProfile[0].online ? 'online' : ""}>
                                                    {messageToProfile[0].online ? 'Online' : <TimeAgo date={parseInt(messageToProfile[0].connexion, 10)} formatter={formatter} />}
                                                </h5>
                                            </div>
                                        </Link>
                                    : ""}
                                    </div>
                                </div>
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
                            </div>}
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
