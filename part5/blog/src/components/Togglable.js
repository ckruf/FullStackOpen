import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../reducers/togglableReducer";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, refs) => {
  const dispatch = useDispatch();
  const visible = useSelector(state => state.togglable);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  return (
    <div>
      <div id="hiddenWhenVisible" style={hideWhenVisible}>
        <button id={props.showBtnId} onClick={() => dispatch(toggle())}>
          {props.buttonLabel}
        </button>
      </div>
      <div id="shownWhenVisible" style={showWhenVisible}>
        {props.children}
        <button id={props.hideBtnId} onClick={() => dispatch(toggle())}>
          cancel
        </button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  showBtnId: PropTypes.string,
  hideBtnId: PropTypes.string,
};

export default Togglable;
