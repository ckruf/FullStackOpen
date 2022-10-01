import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blog";
import { setNotification } from "./notificationReducer";

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
      return state.filter((blog) => blog.id !== id);
    },
    likeBlog(state, action) {
      const id = action.payload.id;
      const likeCount = action.payload.newLikeCount;
      return state.map((blog) => {
        if (blog.id === id) {
          return { ...blog, likes: likeCount };
        } else {
          return blog;
        }
      });
    },
    commentBlog(state, action) {
      const blogId = action.payload.blogId;
      const newComment = action.payload.newComment;
      const blog = state.find(blog => blog.id === blogId);
      blog.comments.push(newComment);
    }
  },
});

export const { appendBlog, setBlogs, removeBlog, likeBlog, commentBlog } = blogSlice.actions;

export const handleBlogLike = (id, newLikeCount) => {
  return async (dispatch) => {
    try {
      await blogService.updateLikes(id, newLikeCount);
      dispatch(likeBlog({ id, newLikeCount }));
    } catch (error) {
      console.error("Got an error while liking blog");
      console.error(error);
      dispatch(setNotification("Liking blog failed", "error", 8));
    }
    
  };
};

export const addBlog = (newBlog, user) => {
  return async (dispatch) => {
    try {
      const response = await blogService.addNew(newBlog);
      response.user = {
        username: user.username,
        name: user.name,
      };
      dispatch(appendBlog(response));
    } catch (error) {
      console.error("Got an error while posting blog");
      console.error(error);
      dispatch(setNotification("Adding blog failed", "error", 8));
    }
    
  };
};

export const handleBlogRemove = (id, author, title) => {
  return async (dispatch) => {
    try {
      if (window.confirm(`Remove blog ${author} - ${title}?`)){
        await blogService.deleteById(id);
        dispatch(removeBlog(id));
      }
    } catch (error) {
      console.error("Got an error while removing blog");
      console.error(error);
      dispatch(setNotification("Removing blog failed", "error", 8));
    }
  };
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (error) {
      console.error("Got an error while fetching blogs");
      console.error(error);
      dispatch(setNotification("Fetching blogs failed", "error", 8));
    }
    
  };
};

export const handleBlogComment = (blogId, commentText) => {
  return async (dispatch) => {
    try {
      const responseData = await blogService.addComment(blogId, commentText);
      const newComment = responseData.newComment;
      const newStateData = { blogId, newComment };
      dispatch(commentBlog(newStateData));
    } catch (error) {
      console.error("Got an error while commenting blog");
      console.error(error);
      dispatch(setNotification("Commenting blog failed", "error", 8));
    }
    
  }
}

export default blogSlice.reducer;
