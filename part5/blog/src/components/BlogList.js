import SingleBlog from "./SingleBlog";

const BlogList = ({blogs, setBlogs}) => {
    return (
        blogs.map(blog => <SingleBlog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} />)
    )
}

export default BlogList;