const Button = ({id, onClickHandler, buttonText}) => {
    return (
        <button key={id} onClick={onClickHandler}>{buttonText}</button>
    )
}

export default Button