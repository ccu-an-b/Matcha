import axios from 'axios';
import authService from 'services/auth-service';
import axiosService from 'services/axios-service';

import {  LOGIN_FAILURE,
          LOGIN_SUCCESS,
          LOGOUT,
          FETCH_USER_BY_KEY_INIT,
          FETCH_USER_BY_KEY_SUCCESS } from './types';

const axiosInstance = axiosService.getInstance();

// REGISTER ACTIONS
export const register = (userData) => {
  return axios.post(`/api/v1/users/register`, {...userData}).then(
    res => res.data,
    err => Promise.reject(err.response.data.errors) 
  );
}

const fetchUserByKeyInit = () => {
  
  return {
    type: FETCH_USER_BY_KEY_INIT,
  }
}

const fetchUserByKeySuccess = (user) => {
  
  return {
    type: FETCH_USER_BY_KEY_SUCCESS,
    user
  }
}
export const fetchUserByKey = (userKey) => {

  return function(dispatch) {
    dispatch(fetchUserByKeyInit());
    
    axios.get(`/api/v1/users/activate/${userKey}`).then((user) => {
      dispatch(fetchUserByKeySuccess(user.data[0]));
    });
  }
}

export const completeProfile = (profileData) => {
  debugger;
  return axiosInstance.post(`/users/profileComplete`, profileData).then(
    res => res.data,
    err => Promise.reject(err.response.data.errors) 
  );
}


// AUTH ACTIONS
const loginSuccess = () => {
  const username = authService.getUsername();
  const userId = authService.getUserId();
  const userProfileStatus = authService.getUserProfileStatus();
  return {
    type: LOGIN_SUCCESS,
    username,
    userId,
    userProfileStatus
  }
}

const loginFailure = (errors) => {
  return {
    type: LOGIN_FAILURE,
    errors
  }
}

export const checkAuthState = () => {
  return dispatch => {
    if (authService.isAuthentificated()) {
      dispatch(loginSuccess());
    }
  }
}

export const login = (userData) => {
  return dispatch => {
    return axios.post('/api/v1/users/auth', {...userData})
      .then(res => res.data)
      .then(token =>{
        authService.saveToken(token);
        dispatch(loginSuccess(token));
      })
      .catch(({response}) => {
        dispatch(loginFailure(response.data.errors))
      })
  }
}

export const logout = () => {
  authService.deleteToken()
  return {
    type: LOGOUT
  }
}

// UPLOAD ACTIONS 
export const uploadProfile = image => {
  const formData = new FormData();
  formData.append('profile', image);

  return axiosInstance.post('upload/profile-upload', formData)
    .then(json => {
      return json.data.imageUrl;
    })
    .catch(({response}) => Promise.reject(response.data.errors[0]))
}

export const uploadImage = image => {
  const formData = new FormData();
  for (var i =0; i < image.length ; i++)
    formData.append('image', image[i]);
    
  return axiosInstance.post('upload/image-upload', formData)
    .then(json => {
      return json.data;
    })
    .catch(({response}) => Promise.reject(response.data.errors[0]))
}
