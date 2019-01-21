import {    FETCH_TAGS_INIT,
            FETCH_TAGS_SUCCESS} from 'actions/types';

const INITIAL_STATE = {
    tags: {
        data: {},
    },
}

export const getTagsReducer = (state = INITIAL_STATE.tags, action) => {
    switch(action.type) {
        case FETCH_TAGS_INIT:
            return {...state, data: {}};
        case FETCH_TAGS_SUCCESS:
            return {...state, data: action.tags}
        default:
            return state;
    }
}