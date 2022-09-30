import { useSelector } from "react-redux";
import Togglable from "../components/Togglable";
import AddBlogForm from "../components/AddBlogForm";
import { Link } from "react-router-dom";


const IndexView = () => {
  const blogs = useSelector((state) => {
    const blogsCopy = [...state.blogs];
    return blogsCopy.sort((a, b) => b.likes - a.likes);
  });

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <>
      <Togglable
        buttonLabel="create new blog"
        showBtnId="createBlogBtn"
        hideBtnId="cancelCreateBlogBtn"
      >
        <AddBlogForm />
      </Togglable>

      <section id="blogs">
        {blogs.map((blog) => (
          <div key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
          </div>
        ))}
      </section>
    </>
  );
};

export default IndexView;
