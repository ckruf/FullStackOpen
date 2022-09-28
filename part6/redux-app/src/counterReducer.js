const counterReducer = (state = 0, action) => {
    console.log("counterReducer called, state and action below:");
    console.log(state);
    console.log(action);

    switch(action.type) {
        case "INCREMENT":
            return state + 1
        case "DECREMENT":
            return state - 1;
        case "ZERO":
            return 0
        default:
            return state;
    }
}

export default counterReducer;