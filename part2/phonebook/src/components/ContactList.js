import personService from "../services/persons"

const ContactList = ({persons, searchQuery, setPersons, setErrorMsg}) => {
    const deleteBtnHandler = (id) => () => {
        let deletedPerson = persons.find(person => person.id === id)
        if (window.confirm(`Delete ${deletedPerson.name}?`)) {
            personService.deletePerson(id)
            .then(responseData => {
                console.log(`The following person was deleted: ${responseData}`)
                setPersons(persons.filter(person => person.id !== id))
            })
            .catch(error => {
                console.error(`Got an error while trying to delete contact: ${error}`)
                setErrorMsg(`Cannot delete ${deletedPerson.name} from phonebook, their information might have already been deleted`)
                setTimeout(() => {
                    setErrorMsg(null)
                }, 5000)
            })
        }
    }

    return (
    <ul>
        {persons
        .filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(person => 
        <li key={person.name}>{person.name} {person.number} <button onClick={deleteBtnHandler(person.id)}>Delete</button></li>
        )}
    </ul>
    )
}

export default ContactList;