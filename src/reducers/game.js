const defaultState = {
    boardValue: '',
    activePunishment: {},
    punishmentProgress: 0, // progress in %
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_BOARD_VALUE':
            return { ...state, boardValue: action.value }
        case 'TOGGLE_BOARD_DISABLED_STATUS':
            return { ...state, boardDisabled: action.disabled }
        case 'BOARD_WRONG_ENTRY':
            return { ...state, boardTextMistake: action.mistake }
        case 'SET_ACTIVE_PUNISHMENT':
            return { ...state, activePunishment: action.punishment }
        case 'UPDATE_PUNISHMENT_PROGRESS':
            return { ...state, punishmentProgress: action.punishmentProgress }
        case 'ACTIVE_PUNISHMENT_SAVED':
            return { ...state, boardValue: '', punishmentProgress: 0 }
        default:
            return state;
    }
}