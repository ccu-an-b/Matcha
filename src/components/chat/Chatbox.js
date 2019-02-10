import React from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import messagesService from 'services/message-service';

const socket = io('localhost:3001');

class Chatbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            roomHistory: [],
            socketMessages: [],
        };
    }

    componentDidMount() {
        const { roomId } = this.props;
        socket.on('RECEIVE_CHAT_MESSAGE', (data) => {
            this.setState({ socketMessages: [...this.state.socketMessages, data] });
        });
        messagesService.getRoomMessages(roomId).then(result => {
            this.setState({ isLoading: false, roomHistory: result.data });
        }).catch(error => console.log(error));
    }

    printMessage = (messageList) => {
        const userId = this.props.auth.userId;
        return (messageList.map((message, index) => {   
            const himOrMe = (message.user_from_id === userId) ? "me" : "him";
            return (
                <li key={index} className={himOrMe}>{message.content}</li>
            )
        }))
    }



    render() {
        const { isLoading, roomHistory, socketMessages } = this.state;
        return (
            <div className="chat-box" id="chat-box">
                <ul>
                    { isLoading && "LOADING" }
                    { !isLoading && this.printMessage(roomHistory) }
                    { socketMessages && this.printMessage(socketMessages) }
                </ul>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
}

export default connect(mapStateToProps)(Chatbox);

