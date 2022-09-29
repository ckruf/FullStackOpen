import { useSelector } from "react-redux";

const ErrorMsg = () => {
  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const message = useSelector(state => {
    if (state.errormessage && state.errormessage.message) {
      return state.errormessage.message;
    } else {
      return null;
    }
  })

  if (message === null) {
    return null;
  }

  return (
    <div className="error" style={errorStyle}>
      {message}
    </div>
  );
};

export default ErrorMsg;
