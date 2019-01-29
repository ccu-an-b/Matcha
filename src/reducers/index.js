import thunk from 'redux-thunk';
import { reducer as formReducer} from 'redux-form';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';

import { publicDataReducer } from './public-data-reducer';
import { authReducer} from './auth-reducer';
import { selectedUserReducer, activateUserReducer} from './user-reducer';
import { getTagsReducer } from './tags-reducer';

export const init = () => {
    const reducer = combineReducers({
        form: formReducer,
        auth: authReducer,
        publicData: publicDataReducer,
        user: selectedUserReducer,
        userActivate: activateUserReducer,
        tags: getTagsReducer,
    });

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

    return store;
}