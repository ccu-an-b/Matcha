import {
    FETCH_USER_PUBLIC_DATA_INIT,
    FETCH_USER_PUBLIC_DATA_SUCCESS
} from 'actions/types';

const INITIAL_STATE = {
    publicData: {
        data: {},
    },
}

export const publicDataReducer = (state = INITIAL_STATE.publicData, action) => {
    switch (action.type) {
        case FETCH_USER_PUBLIC_DATA_INIT:
            return Object.assign({ ...state, data: {} })
        case FETCH_USER_PUBLIC_DATA_SUCCESS:
            return Object.assign({ ...state, data: action.publicData })
        default:
            return state;
    }
}