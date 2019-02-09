import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class MessageService {

    getRoomMessages(roomId){
        return axiosInstance.get(`messages/${roomId}`)
    }
}

export default new MessageService();