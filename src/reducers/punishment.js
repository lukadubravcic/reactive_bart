const defaultState = {
    _message: null,

    selectedTab: null,

    acceptedPunishments: 'empty',
    shownAcceptedPunishments: 'empty',
    currentAcceptedPage: 1,

    pastPunishments: 'empty',
    shownPastPunishments: 'empty',
    currentPastPage: 1,
    pastPunishmentsResorted: false,

    orderedPunishments: 'empty',
    shownOrderedPunishments: 'empty',
    currentOrderedPage: 1,

    showAcceptedTab: false,
    showPastTab: false,
    showOrderedTab: false,

    specialPunishments: 'empty',
    randomPunishments: 'empty',

    ignoredPunishmentSet: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        // case 'UPDATE_FIELD_PUNISH_CREATE':
        //     return { ...state, [action.key]: action.value };
        // case 'TOGGLE_PUNISHMENT_DEADLINE_CKECKBOX':
        //     return { ...state, deadlineChecked: !state.activePunishment.deadlineChecked };
        case 'PUNISHMENT_CREATED':
            return { ...state, _message: action.msg, orderedPunishments: action.newOrderedPunishments };
        case 'PUNISHMENT_CREATED_ERROR':
            return { ...state, _message: action.msg };
        case 'SET_ACTIVE_PUNISHMENT':
            return { ...state, ignoredPunishmentSet: action.ignoredPunishmentSet ? action.ignoredPunishmentSet : defaultState.ignoredPunishmentSet };
        case 'GIVE_UP_ON_PUNISHMENT':
            return { ...state, acceptedPunishments: action.newAcceptedPunishments };
        case 'SWITCH_SELECTED_PUNISHMENT_TAB':
            return { ...state, selectedTab: action.id };
        case 'SAVING_ACTIVE_PUNISHMENT':
            return { ...state };

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
            return { ...state, pastPunishments: action.punishments, pastPunishmentsResorted: action.pastPunishmentsResorted };
        case 'CLEAR_PAST_PUN_RESORTED_FLAG':
            return { ...state, pastPunishmentsResorted: defaultState.pastPunishmentsResorted };

        case 'ORDERED_PUNISHMENTS_LOADED':
            return { ...state, orderedPunishments: action.punishments };
        case 'UPDATE_SHOWN_ORDERED_PUNISHMENTS':
            return { ...state, shownOrderedPunishments: action.punishments, currentOrderedPage: action.newPage };
        case 'ORDERED_PUNISHMENTS_CHANGED':
            return { ...state, orderedPunishments: action.punishments, orderedPunishmentsResorted: action.orderedPunishmentsResorted };

        case 'ACCEPTED_TAB_HEADER_VISIBILITY_CHANGED':
            return { ...state, showAcceptedTab: action.value };
        case 'PAST_TAB_HEADER_VISIBILITY_CHANGED':
            return { ...state, showPastTab: action.value };
        case 'ORDERED_TAB_HEADER_VISIBILITY_CHANGED':
            return { ...state, showOrderedTab: action.value };

        case 'SET_RANDOM_PUNISHMENTS':
            return { ...state, randomPunishments: action.punishments };
        case 'SET_SPECIAL_PUNISHMENTS':
            return { ...state, specialPunishments: action.punishments };

        case 'SPECIAL_LOGOUT':
            return { ...defaultState, specialPunishments: state.specialPunishments, randomPunishments: state.randomPunishments };
        case 'LOGOUT':
            return { ...defaultState, specialPunishments: state.specialPunishments, randomPunishments: state.randomPunishments };
        default:
            return state;
    }
};