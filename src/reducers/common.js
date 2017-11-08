const defaultState = {
    appName: 'reactive-bart',
    currentUser: {},
    token: null,
    usernameSet: ''
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_APP_NAME':
            return { ...state };
        case 'REGISTER':
            return { ...state };
        case 'LOGIN':
            return { ...state, currentUser: action.currentUser, token: action.token };
        case 'LOGOUT':
            //localStorage.removeItem('token');
            return defaultState;
        case 'APP_LOAD':
            return { ...state, token: action.token || null, currentUser: action.user };
        case 'UPDATE_SET_USERNAME_FIELD':
            return { ...state, usernameSet: action.value };
        case 'USERNAME_SET':
            return { ...state, currentUser: action.user };
        default:
            return state;
    }
};