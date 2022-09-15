import SingleBlog from "./SingleBlog";

const BlogList = ({blogs}) => {
    return (
        blogs.map(blog => <SingleBlog key={blog.id} blog={blog} />)
    )
}

export default BlogList;