import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
import togglableReducer from "./reducers/togglableReducer";

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogsReducer,
        togglable: togglableReducer
    }
})

export default store;