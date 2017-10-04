let currentDate = new Date();

const defaultState = {
    createPunishment: {
        whom: '',
        howManyTimes: 1,
        deadlineChecked: false,
        deadlineDate: currentDate.setDate(currentDate.getDate() + 1),
        whatToWrite: '',
        why: ''
    },
    activePunishment: {
        whom: '',
        howManyTimes: 1,
        deadlineChecked: false,
        deadlineDate: currentDate.setDate(currentDate.getDate() + 1),
        whatToWrite: '',
        why: ''
    },
    _message: null,
    acceptedPunishments: [],
    selectedTab: 'accepted'
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_PUNISH_CREATE':
            return { ...state, [action.key]: action.value };
        case 'TOGGLE_PUNISHMENT_DEADLINE_CKECKBOX':
            return { ...state, deadlineChecked: !state.activePunishment.deadlineChecked };
        case 'PUNISHMENT_CREATED':
            return { ...state, _message: action.msg };
        case 'PUNISHMENT_CREATED_ERROR':
            return { ...state, _message: action.msg };
        case 'ACCEPTED_PUNISHMENTS_LOADED':
            return { ...state, acceptedPunishments: action.punishments };
        case 'SET_ACTIVE_PUNISHMENT':
            return { ...state, activePunishment: action.punishment };
        case 'GIVE_UP_ON_PUNISHMENT':
            console.log('GIVE_UP_ON_PUNISHMENT');
            return { ...state, acceptedPunishments: action.newAcceptedPunishments };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
};