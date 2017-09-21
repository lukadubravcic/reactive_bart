const defaultState = {
    boardValue: ''
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_BOARD_VALUE':
            return { ...state, boardValue: action.value }
        case 'TOGGLE_BOARD_DISABLED_STATUS':
            return { ...state, boardDisabled: action.disabled }
        case 'BOARD_WRONG_ENTRY':
            return { ...state, boardTextMistake: action.mistake }
        default:
            return state;
    }
}