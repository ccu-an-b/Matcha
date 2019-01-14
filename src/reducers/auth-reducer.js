import {    LOGIN_SUCCESS,
            LOGIN_FAILURE,
            LOGOUT } from 'actions/types';

const INITIAL_STATE = {
    isAuth: false,
    username: '',
    userId: '',
    userProfileStatus:'',
    errors: []
}

export const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {isAuth: true, username: action.username, userId: action.userId, userProfileStatus: action.userProfileStatus, errors: []});
        case LOGIN_FAILURE:
        {
            return Object.assign({}, state, {errors: action.errors});
        }
            // return Object.assign({}, state, {errors: action.errors});
        case LOGOUT:
            return Object.assign({}, state, {isAuth: false, username: ''});
        default:
            return state;
    }
}


