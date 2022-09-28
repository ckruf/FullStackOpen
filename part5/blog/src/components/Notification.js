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

  const message = useSelector(state => {
    console.log("useSelector in Notification run, state is:")
    console.log(state);
    if (state.notification && state.notification.message){
      console.log("condition entered, state.notification.message is:");
      return state.notification.message
    } else {
      return null
    }
  })
  console.log("message is:");
  console.log(message);

  if (message === null) {
    return null;
  }

  return (
    <div className="successNotification" style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
