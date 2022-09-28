import { useState } from "react";
import Input from "./Input";
import { InputStateSetter } from "../common";
import requestLogin from "../services/login";
import blogService from "../services/blog";

const LoginForm = ({ setUser, setErrorMsg }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await requestLogin({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Got an error while logging in:");
      console.error(error);
      if (error.response.data.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Login failed");
      }
      setTimeout(() => {
        setErrorMsg(null);
      }, 8000);
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
