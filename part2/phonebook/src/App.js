import { useState, useEffect } from "react";
import Input from "./components/Input";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setNewSearchQuery] = useState('')

  const get_persons_hook = () => {
    console.log("effect")
    axios
    .get("http://localhost:3001/persons")
    .then(response => {
      console.log("promise fulfilled")
      setPersons(response.data)
    })
  }

  useEffect(get_persons_hook, [])

  const addContact = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const InputStateSetter = (setter) => (event) => setter(event.target.value)
  
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <Input value={searchQuery} onChangeHandler={InputStateSetter(setNewSearchQuery)} />
      </div>
      <h2>add a new</h2>
      <ContactForm onSubmit={addContact} nameInputValue={newName} nameInputOnChange={InputStateSetter(setNewName)}
      numberInputValue={newNumber} numberInputOnChange={InputStateSetter(setNewNumber)} />
      <h2>Numbers</h2>
      <ContactList persons={persons} searchQuery={searchQuery} />
    </div>
  );
}

export default App;
