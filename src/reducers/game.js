const defaultState = {
    boardValue: '',
    activePunishment: {},

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
            return { ...state, activePunishment: { ...state.activePunishment, progress: action.updatedProgress } }
        case 'SAVING_ACTIVE_PUNISHMENT':
            return { ...state, boardValue: '' };
        case 'PUNISHMENT_DONE':
            return { ...state };
        default:
            return state;
    }
}