const defaultState = {
    userIdFromURL: null,
    loginWhom: '',
    username: '',
    email: '',
    password: '',
    rePassword: '',
    _errMsg: null,
    serverAnswer: null,
    // showSetNewPasswordComponent: false,
    showResetPasswordForm: false,
    elementToDisplay: 'start',
    forceLogin: false,
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'APP_LOAD':
            return { ...state, elementToDisplay: 'loggedIn' };
        case 'SHOW_LOGIN_FORM':
            return {
                ...state,
                elementToDisplay: 'login',
                loginWhom: state.email !== '' ? state.email : state.username,
                password: defaultState.password,
                rePassword: defaultState.rePassword
            };
        case 'SHOW_CHANGE_PASSWORD_FORM':
            return { ...state, elementToDisplay: 'changePassword' };
        case 'SHOW_RESET_PASSWORD_FORM':
            return {
                ...state,
                elementToDisplay: 'resetPassword',
                email: state.loginWhom
            };
        case 'CHANGE_SHOWN_TOP_ELEMENT':
            return { ...state, elementToDisplay: action.element };

        case 'UPDATE_FIELD_AUTH':
            return { ...state, [action.key]: action.value };
        case 'SHOW_REGISTER_FORM':
            return {
                ...state,
                elementToDisplay: 'register',
                [action.key]: action.value,
                email: action.key === 'username' ? defaultState.email : action.value,
                username: action.key === 'email' ? defaultState.username : action.value,
                password: defaultState.password,
                rePassword: defaultState.rePassword
            };
        case 'REGISTER':
            return {
                ...defaultState,
                email: state.email,
                password: state.password,
                elementToDisplay: state.elementToDisplay,
                serverAnswer: action.serverAnswer,
                forceLogin: action.forceLogin
            };
        case 'REGISTER_MAIL_INVALID':
            return { ...state, username: state.email, email: defaultState.email, _errMsg: action.errMsg };
        case 'REGISTER_ATTEMPT':
            return { ...state, _errMsg: defaultState._errMsg, serverAnswer: defaultState.serverAnswer };
        case 'FAILED_REGISTER':
            return { ...state, _errMsg: action.errMsg, password: defaultState.password, rePassword: defaultState.rePassword };
        case 'REGISTER_EXISTING_MAIL':
            return { ...state, shownForm: 'login', loginWhom: state.email, password: defaultState.password, _errMsg: action.errMsg };
        case 'LOGIN':
            return { ...defaultState, elementToDisplay: 'loggedIn', forceLogin: defaultState.forceLogin };
        case 'LOGIN_ATTEMPT':
            return { ...state, _errMsg: defaultState._errMsg, password: defaultState.password, forceLogin: defaultState.forceLogin };
        case 'LOGIN_FAILED':
            return { ...state, _errMsg: action.errMsg, forceLogin: defaultState.forceLogin };
        /*  case 'SHOW_CHANGE_PASSWORD_FORM':
             return { ...state, showSetNewPasswordComponent: action.value }; */

        case 'HIDE_RESET_PASSWORD_FORM':
            return { ...defaultState, elementToDisplay: 'login' };
        case 'RESET_PASSWORD_ATTEMPT':
            return { ...state, _errMsg: null };
        case 'RESET_PASSWORD_ANSWER':
            return { ...state, _errMsg: action.errMsg };
        case 'RESET_PASSWORD_FAILED':
            return { ...state, _errMsg: action.errMsg };
        case 'USERID_IN_URL':
            return { ...state, userIdFromURL: action.id };
        case 'GUEST_PUNISHMENT_LOADED':
            return { ...state, loginWhom: action.guestUser.email, elementToDisplay: 'login' };
        case 'INVITED_GUEST_PUNISHMENT_LOADED':
            return { ...state, elementToDisplay: 'register', email: action.guestUser.email };
        case 'USERNAME_SET':
            return { ...state, elementToDisplay: 'thanks' };
        case 'USERNAME_SET_AS_GUEST':
            return { ...state, loginWhom: action.user.username };
        case 'CLEAR_FORM_MSG':
            return { ...state, _errMsg: defaultState._errMsg, serverAnswer: defaultState.serverAnswer };
        case 'SPECIAL_LOGOUT':
            return { ...defaultState, userIdFromURL: state.userIdFromURL };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
}