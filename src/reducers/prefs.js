const defaultState = {
    show_tooltips: true,
    notify_trying: false,
    notify_done: true,
    notify_failed: false,
    punishment_accepted: true,
    punishment_rejected: true,
    punishment_ignored: true,
    punishment_givenup: true,
    sound: true,
    wall_season: 'plain',
    classroom_wall: 'plain',
    classroom_board: 'plain',
    showPrefs: 0,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'APP_LOAD':
            return { ...state, ...action.pref };
        case 'PREFS_UPDATED':
            return { ...state, ...action.newPref };
        case 'LOGIN':
            return { ...state, ...action.prefs };
        case 'SHOW_PREFS':
            return { ...state, showPrefs: 1 };
        case 'REMOVE_SHOW_PREF_FLAG':
            return { ...state, showPrefs: 0 };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
}