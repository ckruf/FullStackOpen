import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: null,
    reducers: {
        showNotification(state, action) {
            if (state && state.timeOutID) {
                clearTimeout(state.timeOutID);
            }
            return action.payload;
        },
        clearNotification(state, action) {
            return null;
        }
    }
});

export const { showNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (message, timeoutSecs) => {
    return dispatch => {
        const timeOutID = setTimeout(() => {
            dispatch(clearNotification(message));
        }, timeoutSecs * 1000);
        dispatch(showNotification({message, timeOutID}));
    }
};

export default notificationSlice.reducer;