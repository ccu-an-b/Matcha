import axios from 'axios';
import authService from 'services/auth-service';
import axiosService from 'services/axios-service';

import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  FETCH_USER_BY_KEY_INIT,
  FETCH_USER_BY_KEY_SUCCESS,
  FETCH_USER_PUBLIC_INFO_INIT,
  FETCH_USER_PUBLIC_INFO_SUCCESS,
  FETCH_USER_PROFILE_INIT,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_PROFILE_FAIL,
  FETCH_TAGS_INIT,
  FETCH_TAGS_SUCCESS} from './types';

const axiosInstance = axiosService.getInstance();
const store = require('../reducers').init();

// REGISTER ACTIONS
export const register = (userData) => {
  return axios.post(`/api/v1/user/register`, { ...userData }).then(
    res => res.data,
    err => Promise.reject(err.response.data.errors)
  );
}

const fetchUserByKeyInit = () => {

  return {
    type: FETCH_USER_BY_KEY_INIT,
  }
}

const fetchUserByKeySuccess = (userActivate) => {
  
  return {
    type: FETCH_USER_BY_KEY_SUCCESS,
    userActivate
  }
}
export const fetchUserByKey = (userKey) => {

  return function (dispatch) {
    dispatch(fetchUserByKeyInit());

    axios.get(`/api/v1/user/activate/${userKey}`).then((user) => {
      dispatch(fetchUserByKeySuccess(user.data[0]));
    });
  }
}

export const completeProfile = (profileData) => {
  return axiosInstance.post(`/user/profileComplete`, profileData).then(
    res => {store.dispatch(fetchUserProfile(res.data['success'][0].username))},
    err => Promise.reject(err.response.data.errors)
  );
}


// AUTH ACTIONS
const loginSuccess = () => {
  const username = authService.getUsername();
  const userId = authService.getUserId();
  store.dispatch(fetchUserProfile(username));
  store.dispatch(fetchAllPublicData());
  store.dispatch(fetchTags())
  return {
    type: LOGIN_SUCCESS,
    username,
    userId,
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
    return axios.post('/api/v1/user/auth', { ...userData })
      .then(res => res.data)
      .then(token => {
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

export const logoutOffline = (user) => {
  return axios.get(`/api/v1/user/logout/${user}`)
}

// UPLOAD ACTIONS 
export const uploadProfile = image => {
  const formData = new FormData();
  formData.append('profile', image);

  return axiosInstance.post('upload/profile-upload', formData)
    .then(json => {
      return json.data.imageUrl;
    })
    .catch(({ response }) => Promise.reject(response.data.errors[0]))
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

export const deleteImage = image =>{
  return axiosInstance.get(`user/deleteImage/${image}`)
}
// FETCH ALL PUBLIC DATA

const fetchPublicInfoInit = () => {

  return {
    type: FETCH_USER_PUBLIC_INFO_INIT,
  }
}

const fetchPublicInfoSuccess = (publicData) => {
  return {
    type: FETCH_USER_PUBLIC_INFO_SUCCESS,
    publicData
  }
}

export const fetchPublicData = () => {
  return dispatch => {
    if (authService.isAuthentificated()) {
      dispatch(fetchAllPublicData());
    }
  }
}


const fetchAllPublicData = () => {
  return function (dispatch) {
    dispatch(fetchPublicInfoInit());

    axios.post('/api/v1/user/fetch-users').then((res) => {
      dispatch(fetchPublicInfoSuccess(res.data));
    }).catch(({ response }) => Promise.reject(response.data))
  }
}

//FETCH USER PROFILE
const fetchUserProfileInit = () => {
  
  return {
    type: FETCH_USER_PROFILE_INIT,
  }
}

const fetchUserProfileSuccess = (user) => {
  
  return {  
    type: FETCH_USER_PROFILE_SUCCESS,
    user
  }

}

const fetchUserProfileFail = (errors) => {
  return {
    type: FETCH_USER_PROFILE_FAIL,
    errors
  }
}
export const fetchUserProfile = (username) => {
  return function(dispatch) {
    dispatch(fetchUserProfileInit());
    
      axios.get(`/api/v1/user/profile/${username.toLowerCase()}`)
        .then((user) => dispatch(fetchUserProfileSuccess(user.data)))
        .catch(({response}) => dispatch(fetchUserProfileFail(response.data.errors)));
  }
}

//TAGS ACTIONS
const fetchTagsInit = () => {
  
  return {
    type: FETCH_TAGS_INIT,
  }
}

const fetchTagsSuccess = (tags) => {
  
  return {
    type: FETCH_TAGS_SUCCESS,
    tags
  }

}
export const fetchTags = () => {

  return function(dispatch) {
    dispatch(fetchTagsInit());
    
      axios.get(`/api/v1/tools/tags`).then((tags) => {
      dispatch(fetchTagsSuccess(tags.data));
    });
  }
}

//USER ACTIONS ON PROFILE
// export const setProfileView = (user) =>