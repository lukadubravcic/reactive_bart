const defaultState = {
    appName: 'reactive-bart',
    currentUser: {},
    token: null,
    loadInProgress: false,
    usernameSet: '',
    _errMsg: null,
    rank: null,
    guestDataLoadingInProgress: false,
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_APP_NAME':
            return { ...state };
        case 'REGISTER':
            return { ...state };
        case 'LOGIN':
            return { ...state, currentUser: action.currentUser, token: action.token, rank: action.rank };
        case 'LOGOUT':
            return defaultState;
        case 'APP_LOAD':
            return { ...state, token: action.token || null, currentUser: action.user, loadInProgress: defaultState.loadInProgress, rank: action.rank };
        case 'GUEST_PUNISHMENT_LOADED':
            return { ...state, guestDataLoadingInProgress: defaultState.guestDataLoadingInProgress };
        case 'GUEST_PUNISHMENT_LOADING':
            return { ...state, guestDataLoadingInProgress: true }
        case 'GUEST_PUNISHMENT_INVALID':
            return { ...state, guestDataLoadingInProgress: defaultState.guestDataLoadingInProgress };
        case 'UPDATE_SET_USERNAME_FIELD':
            return { ...state, usernameSet: action.value };
        case 'USERNAME_SET':
            return { ...state, currentUser: action.user };
        case 'LOADING_IN_PROGRESS':
            return { ...state, loadInProgress: true };
        case 'SET_USERNAME_ERROR':
            return { ...state, _errMsg: action.errMsg };
        case 'PUNISHMENT_MARKED_DONE':
            return { ...state, rank: action.newRank }
        default:
            return state;
    }
};