const defaultState = {
    punishmentIdFromURL: null,
    boardValue: '',
    progress: 0,
    boardTextMistake: false,
    activePunishment: {},
    timerValue: {
        timerHours: 0,
        timerMinutes: 0,
        timerSeconds: 0
    },
    clockValue: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    gameInProgress: false,
    boardFocused: false,
    boardHovered: false,
    timeSpent: 0
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_BOARD_VALUE':
            return { ...state, boardValue: action.value };
        case 'TOGGLE_BOARD_DISABLED_STATUS':
            return { ...state, boardDisabled: action.disabled };
        case 'BOARD_WRONG_ENTRY':
            return { ...state, boardTextMistake: action.mistake };
        case 'SET_ACTIVE_PUNISHMENT':
            return { ...state, activePunishment: action.punishment, gameInProgress: false, timerValue: defaultState.timerValue, punishmentIdFromURL: null };
        case 'UPDATE_PUNISHMENT_PROGRESS':
            return { ...state, progress: action.updatedProgress };
        case 'PUNISHMENT_TRY_LOGGED':
            return { ...state, progress: 0, boardValue: defaultState.boardValue, timeSpent: 0, timerValue: defaultState.timerValue, gameInProgress: false }
        case 'PUNISHMENT_DONE':
            return { ...state, gameInProgress: false };
        case 'GAME_BOARD_FOCUSED':
            return { ...state, boardFocused: true, gameInProgress: true };
        case 'GAME_BOARD_UNFOCUSED':
            return { ...state, boardFocused: false };
        case 'GAME_BOARD_HOVER':
            return { ...state, boardHovered: true };
        case 'GAME_BOARD_HOVER_OUT':
            return { ...state, boardHovered: false };
        case 'TIMER_VALUE_UPDATED':
            return { ...state, timerValue: action.newTimerValue, timeSpent: action.timeSpent };
        case 'CLOCK_VALUE_UPDATED':
            return { ...state, clockValue: action.newClockValue };
        case 'GAME_RESETED':
            return { ...state, progress: 0, boardValue: defaultState.boardValue, timeSpent: 0, timerValue: defaultState.timerValue, gameInProgress: false };
        case 'USERNAME_SET':
            return { ...state, activePunishment: action.specialPunishment };
        case 'STOPWATCH_RESET':
            return { ...state, timerValue: defaultState.timerValue, gameInProgress: false };
        case 'PUNISHMENT_IN_URL':
            return { ...state, punishmentIdFromURL: action.id };
        case 'LOGIN':
            return { ...defaultState, punishmentIdFromURL: state.punishmentIdFromURL };
        case 'LOGOUT':
            return defaultState;
        default:
            return state;
    }
}