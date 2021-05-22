import React, { useState, useEffect } from 'react'
import personService from './services/persons'

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
    const [persons, setPersons] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ newFilter, setNewFilter ] = useState('')

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
            })
        }
    }

    const deletePerson = (id, name) => {
        if (window.confirm(`Delete ${name} ?`)) {
            personService
                .deletePerson(id)
                .then(deleted => {
                    setPersons(persons.filter(p => p.id !== id))
            })
        }
    }

    const personsToShow = persons.filter(p => p.name.toLowerCase().startsWith(newFilter.toLowerCase()))
    const handleFilterChange = (event) => setNewFilter(event.target.value)
    const handleNameChange = (event) => setNewName(event.target.value)
    const handleNumberChange = (event) => setNewNumber(event.target.value)

    return (
        <div>
            <h2>Phonebook</h2>
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
