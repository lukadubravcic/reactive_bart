let currentDate = new Date();

const defaultState = {
    whom: '',
    howManyTimes: 1,
    deadlineChecked: false,
    deadlineDate: currentDate.setDate(currentDate.getDate() + 1),
    whatToWrite: '',
    why: '',
    _message: null,
    acceptedPunishments: {}
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_PUNISH_CREATE':
            return { ...state, [action.key]: action.value };
        case 'TOGGLE_PUNISHMENT_DEADLINE_CKECKBOX':
            return { ...state, deadlineChecked: !state.deadlineChecked };
        case 'PUNISHMENT_CREATED':
            console.log('Reducer: ')
            console.log(action)
            return { ...state, _message: action.msg };
        case 'PUNISHMENT_CREATED_ERROR':
            return { ...state, _message: action.msg };
        case 'ACCEPTED_PUNISHMENTS_LOADED':
            return { ...state, acceptedPunishments: action.punishments };
        default:
            return state;
    }
};