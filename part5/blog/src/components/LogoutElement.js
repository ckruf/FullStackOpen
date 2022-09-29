import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../reducers/userReducer";

const LogoutElement = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  return (
    <div>
      <p>{user.username} is logged in</p>
      <button onClick={() => dispatch(removeUser())}>Logout</button>
    </div>
  );
};

export default LogoutElement;
