import { useState } from "react"

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
  
)

const App = () => {
  
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const[selected, setSelected] = useState(0)

  const[votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const[topVoteCount, setTopVoteCount] = useState(0)

  const[topVoteIndex, setTopVoteIndex] = useState(0)

  // min and max must be integers for this to return an integer
  const generateRandomInt = (min, max) => Math.floor(Math.random() * (max-min) + min)

  const setRandom = (min, max, valueSetter) => () => valueSetter(generateRandomInt(min, max))

  const setArrayValue = (index, value, array, arraySetter) => {
    const copy = [...array]
    copy[index] = value
    arraySetter(copy)
  }

  const findIndexMax = (array) => {
    let currentMax = 0
    let maxIndex = 0
    for (let i = 0; i < array.length; i++) {
      if (array[i] > currentMax) {
        currentMax = array[i]
        maxIndex = i
      }
    }
    return maxIndex
  }

  const voteHandler = (index, value, array, arraySetter) => () => {
    setArrayValue(index, value, array, arraySetter)
    if (value > topVoteCount) {
      setTopVoteCount(value)
      setTopVoteIndex(index)
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
        {anecdotes[selected]}
      </p>
      <p>
        has {votes[selected]} votes
      </p>
      <div>
        <Button text="next anecdote" handleClick={setRandom(0, anecdotes.length, setSelected)} />
        <Button text="vote" handleClick={voteHandler(selected, votes[selected] + 1, votes, setVotes)} />
      </div>
      <h1>Anecdote with most votes</h1>
      <div>
        <p>{anecdotes[topVoteIndex]}</p>
        <p>has {topVoteCount} votes</p>
      </div>
    </div>
  );
}

export default App;
