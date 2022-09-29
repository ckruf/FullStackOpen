import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
import togglableReducer from "./reducers/togglableReducer";
import userReducer from "./reducers/userReducer";
import errorMsgReducer from "./reducers/errorMsgReducer";

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogsReducer,
        togglable: togglableReducer,
        user: userReducer,
        errormessage: errorMsgReducer
    }
})

export default store;