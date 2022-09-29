import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { handleBlogLike, handleBlogRemove } from "../reducers/blogsReducer";

const SingleBlog = ({ blogId }) => {
  const [showComplete, setShowComplete] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const blog = useSelector(state => state.blogs.find(blog => blog.id === blogId)); 

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <article className="singleBlog" id={blog.id} style={blogStyle}>
      <div className="basicInfo">
        {blog.author} - {blog.title}
        <button
          className="expandBtn"
          onClick={() => {
            setShowComplete(!showComplete);
          }}
        >
          {showComplete ? "hide" : "view"}
        </button>
      </div>

      {showComplete ? (
        <div className="extendedInfo">
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
        </div>
      ) : null}

      {showComplete && user.username === blog.user.username ? (
        <div className="blogRemover">
          <button
            className="removeBtn"
            onClick={() => dispatch(handleBlogRemove(blog.id, blog.author, blog.title))}
          >
            remove
          </button>
        </div>
      ) : null}
    </article>
  );
};

SingleBlog.propTypes = {
  blogId: PropTypes.string.isRequired,
};

export default SingleBlog;
