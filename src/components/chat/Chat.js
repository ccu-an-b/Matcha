import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import userService from 'services/user-service';
import { ConnectedUsers } from "./ConnectedUsers";

const socket = io('localhost:3001');



export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            username: '',
            message: '',
            messages: [],
            connectedUsers: []
        };

    }

    sendMessage = ev => {
        ev.preventDefault();
        if (this.state.message !== '') {
            socket.emit('SEND_MESSAGE', {
                author: this.state.username,
                message: this.state.message
            });
        }
        this.setState({ message: '' });
    }



    componentDidMount() {
        socket.on('RECEIVE_MESSAGE', (data) => {
            console.log(data);
            this.setState({ messages: [...this.state.messages, data] });
        });
        userService.getNotificationsType(3)
            .then((profiles) => {
                this.setState({ matchs: profiles.data, isLoading: false })
            }).catch((err) => { console.log(err) })
    }


    render() {

        return (
            <div className="row chat">
                <div className="col-4">
                    <h3>Chat with your matchs !</h3>
                    <ConnectedUsers />
                </div>
                <div className="col-8">
                    <div className="chat-box" id="chat-box">
                        {this.state.messages.map(function (message, i) {
                            return (
                                    <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray"  key={i}>
                                        {message.message}</p>
                            )
                        })}
                    </div>
                    <div className="chat-form-group">
                        <label>Enter message</label>
                        <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                        <br />
                        <button onClick={this.sendMessage} className="btn btn-primary">Send</button>
                    </div>
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
