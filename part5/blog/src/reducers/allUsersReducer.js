import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users"

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
    const users = await usersService.getAll();
    dispatch(setUsers(users));
  }
}

export default allUsersSlice.reducer;