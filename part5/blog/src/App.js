import {useState, useEffect} from "react";
import LoginForm from "./components/LoginForm";
import AddBlogForm from "./components/AddBlogForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import ErrorMsg from "./components/ErrorMsg";
import LogoutElement from "./components/LogoutElement";
import blogService from "./services/blog";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const getBlogsHook = () => {
    try {
      let blogs = blogService.getAll();
      setBlogs(blogs);
    } catch (error) {
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

  // TODO consider adding user into array in second argument
  useEffect(getUserFromLocalStorageHook, []);



  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notificationMsg} />
      <ErrorMsg message={errorMsg} />

      {user === null ? 
        <LoginForm 
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        setUser={setUser}
        setErrorMsg={setErrorMsg}
        /> 
      :
        (
        <>
          <LogoutElement user={user} setUser={setUser} />
          <AddBlogForm 
          newBlogTitle={newBlogTitle}
          newBlogAuthor={newBlogAuthor}
          newBlogUrl={newBlogUrl}
          blogs={blogs}
          setNewBlogAuthor={setNewBlogAuthor}
          setNewBlogTitle={setNewBlogTitle}
          setNewBlogUrl={setNewBlogUrl}
          setBlogs={setBlogs}
          setNotificationMsg={setNotificationMsg}
          setErrorMsg={setErrorMsg}
          />
          <BlogList blogs={blogs}/>
        </>
        )
    }
    </div>
  )
};

export default App;
