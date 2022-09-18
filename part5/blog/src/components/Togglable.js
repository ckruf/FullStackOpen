import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none": "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    useImperativeHandle(refs, () => {
        return {
            toggleVisibility
        };
    });

    return (
        <div>
            <div id="hiddenWhenVisible" style={hideWhenVisible}>
                <button id={props.showBtnId} onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div id="shownWhenVisible" style={showWhenVisible}>
                {props.children}
                <button id={props.hideBtnId} onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    showBtnId: PropTypes.string,
    hideBtnId: PropTypes.string
};

export default Togglable;