import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useMatch } from "react-router-dom";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import IndexView from "./views/IndexView";
import UsersView from "./views/UsersView";
import { initializeBlogs } from "./reducers/blogsReducer";
import { getUserFromLocalStorage } from "./reducers/userReducer";
import SingleUserView from "./views/SingleUserView";
import SingleBlog from "./components/SingleBlog";

const App = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserFromLocalStorage());
  }, [dispatch]);

  const userMatch = useMatch("/users/:id");
  const blogMatch = useMatch("/blogs/:id");

  const selectedUserId = (userMatch && userMatch.params && userMatch.params.id) ? userMatch.params.id : null;
  const selectedBlogId = (blogMatch && blogMatch.params && blogMatch.params.id) ? blogMatch.params.id : null;

  // TODO consider wrapping entire "/" view into single component and then rendering that component
  // as the 'element' in the Route tag, rather than having all of the individual components,
  // it looks a bit messy
  return (
    <div>
      <h1>Blogs</h1>

      <Notification />

      {loggedUser === null ? (
        <LoginForm />
      ) : (
        <>
          <Navbar />

          <Routes>

            <Route
              path="/"
              element={<IndexView />}
            >
            </Route>

            <Route
              path="/users"
              element={<UsersView />}
            >
            </Route>

            <Route
              path="/users/:id"
              element={<SingleUserView userId={selectedUserId} />}
            >
            </Route>

            <Route
              path="/blogs/:id"
              element={<SingleBlog blogId={selectedBlogId} />}
            >
            </Route>

          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
