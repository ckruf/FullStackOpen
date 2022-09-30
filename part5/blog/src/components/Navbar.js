import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeUser } from "../reducers/userReducer";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const padding = {
    padding: 5,
  };

  return (
    <div>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">users</Link>
      <p>{user.username} is logged in</p>
      <button onClick={() => dispatch(removeUser())}>Logout</button>
    </div>
  );
};

export default Navbar;
