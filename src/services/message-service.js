import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class MessageService {

    getRoomMessages = (roomId) => {
        return axiosInstance.get(`messages/room/${roomId}`)
    }

    countUnreadRoomMessages() {
        return axiosInstance.get(`messages`)
    }

    setRoomMessagesRead = (roomId, readerUserId) => {
        return axiosInstance.post(`messages/room/${roomId}`, readerUserId)
    }

    sendMessage = (messageData) => {
        return axiosInstance.post(`messages`, { ...messageData })
    }

    getConversations = () => {
        return axiosInstance.get(`messages/conversations`)
    }
}

export default new MessageService();