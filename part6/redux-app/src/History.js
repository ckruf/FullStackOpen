import store from "./store";

const History = () => {
    return (
        <div>
          <div>
              History: {store.getState().history}
          </div>
          <button onClick={e => store.dispatch({type: "CLEAR"})}>
              clear
          </button>
        </div>
      );
}

export default History;