let currentDate = new Date();

const defaultState = {
    activePunishment: {
        whom: '',
        howManyTimes: 1,
        deadlineChecked: false,
        deadlineDate: currentDate.setDate(currentDate.getDate() + 1),
        whatToWrite: '',
        why: ''
    },
    _message: null,

    selectedTab: 'acceptedTab', // TODO: ako je tab prazan pogledaj sljedeci -> itd. -> else "No data."

    acceptedPunishments: 'empty',
    shownAcceptedPunishments: 'empty',
    currentAcceptedPage: 1,

    pastPunishments: 'empty',
    shownPastPunishments: 'empty',
    currentPastPage: 1,

    orderedPunishments: 'empty',
    shownOrderedPunishments: 'empty',
    currentOrderedPage: 1,

};

export default (state = defaultState, action) => {
    console.log(action.type)
    switch (action.type) {
        case 'UPDATE_FIELD_PUNISH_CREATE':
            return { ...state, [action.key]: action.value };
        case 'TOGGLE_PUNISHMENT_DEADLINE_CKECKBOX':
            return { ...state, deadlineChecked: !state.activePunishment.deadlineChecked };
        case 'PUNISHMENT_CREATED':
            return { ...state, _message: action.msg };
        case 'PUNISHMENT_CREATED_ERROR':
            return { ...state, _message: action.msg };
        case 'SET_ACTIVE_PUNISHMENT':
            // TODO : setira aktivnu kaznu na board
            return { ...state, activePunishment: action.punishment };
        case 'GIVE_UP_ON_PUNISHMENT':
            return { ...state, acceptedPunishments: action.newAcceptedPunishments };
        case 'SWITCH_SELECTED_PUNISHMENT_TAB':
            // promjena taba u selector tableu
            return { ...state, selectedTab: action.id };

        case 'ACCEPTED_PUNISHMENTS_LOADED':
            return { ...state, acceptedPunishments: action.punishments };
        case 'UPDATE_SHOWN_ACCEPTED_PUNISHMENTS':
            return { ...state, shownAcceptedPunishments: action.punishments, currentAcceptedPage: action.newPage };
        case 'ACCEPTED_PUNISHMENTS_CHANGED':
            return { ...state, acceptedPunishments: action.punishments };

        case 'PAST_PUNISHMENTS_LOADED':
            return { ...state, pastPunishments: action.punishments };
        case 'UPDATE_SHOWN_PAST_PUNISHMENTS':
            return { ...state, shownPastPunishments: action.punishments, currentPastPage: action.newPage };
        case 'PAST_PUNISHMENTS_CHANGED':
            return { ...state, pastPunishments: action.punishments };
        case 'UPDATE_PAST_HEADER':
            return {...state, pastHeader: action.columns}

        case 'ORDERED_PUNISHMENTS_LOADED':
            return { ...state, orderedPunishments: action.punishments };
        case 'UPDATE_SHOWN_ORDERED_PUNISHMENTS':
            return { ...state, shownOrderedPunishments: action.punishments, currentOrderedPage: action.newPage };
        case 'ORDERED_PUNISHMENTS_CHANGED':
            return { ...state, orderedPunishments: action.punishments };


        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
};