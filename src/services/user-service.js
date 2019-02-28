import axiosService from './axios-service';
import axios from 'axios';
const axiosInstance = axiosService.getInstance();

class UserService {

    getNotifcationsAll(){
        return axiosInstance.post(`user/notifications/all`).then(
            res => res,
            err => Promise.reject()
        )
    }

    getNotificationsType(type){
        return axiosInstance.get(`user/notifications/${type}`).then(
            res => res,
            err => Promise.reject()
        )
    }

    getBlockedProfiles(){
        return axiosInstance.get(`user/blocked`).then(
            res => res,
            err => Promise.reject()
        )
    }

    getFromKey = (userData) => {
        return axios.post(`/api/v1/user/get_from_key`, {...userData}).then(
            res => res.data,
            err => Promise.reject()
        )
    }

    updatePassword = (userData) => {
        return axiosInstance.post(`user/update/password`, { ...userData }).then(
          res => res.data,
          err => Promise.reject()
        );
    }
    updateGeneral = (userData) => {
        return axiosInstance.post(`user/update/general`, { ...userData }).then(
          res => res.data,
          err => Promise.reject()
        );
    }
    updateDelete = (userData) => {
        return axiosInstance.post(`user/update/delete`, { ...userData }).then(
          res => res.data,
          err => Promise.reject()
        );
    }
    updateBlocked = (userData) => {
        return axiosInstance.post(`user/update/blocked`, { ...userData }).then(
            res => res.data,
            err => Promise.reject()
        );
    }

    forgottenPassword = (userData) => {
        return axios.post(`/api/v1/user/forgotten_pass`, { ...userData }).then(
            res => res.data,
            err => Promise.reject()
        );
    }

    changePassword = (userData) => {
        return axios.post(`/api/v1/user/change_pass`, {...userData}).then(
            res => res.data,
            err => Promise.reject()
        )
    }

    readNotification = () => {
        return axiosInstance.post(`user/read/notification`).then(
            res => res,
            err => Promise.reject()
        )
    }
}

export default new UserService();