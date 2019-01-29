import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class UserService {

    getNotificationsType(type){
        return axiosInstance.get(`user/notifications/${type}`)
    }
}

export default new UserService();