import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { handleBlogLike, handleBlogRemove } from "../reducers/blogsReducer";
import CommentSection from "./CommentSection";

const SingleBlog = ({ blogId }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === blogId)
  );

  if (blog) {
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
  
        <CommentSection blogId={blogId} />
        
      </div>
    )
  }
  else {
    return (
      <h1>404 - blog not found :(</h1>
    )
  }
  
};

SingleBlog.propTypes = {
  blogId: PropTypes.string
};

export default SingleBlog;
