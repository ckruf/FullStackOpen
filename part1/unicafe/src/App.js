import { useState } from "react"

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
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToValue = (newValue, valueSetter) => () => valueSetter(newValue)

  return(
    <>
    <h1>give feedback</h1>
      <Button text="good" handleClick={setToValue(good + 1, setGood)} />
      <Button text="netural" handleClick={setToValue(neutral + 1, setNeutral)} />
      <Button text="bad" handleClick={setToValue(bad + 1, setBad)} />
    <h1>statistics</h1>
    <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
};

export default App
