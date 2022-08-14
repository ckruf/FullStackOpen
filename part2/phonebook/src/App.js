import { useState, useEffect } from "react";
import Input from "./components/Input";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import personService from "./services/persons"


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setNewSearchQuery] = useState('')

  const get_persons_hook = () => {
    personService
    .getAll()
    .then(personsData => setPersons(personsData))
    .catch(error => {
      console.log(`Got an error while fetching contacts: ${error}`)
    })
  }

  useEffect(get_persons_hook, [])

  const addContact = (event) => {
    event.preventDefault()
    let potentiallyExisting = persons.find(person => person.name === newName)
    if (potentiallyExisting != undefined) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {name: potentiallyExisting.name, number: newNumber}
        personService
        .update(potentiallyExisting.id, updatedPerson)
        .then(responseData => {
          setPersons(persons.map(person => person.id !== potentiallyExisting.id ? person : responseData))
          setNewName('')
          setNewNumber('')
        })
      }
      else {
        return
      }
    }

    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
  
      personService
      .create(personObject)
      .then(responseData => {
        setPersons(persons.concat(responseData))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error(`Got an error while adding contact to server: ${error}`)
      })
    }
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
      <ContactList persons={persons} searchQuery={searchQuery} setPersons={setPersons} />
    </div>
  );
}

export default App;
