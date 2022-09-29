import { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "./Input";
import { InputStateSetter } from "../common";
import { loginUser } from "../reducers/userReducer";
import { setErrorMsg } from "../reducers/errorMsgReducer";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      dispatch(loginUser(username, password));
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Got an error while logging in:");
      console.error(error);
      if (error.response.data.error) {
        dispatch(setErrorMsg(error.response.data.error, 8));
      } else {
        dispatch(setErrorMsg("Login failed", 8));
      }
    }
  };
  return (
    <form onSubmit={handleLogin}>
      <div>
        username:{" "}
        <Input
          className="usernameInput"
          type="text"
          value={username}
          onChangeHandler={InputStateSetter(setUsername)}
        />
      </div>
      <div>
        password:{" "}
        <Input
          className="passwordInput"
          type="password"
          value={password}
          onChangeHandler={InputStateSetter(setPassword)}
        />
      </div>
      <div>
        <button className="loginButton" type="submit">
          login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
