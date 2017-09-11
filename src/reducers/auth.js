const defaultState = {
    username: '',
    email: '',
    password: '',
    rePassword: '',
    shownForm: 'login'
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_AUTH':
            return { ...state, [action.key]: action.value };
        case 'SHOW_REGISTER':
            return { ...state, shownForm: state.shownForm === 'login' ? 'register' : 'login' }
        default:
            return state;
    }
};