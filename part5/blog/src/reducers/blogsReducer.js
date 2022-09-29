import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import blogService from "../services/blog";

const blogSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        appendBlog(state, action) {
            const blog = action.payload;
            return state.concat(blog);
        },
        setBlogs(state, action) {
            const blogs = action.payload;
            return blogs;
        },
        removeBlog(state, action) {
            const id = action.payload;
            return state.filter(blog => blog.id !== id);
        },
        likeBlog(state, action) {
            const id = action.payload.id;
            const likeCount = action.payload.newLikeCount
            return state.map(blog => {
                if (blog.id === id) {
                    return {...blog, likes: likeCount}
                } else {
                    return blog;
                }
            });
        }
    }
})

export const { appendBlog, setBlogs, removeBlog, likeBlog } = blogSlice.actions;

export const handleBlogLike = (id, newLikeCount) => {
    return async dispatch => {
        await blogService.updateLikes(id, newLikeCount);
        dispatch(likeBlog({id, newLikeCount}));
    }
}

export const addBlog = (newBlog, user) => {
    // TODO - user must be added manually to the blog which is added when adding into
    // state/redux store. On the server side this is added automatically via token,
    return async dispatch => {
        const response = await blogService.addNew(newBlog);
        response.user = { 
            username: user.username,
            name: user.name
        }
        dispatch(appendBlog(response));
    }
}

export const handleBlogRemove = (id, author, title) => {
    return async dispatch => {
        if (window.confirm(`Remove blog ${author} - ${title}?`))
        await blogService.deleteById(id);
        dispatch(removeBlog(id));
    }
}

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    }
}

export default blogSlice.reducer;