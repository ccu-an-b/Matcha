import axiosService from './axios-service';
import axios from 'axios';
const axiosInstance = axiosService.getInstance();

class UserService {

    getNotifcationsAll(){
        return axiosInstance.post(`user/notifications/all`)
    }

    getNotificationsType(type){
        return axiosInstance.get(`user/notifications/${type}`)
    }

    getBlockedProfiles(){
        return axiosInstance.get(`user/blocked`)
    }

    getFromKey = (userData) => {
        return axios.post(`/api/v1/user/get_from_key`, {...userData}).then(
            res => res.data,
            err => Promise.reject(err.response.data.errors)
        )
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

    forgottenPassword = (userData) => {
        return axios.post(`/api/v1/user/forgotten_pass`, { ...userData }).then(
            res => res.data,
            err => Promise.reject(err.response.data.errors)
        );
    }

    changePassword = (userData) => {
        return axios.post(`/api/v1/user/change_pass`, {...userData}).then(
            res => res.data,
            err => Promise.reject(err.response.data.errors)
        )
    }
}

export default new UserService();