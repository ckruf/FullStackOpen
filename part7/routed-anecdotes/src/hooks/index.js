import { useState } from "react";

export const useField = (type) => {
    const [value, setValue] = useState("");

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const reset = () => {
        setValue("");
    }

    const exposed = {
        value,
        onChange,
        type,
    };

    // create property which is un-enumerable, so we can use spread syntax in 
    // input tag, otherwise console complains that we are adding 'reset' attribute
    // with value of a JS function into an HTML attribute.
    Object.defineProperty(exposed, "reset", {value: reset, enumerable: false})

    return exposed;
}