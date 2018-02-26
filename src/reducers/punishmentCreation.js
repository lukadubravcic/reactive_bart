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
    _errMsg: null
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_PUNISH_CREATE':
            return { ...state, [action.key]: action.value };
        case 'TOGGLE_PUNISHMENT_DEADLINE_CKECKBOX':
            return { ...state, deadlineChecked: !state.deadlineChecked };
        case 'UPDATE_DEADLINE_FIELD':
            return { ...state, [action.field]: action.value };
        case 'PUNISHMENT_CREATED':
            return { ...defaultState, _errMsg: action.msg };
        case 'PUNISHMENT_CREATED_ERROR':
            return { ...state, _errMsg: action.msg };
        case 'SUBMITING_NEW_PUNISHMENT':
            return { ...state, _errMsg: defaultState._errMsg }
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
};