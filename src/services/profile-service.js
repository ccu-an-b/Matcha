import axios from 'axios';
import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class ProfileService {

    getSuggestedProfiles() {
        return axiosInstance.post(`profiles`).then(
            res => res,
            err => Promise.reject(err.response)
        )
    }
    getOneProfile(username) {
        return axiosInstance.get(`user/profile/${username.toLowerCase()}`).then(
            res => res,
            err => Promise.reject(err.response)
        )    
    }
    getUserInfo(username) {
        return axiosInstance.get(`profiles/user-info/${username.toLowerCase()}`).then(
            res => res,
            err => Promise.reject(err.response)
        )
    }
    setProfileView(username) {
        return axiosInstance.get(`profiles/view/${username.toLowerCase()}`).then(
            res => res,
            err => Promise.reject(err.response)
        )
    }
    setProfileLike(username) {
        return axiosInstance.get(`profiles/like/${username.toLowerCase()}`).then(
            res => res,
            err => Promise.reject(err.response)
        )
    }
    setProfileBlock(username) {
        return axiosInstance.get(`profiles/block/${username.toLowerCase()}`).then(
            res => res,
            err => Promise.reject(err.response)
        )
    }
    setProfileReport(username) {
        return axios.get(`/api/v1/profiles/report/${username.toLowerCase()}`).then(
            res => res,
            err => Promise.reject(err.response)
        )
    }
}

export default new ProfileService();