import { createSlice } from "@reduxjs/toolkit";
import requestLogin from "../services/login";
import blogService from "../services/blog";

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        setUser(state, action) {
            const user = action.payload;
            return user;
        },
        removeUser(state, action) {
            window.localStorage.removeItem("loggedInUser");
            return null;
        },
        getUserFromLocalStorage(state, action) {
            const loggedUserJSONstring = window.localStorage.getItem("loggedInUser");
            if (loggedUserJSONstring) {
                const user = JSON.parse(loggedUserJSONstring);
                blogService.setToken(user.token);
                return user;
            } else {
                return null;
            }
        }
    }
})

export const { setUser, removeUser, getUserFromLocalStorage } = userSlice.actions;

export const loginUser = (username, password) => {
    // TODO add error handling (also for other actions)
    return async dispatch => {
        const user = await requestLogin({username, password});
        dispatch(setUser(user));
        blogService.setToken(user.token);
        window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    }
}

export default userSlice.reducer;