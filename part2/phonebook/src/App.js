import { useState, useEffect } from "react";
import Input from "./components/Input";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import personService from "./services/persons"
import InputStateSetter from "./common";


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
  
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <Input value={searchQuery} onChangeHandler={InputStateSetter(setNewSearchQuery)} />
      </div>
      <h2>add a new</h2>
      <ContactForm newName={newName} newNumber={newNumber}
      setNewName={setNewName} setNewNumber={setNewNumber} persons={persons} setPersons={setPersons}/>
      <h2>Numbers</h2>
      <ContactList persons={persons} searchQuery={searchQuery} setPersons={setPersons} />
    </div>
  );
}

export default App;
