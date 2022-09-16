import { useState } from "react";
import blogService from "../services/blog";

const SingleBlog = ({blog, blogs, setBlogs, user}) => {
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

      const removeBtnHandler = (id, author, title) => async () => {
        if (window.confirm(`Remove blog ${author} - ${title}?`)) {
            await blogService.deleteById(id);
            setBlogs(blogs.filter(blog => (blog.id !== id)));
        }
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

            {showComplete && user.username === blog.user.username ?
                (
                    <div>
                        <button onClick={removeBtnHandler(blog.id, blog.author, blog.title)}>
                            remove
                        </button>
                    </div>
                )
                : null
            }
        </article>
    )
}

export default SingleBlog;