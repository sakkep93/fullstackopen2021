import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
const Person = ({person}) => <li>{person.name} {person.number}</li>
const Persons = ({ persons }) => {
    return (
        <ul>
            {persons.map(p =>
                <Person key={p.name} person={p} />
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
        axios
        .get('http://localhost:3001/persons')
        .then(response => { setPersons(response.data) })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()
        const personObject = { name: newName, number: newNumber, }

        if (persons.some(e => e.name.toLowerCase() === newName.toLowerCase())) {
            window.alert(`${newName} is already added to phonebook`)
        } else {
            setPersons(persons.concat(personObject))
            setNewName('')
            setNewNumber('')
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
            <Persons persons={personsToShow} />
        </div>
  )

}

export default App
