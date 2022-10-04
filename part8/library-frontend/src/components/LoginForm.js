import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { LOGIN } from "../queries";

const LoginForm = (props) => {
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {

      console.error(JSON.stringify(error));

      if (error.graphQLErrors[0] && error.graphQLErrors[0].message) {
        props.setErrorMsg(error.graphQLErrors[0].message);
      } else {
        props.setErrorMsg("wrong credentials");
      }

      setTimeout(() => {
        props.setErrorMsg(null);
      }, 5000)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      props.setToken(token);
      localStorage.setItem("library-user-token", token);
      props.setPage("authors");
    }
  }, [result.data]) //eslint-disable-line

  if (!props.show) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    login({variables: { username, password }});
  }

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        
        <div>
          username
          <input type="text" onChange={({ target }) => setUsername(target.value)} />
        </div>

        <div>
          password
          <input type="password" onChange={({ target }) => setPassword(target.value)} />
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  )

}

export default LoginForm;