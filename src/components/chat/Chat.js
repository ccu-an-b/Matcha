import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { Link } from 'react-router-dom';
import { imgPath, toCapitalize } from 'helpers';
import userService from 'services/user-service';
import messagesService from 'services/message-service';
import Chatbox from "./Chatbox";

const socket = io('localhost:3001');

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRoom: 0,
            messageTo: 0,
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
                                {profile.online ? <h5 className="match-online">Online</h5> : <h5 className="match-offline">Offline</h5>}
                            </div>
                        </div>
                    </div>
                </Link>
            )
        });
    }


    render() {

        const { messageTo, currentRoom, profiles, isLoading } = this.state;

        return (
            <div className="row chat">
                <div className="col-4">
                    <h3>Chat with your matchs !</h3>
                    <div className="display-matchs">
                        {!isLoading && profiles.length > 0 &&
                            this.renderProfiles(profiles)
                        }
                        {!isLoading && !profiles.length &&
                            <h2>You don't have any matchs </h2>
                        }
                    </div>
                </div>
                {(!messageTo || !currentRoom) ? (
                <div className="col-8 chat-container">
                    <h1>SELECT SOMEONE TO CHAT WITH</h1>
                </div>) : (
                    <div className="col-8 chat-container">
                        <Chatbox roomId={currentRoom} />
                        <div className="chat-form-group">
                            <label>Enter message</label>
                            <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                            <br />
                            <button onClick={this.sendMessage} className="btn btn-primary">Send</button>
                        </div>
                    </div>)}
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
