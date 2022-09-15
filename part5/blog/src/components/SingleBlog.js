import { useState } from "react";
import blogService from "../services/blog";

const SingleBlog = ({blog, blogs, setBlogs}) => {
    const [showComplete, setShowComplete] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
      };

      const likeBtnHandler = (id, newLikeCount) => async () => {
        await blogService.updateLikes(id, newLikeCount);
        setBlogs(blogs.map(blog => {
            if (blog.id === id) {
                return {...blog, likes: newLikeCount};
            }
            else {
                return blog;
            }
        }));
      }

    return (
        <article key={blog.id} style={blogStyle}>
            <div>
                {blog.author} - {blog.title}
                <button onClick={() => {setShowComplete(!showComplete)}}>
                    {showComplete ? "hide" : "view"}
                </button>
            </div>

            {showComplete ? 
                (   <>
                        <div>
                            <a href={blog.url}>{blog.url}</a>
                        </div>
                        <div>
                            likes {blog.likes}
                            <button onClick={likeBtnHandler(blog.id, blog.likes + 1)}>
                                like
                            </button>
                        </div>
                        <div>
                            posted by: {blog.user.name}
                        </div>
                    </>
                )
                : null
            }
        </article>
    )
}

export default SingleBlog;