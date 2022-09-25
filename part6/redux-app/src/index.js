import React from 'react';
import ReactDOM from 'react-dom/client';

import { createStore } from "redux";

/*
Notes on redux:

- redux stores state in stores, which are created using the createStore method
(similar to react's useState)
- state is modified by sending (dispatching) actions to the store, and having a function,
called a reducer, which modifies state depending on the action
- below, we have our counterReducer, which modifies state based on the action we dispatch
to it. The three types of actions it knows to respond to are dispatched by event handlers
registered to the three buttons of the app.
- finally, there is the subscribe method of the store. This is used to create/register callback
functions that the store calls each time that its state is changed. The renderApp function
must be subscribed to the store, otherwise the App component will not re-render upon
changes in the store's state. This is in contrast to using React's built-in state,
which triggers re-renders automatically upon change
*/

const counterReducer = (state = 0, action) => {
    switch(action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        case "ZERO":
            return 0;
        default:
            return state;
    }
}

const store = createStore(counterReducer);

const App = () => {
    return (
      <div>
        <div>
            {store.getState()}
        </div>
        <button onClick={e => store.dispatch({type: "INCREMENT"})}>
            plus
        </button>

        <button onClick={e => store.dispatch({type: "DECREMENT"})}>
            minus
        </button>
        <button onClick={e => store.dispatch({type: "ZERO"})} >
            zero
        </button>
      </div>
    );
  }

const root = ReactDOM.createRoot(document.getElementById('root'))
const renderApp = () => root.render(<App />);

renderApp();
store.subscribe(renderApp);
store.subscribe(() => {
    console.log("State in store has changed:");
    console.log(store.getState());
})