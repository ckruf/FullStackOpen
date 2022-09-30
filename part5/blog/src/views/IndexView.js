import { useSelector } from "react-redux";
import Togglable from "../components/Togglable";
import AddBlogForm from "../components/AddBlogForm";
import SingleBlog from "../components/SingleBlog";

const IndexView = () => {
  const blogs = useSelector((state) => {
    const blogsCopy = [...state.blogs];
    return blogsCopy.sort((a, b) => b.likes - a.likes);
  });

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
          <SingleBlog key={blog.id} blogId={blog.id} />
        ))}
      </section>
    </>
  );
};

export default IndexView;
