import {    FETCH_SUGGESTED_PROFILES_INIT,
            FETCH_SUGGESTED_PROFILES_SUCCESS,
            FETCH_SUGGESTED_PROFILES_FAIL,
            FETCH_ONE_PROFILE_INIT,
            FETCH_ONE_PROFILE_SUCCESS,
            FETCH_ONE_PROFILE_FAIL,} from 'actions/types';

const INITIAL_STATE = {
    profilesSuggested: {
        data: {},
        error: []
    },
    oneProfile: {
        data: {},
        error: []
    }
}

export const getSuggestedProfilesReducer = (state = INITIAL_STATE.profilesSuggested, action) => {
    switch(action.type) {
        case FETCH_SUGGESTED_PROFILES_INIT:
            return Object.assign({...state, data: {}});
        case FETCH_SUGGESTED_PROFILES_SUCCESS:
            return Object.assign({...state, data: action.profiles})
        case FETCH_SUGGESTED_PROFILES_FAIL:
            return Object.assign({...state, error: action.profiles})
        default:
            return state;
    }
}

export const getOneProfileReducer = (state = INITIAL_STATE.oneProfile, action) => {
    switch(action.type) {
        case FETCH_ONE_PROFILE_INIT:
            return Object.assign({...state, data: {}});
        case FETCH_ONE_PROFILE_SUCCESS:
            return Object.assign({...state, data: action.oneProfile})
        case FETCH_ONE_PROFILE_FAIL:
            return Object.assign({...state, error: action.oneProfile})
        default:
            return state;
    }
}