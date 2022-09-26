import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: null,
    reducers: {
        showNotification(state, action) {
            const message = action.payload;
            return message;
        },
        clearNotification(state, action) {
            console.log("clearNotification callled");
            return null;
        }
    }
});

export const { showNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (message, timeoutSecs) => {
    return dispatch => {
        dispatch(showNotification(message));
        setTimeout(() => {
            dispatch(clearNotification());
        }, timeoutSecs * 1000);
    }
};

export default notificationSlice.reducer;