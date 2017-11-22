const defaultState = {
    username: '',
    email: '',
    password: '',
    rePassword: '',
    shownForm: 'login',
    _errMsg: null
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_AUTH':
            return { ...state, [action.key]: action.value };
        case 'REGISTER_LOGIN_TOGGLE':
            return { ...defaultState, shownForm: state.shownForm === 'login' ? 'register' : 'login' };
        case 'REGISTER':
            return { ...defaultState };
        case 'LOGIN':
            return { ...state, email: defaultState.email, password: defaultState.password };
        case 'FAILED_REGISTER':
            return { ...state, _errMsg: action.errMsg };
        case 'LOGIN_FAILED':
            return { ...state, _errMsg: action.errMsg }
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
};