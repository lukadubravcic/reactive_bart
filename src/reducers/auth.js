const defaultState = {
    userIdFromURL: null,
    loginWhom: '',
    username: '',
    email: '',
    password: '',
    rePassword: '',
    shownForm: 'login',
    _errMsg: null,
    serverAnswer: null,
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
            return { ...defaultState, shownForm: state.shownForm, serverAnswer: action.serverAnswer };
        case 'REGISTER_MAIL_INVALID':
            return { ...state, username: state.email, email: defaultState.email, _errMsg: action.errMsg };
        case 'REGISTER_ATTEMPT':
            return { ...state, _errMsg: defaultState._errMsg, serverAnswer: defaultState.serverAnswer };
        case 'FAILED_REGISTER':
            return { ...state, _errMsg: action.errMsg, password: defaultState.password, rePassword: defaultState.rePassword };
        case 'REGISTER_EXISTING_MAIL':
            return { ...state, shownForm: 'login', loginWhom: state.email, password: defaultState.password, _errMsg: action.errMsg };
        case 'LOGIN':
            return { ...defaultState };
        case 'LOGIN_ATTEMPT':
            return { ...state, _errMsg: defaultState._errMsg, password: defaultState.password };
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
        case 'USERID_IN_URL':
            return { ...state, userIdFromURL: action.id };
        case 'GUEST_PUNISHMENT_LOADED':
            return { ...state, loginWhom: action.guestUser.email };
        case 'USERNAME_SET_AS_GUEST':
            return { ...state, loginWhom: action.user.username };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
}