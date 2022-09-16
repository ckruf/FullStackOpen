import { useState, useEffect, useRef } from "react";
import LoginForm from "./components/LoginForm";
import AddBlogForm from "./components/AddBlogForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import ErrorMsg from "./components/ErrorMsg";
import LogoutElement from "./components/LogoutElement";
import Togglable from "./components/Togglable";
import blogService from "./services/blog";
import { isSorted } from "./common";

const App = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [blogs, setBlogs] = useState([]);


  const getBlogsHook = () => {

    const getBlogs = async () => {
        let blogs = await blogService.getAll();
        setBlogs(blogs);
    }

    try {
      getBlogs();
    } 
    catch (error) {
      console.error("Got error when fetching blogs ", error);
      setErrorMsg("Could not get blogs");
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000)
    }
  }

  useEffect(getBlogsHook, []);

  const getUserFromLocalStorageHook = () => {
    const loggedUserJSONstring = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSONstring) {
      const user = JSON.parse(loggedUserJSONstring);
      setUser(user);
      blogService.setToken(user.token);
    }
  }

  useEffect(getUserFromLocalStorageHook, []);

  // make sure blogs are sorted in descending order of likes
  const keepBlogsSortedHook = () => {
    if (!isSorted(blogs)) {
      const blogsSorted = [...blogs].sort((a, b) => b.likes - a.likes);
      setBlogs(blogsSorted);
    }
  }

  useEffect(keepBlogsSortedHook, [blogs]);

  const addBlog = async (newBlog) => {
    addBlogToggleRef.current.toggleVisibility();
    const addedBlog = await blogService.addNew(newBlog);
    addedBlog.user = {name: user.name, username: user.username};
    setBlogs(blogs.concat(addedBlog));
  }

  const addBlogToggleRef = useRef();

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notificationMsg} />
      <ErrorMsg message={errorMsg} />

      {user === null ? 
        <LoginForm 
        setUser={setUser}
        setErrorMsg={setErrorMsg}
        /> 
      :
        (
        <>
          <LogoutElement user={user} setUser={setUser} />
          <Togglable buttonLabel="create new blog" ref={addBlogToggleRef}>
            <AddBlogForm 
              setNotificationMsg={setNotificationMsg}
              setErrorMsg={setErrorMsg}
              addBlog={addBlog}
            />
          </Togglable>
          <BlogList blogs={blogs} setBlogs={setBlogs} user={user}/>
        </>
        )
    }
    </div>
  )
};

export default App;
