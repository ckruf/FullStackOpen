import { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "./Input";
import { InputStateSetter } from "../common";
import { loginUser } from "../reducers/userReducer";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(loginUser(username, password));
    setUsername("");
    setPassword("");
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
