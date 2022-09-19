import { useState } from "react";
import PropTypes from "prop-types";

const SingleBlog = ({ blog, user, likeBtnHandler, removeBtnHandler }) => {
    const [showComplete, setShowComplete] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5
    };

    return (
        <article className="singleBlog" id={blog.id} style={blogStyle}>
            <div className="basicInfo">
                {blog.author} - {blog.title}
                <button className="expandBtn" onClick={() => {setShowComplete(!showComplete)}}>
                    {showComplete ? "hide" : "view"}
                </button>
            </div>

            {showComplete ?
                (   <div className="extendedInfo">
                        <div className="blogLink">
                            <a href={blog.url}>{blog.url}</a>
                        </div>
                        <div className="blogLikes">
                            likes <span className="likeCount">{blog.likes}</span>
                            <button className="likeBtn" onClick={likeBtnHandler(blog.id, blog.likes + 1)}>
                                like
                            </button>
                        </div>
                        <div className="blogPoster">
                            posted by: {blog.user.name}
                        </div>
                    </div>
                )
                : null
            }

            {showComplete && user.username === blog.user.username ?
                (
                    <div className="blogRemover">
                        <button className="removeBtn" onClick={removeBtnHandler(blog.id, blog.author, blog.title)}>
                            remove
                        </button>
                    </div>
                )
                : null
            }
        </article>
    );
};

SingleBlog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    likeBtnHandler: PropTypes.func.isRequired,
    removeBtnHandler: PropTypes.func.isRequired
}

export default SingleBlog;