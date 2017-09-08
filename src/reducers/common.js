const defaultState = {
    appName: 'reactive-bart',
    token: null
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_APP_NAME':
            return { ...state };
        case 'REGISTER':
            return { ...state };
        case 'LOGIN':
        console.log(action);
            return { ...state, email: action.email, username: action.username, token: action.token};
        case 'UPDATE_FIELD_LOGIN':
            return { ...state, [action.key]: action.value }
        default:
            return state;
    }
};