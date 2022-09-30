import { useSelector } from "react-redux";

const Notification = () => {
  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const message = useSelector((state) => {
    if (state.notification && state.notification.message) {
      return state.notification.message;
    } else {
      return null;
    }
  });

  const type = useSelector((state) => {
    if (state.notification && state.notification.type) {
      return state.notification.type;
    } else {
      return null;
    }
  });

  if (message === null) {
    return null;
  }

  return (
    <div
      className="successNotification"
      style={type === "error" ? errorStyle : notificationStyle}
    >
      {message}
    </div>
  );
};

export default Notification;
