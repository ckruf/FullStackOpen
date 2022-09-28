import { createSlice } from "@reduxjs/toolkit";

const togglableSlice = createSlice({
    name: "togglable",
    initialState: false,
    reducers: {
        toggle(state, action) {
            return !state;
        }
    }
})

export const { toggle } = togglableSlice.actions;
export default togglableSlice.reducer;