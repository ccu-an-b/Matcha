// import axios from 'axios';
import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class ProfileService {

    getSuggestedProfiles() {
        return axiosInstance.post(`profiles`)
    }
    getOneProfile(username) {
        return axiosInstance.get(`user/profile/${username.toLowerCase()}`)
    }
    getUserInfo(username) {
        return axiosInstance.get(`profiles/user-info/${username.toLowerCase()}`)
    }
    setProfileView(username) {
        return axiosInstance.get(`profiles/view/${username.toLowerCase()}`)
    }
    setProfileLike(username) {
        return axiosInstance.get(`profiles/like/${username.toLowerCase()}`)
    }
    setProfileBlock(username) {
        return axiosInstance.get(`profiles/block/${username.toLowerCase()}`)
    }
}

export default new ProfileService();