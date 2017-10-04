let currentDate = new Date();

const defaultState = {
        whom: '',
        howManyTimes: 1,
        deadlineChecked: false,
        deadlineDate: currentDate.setDate(currentDate.getDate() + 1),
        whatToWrite: '',
        why: '',
        _message: ''
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_PUNISH_CREATE':
            return { ...state, [action.key]: action.value };
        case 'TOGGLE_PUNISHMENT_DEADLINE_CKECKBOX':
            return { ...state, deadlineChecked: !state.deadlineChecked };
        case 'PUNISHMENT_CREATED':
            return { ...defaultState, _message: action.msg };
        case 'PUNISHMENT_CREATED_ERROR':
            return { ...state, _message: action.msg };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
};