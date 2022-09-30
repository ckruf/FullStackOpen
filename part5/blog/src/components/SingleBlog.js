import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { handleBlogLike, handleBlogRemove } from "../reducers/blogsReducer";

const SingleBlog = ({ blogId }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === blogId)
  );

  return (
    <div className="singleBlog" id={blog.id}>
      <h1>{blog.title} by {blog.author}</h1>
      <div className="blogLink">
            <a href={blog.url}>{blog.url}</a>
      </div>
      <div className="blogLikes">
          likes <span className="likeCount">{blog.likes}</span>
          <button
            className="likeBtn"
            onClick={() => dispatch(handleBlogLike(blog.id, blog.likes + 1))}
          >
            like
          </button>
      </div>
      <div className="blogPoster">posted by: {blog.user.name}</div>
      
      {
      user.username === blog.user.username ? (
        <div className="blogRemover">
          <button
            className="removeBtn"
            onClick={() =>
              dispatch(handleBlogRemove(blog.id, blog.author, blog.title))
            }
          >
            remove
          </button>
        </div>
      ) : null
      }
      
    </div>
  )
};

SingleBlog.propTypes = {
  blogId: PropTypes.string.isRequired,
};

export default SingleBlog;
