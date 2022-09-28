const historyReducer = (state = [], action) => {
    console.log("historyReducer called, state and action below:");
    console.log(state);
    console.log(action);

    switch(action.type) {
        case "RECORD":
            return state.concat(action.value);
        case "CLEAR":
            return [];
        default:
            return state;
    }
}

export default historyReducer;