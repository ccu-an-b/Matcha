import thunk from 'redux-thunk';
import { reducer as formReducer} from 'redux-form';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';

import { authReducer} from './auth-reducer';

export const init = () => {
    const reducer = combineReducers({
        form: formReducer,
        auth: authReducer
    });

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

    return store;
}