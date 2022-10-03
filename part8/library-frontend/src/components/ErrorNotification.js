const ErrorNotification = (props) => {
  if (!props.errorMsg) {
    return null;
  }

  return (
    <div style={{color: "red"}}>
      {props.errorMsg}
    </div>
  )
}

export default ErrorNotification;