import { useState } from "react"

const SingleBlog = ({blog}) => {
    const [showComplete, setShowComplete] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
      };

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
                        <div><a href={blog.url}>{blog.url}</a></div>
                        <div>likes {blog.likes}<button>like</button></div>
                        <div>posted by: {blog.user.name}</div>
                    </>
                )
                : null
            }
        </article>
    )
}

export default SingleBlog;