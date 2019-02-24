import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class MessageService {

    getRoomMessages = (roomId) => {
        return axiosInstance.get(`messages/${roomId}`)
    }

    countUnreadRoomMessages() {
        return axiosInstance.get(`messages`)
    }

    setRoomMessagesRead = (roomId, readerUserId) => {
        return axiosInstance.post(`messages/${roomId}`, readerUserId)
    }

    sendMessage = (messageData) => {
        return axiosInstance.post(`messages`, { ...messageData })
    }
}

export default new MessageService();