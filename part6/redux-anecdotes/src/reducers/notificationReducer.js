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
            if (action.payload === state) {
                return null;
            }
            else {
                return state
            }
        }
    }
});

export const { showNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (message, timeoutSecs) => {
    return dispatch => {
        dispatch(showNotification(message));
        setTimeout(() => {
            dispatch(clearNotification(message));
        }, timeoutSecs * 1000);
    }
};

export default notificationSlice.reducer;