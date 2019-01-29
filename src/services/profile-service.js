import axios from 'axios';
import axiosService from './axios-service';

const axiosInstance = axiosService.getInstance();

class ProfileService {

    getSuggestedProfiles(){
        return axiosInstance.post(`profiles`)
    }

    getOneProfile(username){
        return axios.get(`/api/v1/user/profile/${username.toLowerCase()}`)
    }
    setProfileView(username){
        return axiosInstance.get(`profiles/view/${username.toLowerCase()}`)
    }
}

export default new ProfileService();