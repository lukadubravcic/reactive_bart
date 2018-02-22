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
    boardDisabled: true,
    spongeHovered: false,
    timeSpent: 0,
    startingSentenceFirstPart: '',
    startingSentenceSecondPart: '',
    startingSentenceThirdPart: '',
    cheating: false,
    guestPunishment: null,
    startSentenceBeingWritten: true,
};

export default (state = defaultState, action) => {

    switch (action.type) {

        case 'STARTING_SENTANCE_CHANGED':
            return {
                ...state,
                startingSentenceFirstPart: action.stringArray[0],
                startingSentenceSecondPart: action.stringArray[1],
                startingSentenceThirdPart: action.stringArray[2]
            }
        case 'UPDATE_BOARD_VALUE':
            return { ...state, boardValue: action.value };
        case 'TOGGLE_BOARD_DISABLED_STATUS':
            return { ...state, boardDisabled: action.disabled };
        case 'BOARD_WRONG_ENTRY':
            return { ...state, boardTextMistake: action.mistake };
        case 'SET_ACTIVE_PUNISHMENT':
            return {
                ...state,
                activePunishment: action.punishment,
                gameInProgress: defaultState.gameInProgress,
                timerValue: defaultState.timerValue,
                // punishmentIdFromURL: action.ignoredPunishmentSet ? state.punishmentIdFromURL : defaultState.punishmentIdFromURL,
                boardTextMistake: defaultState.boardTextMistake,
                boardValue: defaultState.boardValue,
                progress: defaultState.progress,
                startingSentence: defaultState.startingSentence
            };
        case 'UPDATE_PUNISHMENT_PROGRESS':
            return { ...state, progress: action.updatedProgress };
        case 'PUNISHMENT_TRY_LOGGED':
            return {
                ...state,
                progress: defaultState.progress,
                boardValue: defaultState.boardValue,
                timeSpent: defaultState.timeSpent,
                timerValue: defaultState.timerValue,
                gameInProgress: defaultState.gameInProgress,
                boardTextMistake: defaultState.boardTextMistake
            }
        case 'PUNISHMENT_DONE':
            return { ...state, boardFocused: false };
        case 'GAME_BOARD_FOCUSED':
            return { ...state, boardFocused: true, gameInProgress: true, boardHovered: false };
        case 'GAME_BOARD_UNFOCUSED':
            return { ...state, boardFocused: false };
        case 'GAME_BOARD_HOVER':
            return { ...state, boardHovered: true };
        case 'GAME_BOARD_HOVER_OUT':
            return { ...state, boardHovered: false };
        case 'SPONGE_HOVER':
            return { ...state, spongeHovered: true }
        case 'SPONGE_HOVER_OUT':
            return { ...state, spongeHovered: false }
        case 'TIMER_VALUE_UPDATED':
            return { ...state, timerValue: action.newTimerValue, timeSpent: action.timeSpent };
        case 'CLOCK_VALUE_UPDATED':
            return { ...state, clockValue: action.newClockValue };
        case 'GAME_RESETED':
            return {
                ...state,
                progress: defaultState.progress,
                boardValue: defaultState.boardValue,
                timeSpent: defaultState.timeSpent,
                timerValue: defaultState.timerValue,
                gameInProgress: defaultState.gameInProgress,
                boardTextMistake: defaultState.boardTextMistake,
                startingSentence: defaultState.startingSentence
            };
        case 'USERNAME_SET':
            return { ...state, activePunishment: action.specialPunishment };
        case 'USERNAME_SET_AS_GUEST':
            return { ...state, activePunishment: action.specialPunishment };
        /* case 'STOPWATCH_RESET':
            return { ...state, timerValue: defaultState.timerValue, gameInProgress: false }; */
        case 'PUNISHMENT_IN_URL':
            return { ...state, punishmentIdFromURL: action.id };
        case 'LOGIN':
            return { ...defaultState, punishmentIdFromURL: state.punishmentIdFromURL };
        case 'GAME_UNMOUNT':
            return defaultState;
        case 'SPECIAL_LOGOUT':
            return { ...defaultState, guestPunishment: state.guestPunishment, punishmentIdFromURL: state.punishmentIdFromURL };
        case 'LOGOUT':
            return defaultState;
        case 'CHEATING_DETECTED':
            return { ...state, cheating: true };
        case 'GUEST_PUNISHMENT_LOADED':
            return { ...state, guestPunishment: action.punishment };
        case 'INVITED_GUEST_PUNISHMENT_LOADED':
            return { ...state, guestPunishment: action.punishment };
        case 'START_SENTENCE_WRITING_START':
            return { ...state, startSentenceBeingWritten: true };
        case 'START_SENTENCE_WRITING_FINISHED':
            return { ...state, startSentenceBeingWritten: false };

        default:
            return state;
    }
}