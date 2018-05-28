const defaultState = {
    appName: 'skolded',
    currentUser: {},
    token: null,
    loadInProgress: false,
    usernameSet: '',
    _errMsg: null,
    rank: null,
    guestDataLoadingInProgress: false,
    guestAccessMsg: null,
    msgDuration: null,
    guestUser: null,
    policyAgreementStatus: false,
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_APP_NAME':
            return { ...state };
        case 'REGISTER':
            return { ...state };
        case 'LOGIN':
            return { ...state, currentUser: action.currentUser, token: action.token, rank: action.rank };
        case 'SPECIAL_LOGOUT':
            return { ...defaultState, guestDataLoadingInProgress: state.guestDataLoadingInProgress, guestAccessMsg: state.guestAccessMsg, guestUser: state.guestUser, policyAgreementStatus: state.policyAgreementStatus };
        case 'LOGOUT':
            return { ...defaultState, policyAgreementStatus: state.policyAgreementStatus };
        case 'APP_LOAD':
            return { ...state, token: action.token || null, currentUser: action.user, loadInProgress: defaultState.loadInProgress, rank: action.rank };
        case 'GUEST_PUNISHMENT_LOADED':
            return { ...state, guestDataLoadingInProgress: defaultState.guestDataLoadingInProgress, guestUser: action.guestUser };
        case 'INVITED_GUEST_PUNISHMENT_LOADED':
            return { ...state, guestDataLoadingInProgress: defaultState.guestDataLoadingInProgress, guestUser: action.guestUser };
        case 'GUEST_PUNISHMENT_LOADING':
            return { ...state, guestDataLoadingInProgress: true }
        case 'GUEST_PUNISHMENT_INVALID':
            return { ...state, guestDataLoadingInProgress: defaultState.guestDataLoadingInProgress, guestAccessMsg: action.msg, msgDuration: action.msgDuration };
        case 'UPDATE_SET_USERNAME_FIELD':
            return { ...state, usernameSet: action.value };
        case 'USERNAME_SET':
            return { ...state, currentUser: action.user };
        case 'USERNAME_SET_AS_GUEST':
            return { ...state, guestUser: action.user };
        case 'LOADING_IN_PROGRESS':
            return { ...state, loadInProgress: true };
        case 'SET_USERNAME_ERROR':
            return { ...state, _errMsg: action.errMsg };
       /*  case 'PUNISHMENT_MARKED_DONE':
            return { ...state, rank: action.newRank }; */
        case 'REMOVE_GUEST_ACCESS_MSG':
            return { ...state, guestAccessMsg: defaultState.guestAccessMsg, msgDuration: defaultState.msgDuration };
        case 'POLICY_AGREEMENT_STATUS_UPDATE':
            return { ...state, policyAgreementStatus: action.value };
        default:
            return state;
    }
};