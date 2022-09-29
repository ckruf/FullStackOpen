import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
import togglableReducer from "./reducers/togglableReducer";
import userReducer from "./reducers/userReducer";

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogsReducer,
        togglable: togglableReducer,
        user: userReducer,
    }
})

export default store;