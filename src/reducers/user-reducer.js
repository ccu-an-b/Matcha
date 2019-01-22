import {    FETCH_USER_BY_KEY_INIT,
            FETCH_USER_BY_KEY_SUCCESS,
            FETCH_USER_PROFILE_INIT,
            FETCH_USER_PROFILE_SUCCESS,
            FETCH_USER_PROFILE_FAIL} from 'actions/types';

const INITIAL_STATE = {
    user: {
        data:{},
        error: [],
    },
    userActivate: {
        data:{},
    }
}

export const selectedUserReducer = (state = INITIAL_STATE.user, action) => {
    switch(action.type) {
        case FETCH_USER_PROFILE_INIT:
            return Object.assign({...state, data: {}});
        case FETCH_USER_PROFILE_SUCCESS:
            return Object.assign({...state, data: action.user})
        case FETCH_USER_PROFILE_FAIL:
            return Object.assign({...state, error: action.user})
        default:
            return state;
    }
}

export const activateUserReducer = (state = INITIAL_STATE.userActivate, action) => {
    switch(action.type) {
        case FETCH_USER_BY_KEY_INIT:
            return Object.assign({...state, data: {}});
        case FETCH_USER_BY_KEY_SUCCESS:
            return Object.assign({...state, data: action.userActivate})
        default:
            return state;
    }
}