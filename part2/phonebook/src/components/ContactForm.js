import Input from "./Input"
import InputStateSetter from "../common"
import personService from "../services/persons"

const ContactForm = ({newName, newNumber, setNewName, setNewNumber, persons, setPersons, setNotificationMsg}) => {

    const addContact = (event) => {
        event.preventDefault()
        let potentiallyExisting = persons.find(person => person.name === newName)
        if (potentiallyExisting !== undefined) {
            console.log("Potentially existing = ", potentiallyExisting);
            if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
            const updatedPerson = {number: newNumber}
            personService
            .update(potentiallyExisting.id, updatedPerson)
            .then(responseData => {
                console.log("Response data = ", responseData);
                setPersons(persons.map(person => person.id !== potentiallyExisting.id ? person : responseData))
                setNewName('')
                setNewNumber('')
                setNotificationMsg(`${responseData.name}'s number has been changed`)
                setTimeout(() => {
                    setNotificationMsg(null)
                }, 5000)
            })
            .catch(error => {
                console.log("Got an error while updating person: ", error);
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
            setNotificationMsg(`${responseData.name} has been added to phonebook`)
            setTimeout(() => {
                setNotificationMsg(null)
            }, 5000)
            })
            .catch(error => {
            console.error(`Got an error while adding contact to server: ${error}`)
            })
        }
        }

    return(
    <form onSubmit={addContact} >
        <div>
            name: <Input value={newName} onChangeHandler={InputStateSetter(setNewName)} />
        </div>
        <div>
            number: <Input value={newNumber} onChangeHandler={InputStateSetter(setNewNumber)} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
    )
    }


export default ContactForm;