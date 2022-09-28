import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import AddBlogForm from "./components/AddBlogForm";
import SingleBlog from "./components/SingleBlog";
import Notification from "./components/Notification";
import ErrorMsg from "./components/ErrorMsg";
import LogoutElement from "./components/LogoutElement";
import Togglable from "./components/Togglable";
import blogService from "./services/blog";
import { handleBlogLike, addBlog, handleBlogRemove, initializeBlogs  } from "./reducers/blogsReducer";

const App = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs.sort((a, b) => b.likes- a.likes));

  // TODO
  useEffect(dispatch(initializeBlogs()), [dispatch]);

  const getUserFromLocalStorageHook = () => {
    const loggedUserJSONstring = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSONstring) {
      const user = JSON.parse(loggedUserJSONstring);
      setUser(user);
      blogService.setToken(user.token);
    }
  };

  useEffect(getUserFromLocalStorageHook, []);

  const likeBtnHandler = (id, newLikeCount) => async () => {
    await blogService.updateLikes(id, newLikeCount);
    setBlogs(
      blogs.map((blog) => {
        if (blog.id === id) {
          return { ...blog, likes: newLikeCount };
        } else {
          return blog;
        }
      })
    );
  };

  const removeBtnHandler = (id, author, title) => async () => {
    if (window.confirm(`Remove blog ${author} - ${title}?`)) {
      await blogService.deleteById(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  return (
    <div>
      <h1>Blogs</h1>

      <Notification />
      <ErrorMsg message={errorMsg} />

      {user === null ? (
        <LoginForm setUser={setUser} setErrorMsg={setErrorMsg} />
      ) : (
        <>
          <LogoutElement user={user} setUser={setUser} />
          <Togglable
            buttonLabel="create new blog"
            ref={addBlogToggleRef}
            showBtnId="createBlogBtn"
            hideBtnId="cancelCreateBlogBtn"
          >
            <AddBlogForm
              setErrorMsg={setErrorMsg}
            />
          </Togglable>
          <section id="blogs">
            {blogs.map((blog) => (
              <SingleBlog
                key={blog.id}
                blog={blog}
                user={user}
                likeBtnHandler={likeBtnHandler}
                removeBtnHandler={removeBtnHandler}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default App;
