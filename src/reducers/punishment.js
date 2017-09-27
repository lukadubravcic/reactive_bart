let currentDate = new Date();


const defaultState = {
    whom: '',
    howManyTimes: 22,
    deadlineChecked: false,
    deadlineDate: currentDate.setDate(currentDate.getDate() + 1),
    whatToWrite: '',
    why: '',

};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_PUNISH_CREATE':
            return { ...state, [action.key]: action.value };
        case 'TOGGLE_PUNISHMENT_DEADLINE_CKECKBOX':
            return { ...state, deadlineChecked: !state.deadlineChecked }
        default:
            return state;
    }
};