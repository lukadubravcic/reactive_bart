const defaultState = {}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_ORDERED_GRAPH_DATA':
            return {
                ...state,
                firstGraph: action.data.graphData1.length > 0 ? action.data.graphData1 : state.grapData1 ? state.grapData1 : null,
                secondGraph: action.data.graphData2.length > 0 ? action.data.graphData2 : state.grapData2 ? state.grapData2 : null
            };
        case 'UPDATE_RECEIVED_GRAPH_DATA':
            return {
                ...state,
                thirdGraph: action.data.graphData3.length > 0 ? action.data.graphData3 : state.grapData3 ? state.grapData3 : null,
                fourthGraph: action.data.graphData4.length > 0 ? action.data.graphData4 : state.grapData4 ? state.grapData4 : null
            }
        case 'LOGOUT':
            return defaultState;
        default:
            return { ...state };
    }

}