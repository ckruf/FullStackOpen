import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";
import feedbackReducer from "./feedbackReducer";

const store = createStore(feedbackReducer);

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticsLine = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad

  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <table>
      <tbody>
      <StatisticsLine text="good" value={good} />
      <StatisticsLine text="neutral" value={neutral} />
      <StatisticsLine text="bad" value={bad} />
      <StatisticsLine text="all" value={total} />
      <StatisticsLine text="average" value={(good - bad) / total} />
      <StatisticsLine text="positive" value={( (good / total ) * 100) + "%"}/>
      </tbody>
    </table>
  )
}

const App = () => {
  return(
    <>
    <h1>give feedback</h1>
      <Button text="good" handleClick={e => store.dispatch({type: "GOOD"})} />
      <Button text="neutral" handleClick={e => store.dispatch({type: "NEUTRAL"})} />
      <Button text="bad" handleClick={e => store.dispatch({type: "BAD"})} />
      <Button text="reset" handleClick={e => store.dispatch({type: "ZERO"})} />
    <h1>statistics</h1>
    <Statistics
        good={store.getState().good}
        neutral={store.getState().neutral}
        bad={store.getState().bad} 
    />
    </>
  )
};

console.log(document.getElementById("root"));
const root = ReactDOM.createRoot(document.getElementById("root"))
const renderApp = () => root.render(<App />);

renderApp();
store.subscribe(renderApp);
