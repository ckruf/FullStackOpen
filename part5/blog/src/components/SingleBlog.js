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
        <article class="singleBlog" key={blog.id} style={blogStyle}>
            <div class="basicInfo">
                {blog.author} - {blog.title}
                <button class="expandBtn" onClick={() => {setShowComplete(!showComplete)}}>
                    {showComplete ? "hide" : "view"}
                </button>
            </div>

            {showComplete ?
                (   <div class="extendedInfo">
                        <div class="blogLink">
                            <a href={blog.url}>{blog.url}</a>
                        </div>
                        <div class="blogLikes">
                            likes {blog.likes}
                            <button class="likeBtn" onClick={likeBtnHandler(blog.id, blog.likes + 1)}>
                                like
                            </button>
                        </div>
                        <div class="blogPoster">
                            posted by: {blog.user.name}
                        </div>
                    </div>
                )
                : null
            }

            {showComplete && user.username === blog.user.username ?
                (
                    <div class="blogRemover">
                        <button class="removeBtn" onClick={removeBtnHandler(blog.id, blog.author, blog.title)}>
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