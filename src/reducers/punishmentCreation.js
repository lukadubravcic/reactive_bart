let currentDate = new Date();

const defaultState = {
    whom: '',
    howManyTimes: 1,
    deadlineChecked: false,
    deadlineDate: currentDate.setDate(currentDate.getDate() + 1),
    whatToWrite: '',
    why: '',
    dayField: '',
    monthField: '',
    yearField: '',
    deadlineValid: false,
    anonShare: true,
    _errMsg: null,
    punishingUserSetFromOuterComponent: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'APP_LOAD':
            return { ...state, anonShare: true };
        case 'LOGIN':
            return { ...state, anonShare: true };
        case 'UPDATE_FIELD_PUNISH_CREATE':
            return { ...state, [action.key]: action.value };
        case 'TOGGLE_PUNISHMENT_DEADLINE_CKECKBOX':
            return { ...state, deadlineChecked: !state.deadlineChecked };
        case 'UPDATE_DEADLINE_FIELD':
            return { ...state, [action.field]: action.value };
        case 'UPDATE_DEADLINE_VALIDITY':
            return { ...state, deadlineValid: action.value };
        case 'PUNISHMENT_CREATED':
            return { ...defaultState, anonShare: state.anonShare, _errMsg: action.msg };
        case 'PUNISHMENT_CREATED_ERROR':
            return { ...state, _errMsg: action.msg };
        case 'SUBMITING_NEW_PUNISHMENT':
            return { ...state, _errMsg: defaultState._errMsg };
        case 'SHOW_ERR_MESSAGE':
            return { ...state, _errMsg: action.msg };
        case 'CLEAR_DISPLAY_MSG':
            return { ...state, _errMsg: null }
        case 'LOGOUT':
            return defaultState;
        case 'USERNAME_SET':
            return { ...state, anonShare: defaultState.anonShare };
        case 'SEND_PUNISHMENT':
            return { ...state, punishingUserSetFromOuterComponent: action.toWhom, whom: action.toWhom };
        case 'CLEAR_PUNISHING_USER':
            return { ...state, punishingUserSetFromOuterComponent: defaultState.punishingUserSetFromOuterComponent };
        default:
            return state;
    }
};