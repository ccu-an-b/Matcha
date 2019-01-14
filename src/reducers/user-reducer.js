import {    FETCH_USER_BY_KEY_INIT,
            FETCH_USER_BY_KEY_SUCCESS} from 'actions/types';

const INITIAL_STATE = {
    user: {
        data:{},
    }
}

export const selectedUserReducer = (state = INITIAL_STATE.user, action) => {
    switch(action.type) {
        case FETCH_USER_BY_KEY_INIT:
            return {...state, data: {}};
        case FETCH_USER_BY_KEY_SUCCESS:
            return {...state, data: action.user}
        default:
            return state;
    }
}