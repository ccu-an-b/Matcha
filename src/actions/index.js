import axios from 'axios';
import authService from 'services/auth-service';

import {  LOGIN_FAILURE,
          LOGIN_SUCCESS,
          LOGOUT } from './types';

// AUTH ACTIONS
export const register = (userData) => {
  return axios.post(`/api/v1/users/register`, {...userData}).then(
    res => res.data,
    err => Promise.reject(err.response.data.errors) 
  );
}

const loginSuccess = () => {
  const username = authService.getUsername();
  const userMail = authService.getUsermail();
  return {
    type: LOGIN_SUCCESS,
    username,
    userMail
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