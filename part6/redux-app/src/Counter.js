import store from "./store";

const Counter = () => {
    const incrementHandler = () => {
        store.dispatch({type: "INCREMENT"});
        store.dispatch({type: "RECORD", value: store.getState().counter});
    };

    const decrementHandler = () => {
        store.dispatch({type: "DECREMENT"});
        store.dispatch({type: "RECORD", value: store.getState().counter});
    };

    const zeroHandler = () => {
        store.dispatch({type: "ZERO"});
        store.dispatch({type: "RECORD", value: store.getState().counter});
    };


    return (
        <div>
          <div>
              Count: {store.getState().counter}
          </div>
          <button onClick={incrementHandler}>
              plus
          </button>
  
          <button onClick={decrementHandler}>
              minus
          </button>
          <button onClick={zeroHandler} >
              zero
          </button>
        </div>
      );
}

export default Counter;