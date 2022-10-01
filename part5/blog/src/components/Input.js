import PropTypes from "prop-types";

const Input = ({ className, type, value, onChangeHandler }) => {
  return (
    <input
      className={className}
      type={type}
      value={value}
      onChange={onChangeHandler}
    />
  )
  
};

Input.propTypes = {
  className: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
};

export default Input;
