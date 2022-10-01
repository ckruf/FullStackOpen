import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";
import { setNotification } from "./notificationReducer";

const allUsersSlice = createSlice({
    name: "allUsers",
    initialState: [],
    reducers: {
        setUsers(state, action) {
            const users = action.payload;
            return users;
        }
    }
});

export const { setUsers } = allUsersSlice.actions;

export const initializeUsers = () => {
  return async dispatch => {
    try {
      const users = await usersService.getAll();
      dispatch(setUsers(users));
    } catch (error) {
      console.error("Got an error while fetching users");
      console.error(error);
      dispatch(setNotification(error.response.data.error, "error", 8));
    }
    
  }
}

export default allUsersSlice.reducer;