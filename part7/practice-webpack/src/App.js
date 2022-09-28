import React, { useState } from "react";

const App = () => {
    const [counter, setCounter] = useState(0);
    const [values, setValues] = useState([]);

    const handleClick = () => {
        setCounter(counter + 1);
        setValues(values.concat(counter));
    }

    return (
        <div className="container">
            hello webpack {counter} clicks
            <button onClick={handleClick}>
                press
            </button>
            <button onClick={() => setCounter(0)}>
                reset
            </button>
            <p>counter history: {values}</p>
        </div>
    )
  }
  
  export default App