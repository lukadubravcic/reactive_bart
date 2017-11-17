const defaultState = {
    show_tooltips: true,
    notify_trying: false,
    notify_done: true,
    notify_failed: false,
    sound: true,
    wall_season: 'plain',
    classroom_wall: 'plain',
    classroom_board: 'plain'
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'PREFS_UPDATED':
            return { ...state, ...action.newPref };
        case 'LOGIN':
            return { ...state, ...action.prefs };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
}