import {    FETCH_USER_BY_KEY_INIT,
            FETCH_USER_BY_KEY_SUCCESS,
            FETCH_USER_PROFILE_INIT,
            FETCH_USER_PROFILE_SUCCESS} from 'actions/types';

const INITIAL_STATE = {
    user: {
        data:{},
    },
    userActivate: {
        data:{},
    }
}

export const selectedUserReducer = (state = INITIAL_STATE.user, action) => {
    switch(action.type) {
        case FETCH_USER_PROFILE_INIT:
            return {...state, data: {}};
        case FETCH_USER_PROFILE_SUCCESS:
            return {...state, data: action.user}
        default:
            return state;
    }
}

export const activateUserReducer = (state = INITIAL_STATE.userActivate, action) => {
    switch(action.type) {
        case FETCH_USER_BY_KEY_INIT:
            return {...state, data: {}};
        case FETCH_USER_BY_KEY_SUCCESS:
            return {...state, data: action.userActivate}
        default:
            return state;
    }
}