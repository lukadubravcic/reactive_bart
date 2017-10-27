const defaultState = {
    show_tooltips: true,
    notify_trying: false,
    notify_done: true,
    notify_failed: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'PREFS_UPDATED':
            return { ...state, ...action.newPrefs };
        case 'LOGIN':
            return { ...state, ...action.prefs };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
}