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
        this.endMessageRef = React.createRef()
    }

    componentDidMount() {
        socket.on('RECEIVE_CHAT_MESSAGE', (data) => {
            this.setState({ socketMessages: [...this.state.socketMessages, data] });
        });
       this.updateConversation(this.props.roomId)
    }

    printMessage = (messageList) => {
        const userId = this.props.auth.userId;
        return (messageList.map((message, index) => {  
            if (message.roomId === this.props.roomId || message.room_id === this.props.roomId ) {
                const himOrMe = (message.user_from_id === userId) ? "me" : "him";
                return (
                    <li key={index} className={himOrMe}>{message.content}</li>
                )
            }
            else    
                return ("")
        }))
    }

    updateConversation(roomId){
        messagesService.getRoomMessages(roomId).then(result => {
            this.setState({ isLoading: false, roomHistory: result.data});
            this.endMessageRef.current.scrollIntoView()
        }).catch(error => console.log(error));
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.roomId !== this.props.roomId)
        {
            this.setState({isLoading: true, socketMessages: []})
            this.updateConversation(this.props.roomId)
        }
        if(prevState.socketMessages.length !== this.state.socketMessages.length && !this.state.isLoading)
            this.endMessageRef.current.scrollIntoView({behavior: 'smooth'})
    }

    render() {
        const { isLoading, roomHistory, socketMessages } = this.state;

        return (
            <div className="chat-box" id="chat-box">
                <ul>
                    { isLoading && "LOADING" }
                    { !isLoading && this.printMessage(roomHistory) }
                    { socketMessages.length ? this.printMessage(socketMessages) : "" }
                    { !isLoading && <span ref={this.endMessageRef} className="him"></span>}
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

