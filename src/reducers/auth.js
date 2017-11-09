const defaultState = {
    username: '',
    email: '',
    password: '',
    rePassword: '',
    shownForm: 'login',
    _serverAnswer: '',
    submitDisabled: true
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_AUTH':
            return { ...state, [action.key]: action.value };
        case 'REGISTER_LOGIN_TOGGLE':
            return { ...state, email: '', password: '', username: '', rePassword: '', shownForm: state.shownForm === 'login' ? 'register' : 'login' };
        case 'REGISTER':
            return { ...state, username: '', email: '', password: '', rePassword: '', _serverAnswer: action.payload, shownForm: state.shownForm === 'login' ? 'register' : 'login' };
        case 'LOGIN':
            return { ...state, email: '', password: '' };
        case 'DISABLE_SUBMIT':
            return { ...state, submitDisabled: true };
        case 'ENABLE_SUBMIT':
            return { ...state, submitDisabled: false };
        default:
            return state;
    }
};