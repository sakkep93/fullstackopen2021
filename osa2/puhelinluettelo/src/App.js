import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message, messageType }) => {
    if (message === null) return null

    const color = messageType === 'success' ? 'green' : 'red';
    const style = {
        color: color,
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    return (
        <div style={style}> {message} </div>
    )
}
const Filter = ({ handleChange, filterValue }) => <div> filter shown with <input value={filterValue} onChange={handleChange} /></div>
const PersonForm = (props) => {

    const { onSubmit, onNameChange, onNumberChange, newName, newNumber } = props

    return (
        <form onSubmit={onSubmit}>
            <div> name: <input value={newName} onChange={onNameChange} /> </div>
            <div> number: <input value={newNumber} onChange={onNumberChange} /></div>
            <div><button type="submit">add</button></div>
        </form>
    )

}
const Person = ({person, deletePerson}) => {
    return (
        <li>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
        </li>
    )
}
const Persons = ({ persons, deletePerson }) => {
    return (
        <ul>
            {persons.map(p =>
                <Person
                    key={p.name}
                    person={p}
                    deletePerson={deletePerson} />
            )}
        </ul>
    )
}

const App = () => {
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ newFilter, setNewFilter ] = useState('')
    const [ notificationMessage, setNotificationMessage] = useState(null)
    const [ notificationType, setNotificationType] = useState('')

    useEffect(() => {
        personService
            .getPersons()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    const updatePerson = (name, number) => {
        const person = persons.find(p => p.name === name)
        const changedPerson = { ...person, number: number}
        personService
            .updatePerson(person.id, changedPerson)
            .then(returnedPerson => {
                setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
                setNewName('')
                setNewNumber('')
                const msg = `Updated ${name}'s phonenumber from ${person.number} to ${number}`
                notify(msg, 'success')
        })
        .catch(error => {
            const msg = `Information of ${name} has already been removed from server`
            notify(msg, 'error')
            setPersons(persons.filter(p => p.id !== person.id))
        })
    }
    const addPerson = (event) => {
        event.preventDefault()
        const personObject = { name: newName, number: newNumber, }

        if (persons.some(e => e.name.toLowerCase() === newName.toLowerCase())) {
            const message = `${newName} is already added to phonebook, replace the old number with a new one?`
            if (window.confirm(message)) {
                updatePerson(newName, newNumber)
            }
        } else {
            personService
                .createPerson(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    notify(`Added ${returnedPerson.name}`, 'success')
            })
            .catch(error => {
                notify(error.response.data.error, 'error')
            })
        }
    }
    const deletePerson = (id, name) => {
        if (window.confirm(`Delete ${name} ?`)) {
            personService
                .deletePerson(id)
                .then(deleted => {
                    setPersons(persons.filter(p => p.id !== id))
                    notify(`Deleted ${name}`, 'success')
            })
        }
    }

    const personsToShow = persons.filter(p => p.name.toLowerCase().startsWith(newFilter.toLowerCase()))
    const handleFilterChange = (event) => setNewFilter(event.target.value)
    const handleNameChange = (event) => setNewName(event.target.value)
    const handleNumberChange = (event) => setNewNumber(event.target.value)

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    const notify = (msg, type) => {
        setNotificationType(type)
        setNotificationMessage(msg)
        sleep(4000).then(() => {setNotificationMessage(null)})
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification
                message={notificationMessage}
                messageType={notificationType} />
            <Filter handleChange={handleFilterChange} filterValue={newFilter} />

            <h3>Add a new</h3>
            <PersonForm
                onSubmit={addPerson}
                onNameChange={handleNameChange}
                onNumberChange={handleNumberChange}
                newName={newName}
                newNumber={newNumber} />

            <h3>Numbers</h3>
            <Persons
                persons={personsToShow}
                deletePerson={deletePerson} />
        </div>
  )

}

export default App
