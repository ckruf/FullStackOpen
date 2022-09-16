import SingleBlog from "./SingleBlog";

const BlogList = ({blogs, setBlogs, user}) => {
    return (
        blogs.map(blog => <SingleBlog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} user={user} />)
    )
}

export default BlogList;