import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class MessageService {

    getRoomMessages(roomId) {
        return axiosInstance.get(`messages/${roomId}`)
    }

    sendMessage = (messageData) => {
        console.log(messageData)
        return axiosInstance.post(`messages`, { ...messageData })
    }
}

export default new MessageService();