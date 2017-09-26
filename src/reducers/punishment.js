const defaultState = {
    whom: '',
    howManyTimes: 0,
    deadline: new Date,
    whatToWrite: '',
    why: '',

};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD_PUNISH_CREATE':
            return { ...state, [action.key]: action.value };
        default:
            return state;
    }
};