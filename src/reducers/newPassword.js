const defaultState = {
    currentPassword: '',
    newPassword: '',
    reNewPassword: '',
    _errMsg: null
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.key]: action.value };
        case 'SETTING_NEW_PASSWORD':
            return { ...state, _errMsg: defaultState._errMsg };
        case 'SETTING_NEW_PASSWORD_FAILED':
            return { ...defaultState, _errMsg: action.errMsg };
        case 'PASSWORD_CHANGED':
            return { ...defaultState };
        default:
            return state;
    }
}