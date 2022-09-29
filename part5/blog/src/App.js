import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import AddBlogForm from "./components/AddBlogForm";
import SingleBlog from "./components/SingleBlog";
import Notification from "./components/Notification";
import ErrorMsg from "./components/ErrorMsg";
import LogoutElement from "./components/LogoutElement";
import Togglable from "./components/Togglable";
import { initializeBlogs  } from "./reducers/blogsReducer";
import { getUserFromLocalStorage } from "./reducers/userReducer";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(state => {
    const blogsCopy = [...state.blogs] ;
    return blogsCopy.sort((a, b) => b.likes- a.likes)
  });
  const user = useSelector(state => state.user)

  
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch]);


  useEffect(() => {
    dispatch(getUserFromLocalStorage())
  }, [dispatch]);

  return (
    <div>
      <h1>Blogs</h1>

      <Notification />
      <ErrorMsg />

      {user === null ? (
        <LoginForm />
      ) : (
        <>
          <LogoutElement />
          <Togglable
            buttonLabel="create new blog"
            showBtnId="createBlogBtn"
            hideBtnId="cancelCreateBlogBtn"
          >
            <AddBlogForm />
          </Togglable>
          <section id="blogs">
            {blogs.map((blog) => (
              <SingleBlog
                key={blog.id}
                blogId={blog.id}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default App;
