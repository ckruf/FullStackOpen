import { createStore, combineReducers } from "redux";
import counterReducer from "./counterReducer";
import historyReducer from "./historyReducer";

const reducer = combineReducers({
    counter: counterReducer,
    history: historyReducer
});

const store = createStore(reducer);
console.log("in store.js, getState is:");
console.log(store.getState());


export default store;
