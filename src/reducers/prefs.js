const defaultState = {
    tooltips: true,
    notifyTrying: false,
    notifyDone: true,
    notifyFailed: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'PREFS_UPDATED':
            return { ...state, ...action.newPrefs }
        default:
            return state;
    }
}