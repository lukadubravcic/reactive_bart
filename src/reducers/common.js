const defaultState = {
    appName: 'reactive-bart',
    token: null,
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_APP_NAME':
            return { ...state };
        case 'REGISTER':
            return { ...state };
        case 'LOGIN':
            return { ...state, currentUser: action.currentUser, token: action.token };        
        default:
            return state;
    }
};