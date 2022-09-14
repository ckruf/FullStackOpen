import Input from "./Input";
import InputStateSetter from "../common";
import requestLogin from "../services/login";
import blogService from "../services/blog";

const LoginForm = ({username, password, setUsername, setPassword, setUser, setErrorMsg}) => {
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await requestLogin({username, password});
            setUser(user);
            blogService.setToken(user.token);
            window.localStorage.setItem("loggedInUser", JSON.stringify(user));
            setUsername("");
            setPassword("");
        }
        catch (error) {
            console.error("Got an error while logging in:");
            console.error(error);
            if (error.response.data.error) {
                setErrorMsg(error.response.data.error);
            }
            else {
                setErrorMsg("Login failed");
            }
            setTimeout(() => {
                setErrorMsg(null)
            }, 8000);
        }
    }
    return (
        <form onSubmit={handleLogin}>
            <div>
                username: <Input type="text" value={username} onChangeHandler={InputStateSetter(setUsername)} />
            </div>
            <div>
                password: <Input type="password" value={password} onChangeHandler={InputStateSetter(setPassword)} />
            </div>
            <div>
                <button type="submit">login</button>
            </div>
        </form>
    )
}

export default LoginForm;