const defaultState = {
    username: '',
    email: '',
    password: '',
    rePassword: '',
    shownForm: 'login',
    _errMsg: null,
    showSetNewPasswordComponent: false,
    showResetPasswordForm: false
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_AUTH':
            return { ...state, [action.key]: action.value };
        case 'REGISTER_LOGIN_TOGGLE':
            return { ...defaultState, shownForm: state.shownForm === 'login' ? 'register' : 'login' };
        case 'REGISTER':
            return { ...defaultState };
        case 'REGISTER_ATTEMPT':
            return { ...state, _errMsg: defaultState._errMsg };
        case 'FAILED_REGISTER':
            return { ...state, _errMsg: action.errMsg };
        case 'LOGIN':
            return { ...state, email: defaultState.email, password: defaultState.password };
        case 'LOGIN_ATTEMPT':
            return { ...state, _errMsg: defaultState._errMsg };
        case 'LOGIN_FAILED':
            return { ...state, _errMsg: action.errMsg };
        case 'SHOW_CHANGE_PASSWORD_FORM':
            return { ...state, showSetNewPasswordComponent: action.value };
        case 'SHOW_RESET_PASSWORD_FORM':
            return { ...state, showResetPasswordForm: true };
        case 'HIDE_RESET_PASSWORD_FORM':
            return { ...defaultState };
        case 'RESET_PASSWORD_ATTEMPT':
            return { ...state, _errMsg: null };
        case 'RESET_PASSWORD_ANSWER':
            return { ...state, _errMsg: action.errMsg };
        case 'RESET_PASSWORD_FAILED':
            return { ...state, _errMsg: action.errMsg };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
}