import { applyMiddleware, createStore } from 'redux';
// import { promiseMiddleware} from './middleware';

const defaultState = {
    appName: 'ReactiveBart',
    userLoggedIn: false,
    userName: 'Josko Lokazz',
    userEmail: 'def',
    userPassword: 'def',
    auth: {}
}

const reducer = function (state = defaultState, action) {
    switch (action.type) {
        case 'GET_APP_NAME':
            return { ...state };
        case 'REGISTER':
            return { ...state, userName: action.username, userEmail: action.email };
        case 'LOGIN':
            return { ...state };
        case 'UPDATE_FIELD_AUTH':
            return { ...state, [action.key]: action.value };
        default:
            return state;
    }
};

// const middleware = applyMiddleware(promiseMiddleware);

const store = createStore(reducer);
window.store = store;  // available from console

export default store;