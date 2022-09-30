import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import IndexView from "./views/IndexView";
import UsersView from "./views/UsersView";
import { initializeBlogs } from "./reducers/blogsReducer";
import { getUserFromLocalStorage } from "./reducers/userReducer";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserFromLocalStorage());
  }, [dispatch]);

  // TODO consider wrapping entire "/" view into single component and then rendering that component
  // as the 'element' in the Route tag, rather than having all of the individual components,
  // it looks a bit messy
  return (
    <div>
      <h1>Blogs</h1>

      <Notification />

      {user === null ? (
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

          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
