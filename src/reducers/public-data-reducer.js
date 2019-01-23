import {
    FETCH_USER_PUBLIC_INFO_INIT,
    FETCH_USER_PUBLIC_INFO_SUCCESS
} from 'actions/types';

const INITIAL_STATE = {
    publicData: {
        data: {},
    }
}

export const publicDataReducer = (state = INITIAL_STATE.publicData, action) => {
    switch (action.type) {
        case FETCH_USER_PUBLIC_INFO_INIT:
            return { ...state, data: {} };
        case FETCH_USER_PUBLIC_INFO_SUCCESS:
            return { ...state, data: action.publicData }
        default:
            return state;
    }
}