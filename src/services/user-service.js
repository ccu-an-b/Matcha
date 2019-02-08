import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class UserService {

    getNotificationsType(type){
        return axiosInstance.get(`user/notifications/${type}`)
    }

    getBlockedProfiles(){
        return axiosInstance.get(`user/blocked`)
    }
    updatePassword = (userData) => {
        return axiosInstance.post(`user/update/password`, { ...userData }).then(
          res => res.data,
          err => Promise.reject(err.response.data.errors)
        );
    }
    updateGeneral = (userData) => {
        return axiosInstance.post(`user/update/general`, { ...userData }).then(
          res => res.data,
          err => Promise.reject(err.response.data.errors)
        );
    }
    updateDelete = (userData) => {
        return axiosInstance.post(`user/update/delete`, { ...userData }).then(
          res => res.data,
          err => Promise.reject(err.response.data.errors)
        );
    }
    updateBlocked = (userData) => {
        return axiosInstance.post(`user/update/blocked`, { ...userData }).then(
            res => res.data,
            err => Promise.reject(err.response.data.errors)
        );
    }
}

export default new UserService();