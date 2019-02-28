import React from "react";
import { connect } from "react-redux";
import messagesService from 'services/message-service';
import io from "socket.io-client";

const socket = io(window.location.hostname + ':3001');

class Chatbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            roomHistory: [],
        };
        this.endMessageRef = React.createRef()
    }

    componentDidMount() {
        messagesService.setRoomMessagesRead(this.props.roomId, { readerUserId: this.props.auth.userId });
        this.updateConversation(this.props.roomId);
        setTimeout(() => socket.emit('SEND_NOTIFICATION', undefined), 100);
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

    updateConversation(roomId) {
        messagesService.getRoomMessages(roomId).then(result => {
            this.setState({ isLoading: false, roomHistory: result.data });
            this.endMessageRef.current.scrollIntoView()
        }).catch(error => console.log(error));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.roomId !== this.props.roomId) {
            this.setState({ isLoading: true })
            this.updateConversation(this.props.roomId);
        }
        if (prevProps.socketMessages.length !== this.props.socketMessages.length && !this.state.isLoading)
            this.endMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    render() {
        const { isLoading, roomHistory } = this.state;
        const { socketMessages, isTyping } = this.props;

        return (
            <div className="chat-box" id="chat-box">
                {isLoading ? <ul>LOADING</ul> : (
                    <ul>
                        {this.printMessage(roomHistory)}
                        {socketMessages.length ? this.printMessage(socketMessages) : ""}
                        {isTyping ? 
                            <li className="him typing" ref={this.endMessageRef}>...</li>
                            : <span ref={this.endMessageRef} className="him" />}
                    </ul>
                )}
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

