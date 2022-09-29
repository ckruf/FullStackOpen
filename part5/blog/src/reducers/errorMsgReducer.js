import { createSlice } from "@reduxjs/toolkit";

const errorMsgSlice = createSlice({
    name: "errormessage",
    initialState: null,
    reducers: {
        showErrorMsg(state, action) {
            if (state && state.timeOutID) {
                clearTimeout(state.timeOutID);
            }
            return action.payload;
        },
        clearErrorMsg(state, action) {
            return null;
        }
    }
});

export const { showErrorMsg, clearErrorMsg } = errorMsgSlice.actions;

export const setErrorMsg = (message, timeoutSecs) => {
    return dispatch => {
        const timeOutID = setTimeout(() => {
            dispatch(clearErrorMsg(message));
        }, timeoutSecs * 1000);
        dispatch(showErrorMsg({message, timeOutID}));
    }
};

export default errorMsgSlice.reducer;