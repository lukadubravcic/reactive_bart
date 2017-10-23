const defaultState = {
    boardValue: '',
    activePunishment: {},
    timerValue: {
        timerDays: 0,
        timerHours: 0,
        timerMinutes: 0,
        timerSeconds: 0
    },
    clockValue: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    boardFocused: false,
    boardHovered: false,
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
        case 'GAME_BOARD_FOCUSED':
            return { ...state, boardFocused: true }
        case 'GAME_BOARD_UNFOCUSED':
        console.log('unfocused')
            return { ...state, boardFocused: false }
        case 'TIMER_VALUE_UPDATED':
            return { ...state, timerValue: action.newTimerValue };
            case 'CLOCK_VALUE_UPDATED':
            return {...state, clockValue: action.newClockValue }
        default:
            return state;
    }
}