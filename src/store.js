import { applyMiddleware, createStore } from 'redux';
// import { promiseMiddleware} from './middleware';

const defaultState = {
    appName: 'ReactiveBart',
    user: null
}

const reducer = function (state = defaultState, action) {
    switch (action.type) {
        case 'GET_APP_NAME':
            return { ...state };
    }
    return state;
};

// const middleware = applyMiddleware(promiseMiddleware);

const store = createStore(reducer);
window.store = store;

export default store;