const ContactList = ({persons, searchQuery}) => (
    <ul>
        {persons.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(person => <li key={person.name}>{person.name} {person.number}</li>)}
    </ul>
)

export default ContactList;