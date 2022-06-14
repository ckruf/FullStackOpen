import { useState } from "react";
import Input from "./components/Input";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setNewSearchQuery] = useState('')

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
