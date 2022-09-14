const LogoutElement = ({user, setUser}) => {

    const logoutBtnHandler = () => {
        setUser(null);
        window.localStorage.removeItem("loggedInUser");
    }
    
    return (
        <div>
            <p>{user.username} is logged in</p>
            <button onClick={logoutBtnHandler}>Logout</button>
        </div>
    )
}

export default LogoutElement;