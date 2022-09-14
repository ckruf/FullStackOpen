const BlogList = ({blogs}) => {
    return (
        <ul>
            {blogs.map(blog => <li key={blog.id}>{blog.author} - <a href={blog.url}>{blog.title}</a></li>)}
        </ul>
    )
}

export default BlogList;