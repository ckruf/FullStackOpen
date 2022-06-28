import axios from 'axios'
import {useState, useEffect} from 'react'

const App = () => {
  const[notes, setNotes] = useState([])

  const hook = () => {
    console.log("effect")
    axios
    .get("http://localhost:3001/notes")
    .then(response => {
      console.log("promise fulfilled")
      setNotes(response.data)
    })
    console.log("Will this print first?")
  }
  
  // effect is executed immediately after rendering
  useEffect(hook, [])
  console.log("render", notes.length, "notes")

  return (
    <div>
      <h1>Notes</h1>
      <ul>
      {notes.map(note =>
        <li key={note.id}>
          {note.content}
        </li>
        )}
      </ul>
    </div>
  );
}

export default App;

