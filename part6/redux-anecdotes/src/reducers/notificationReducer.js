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
})

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;