import axios from 'axios';
import axiosService from 'services/axios-service';
import authService from 'services/auth-service';

import {  LOGIN_FAILURE,
          LOGIN_SUCCESS,
          LOGOUT } from './types';

const axiosInstance = axiosService.getInstance();


// AUTH ACTIONS
export const register = (userData) => {
  return axios.post(`/api/v1/users/register`, {...userData}).then(
    res => res.data,
    err => Promise.reject(err.response.data.errors) 
  );
}

const loginSuccess = () => {
  const username = authService.getUsername();

  return {
    type: LOGIN_SUCCESS,
    username
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
  authService.deleteToken();
  return {
    type: LOGOUT
  }
}