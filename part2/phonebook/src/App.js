import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingUser = persons.find((person) => person.name === newName)

    if (existingUser) {
      const confirmed = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      )

      if (confirmed) {
        const updatedUser = { ...existingUser, number: newNumber }

        personService
          .update(existingUser.id, updatedUser)
          .then((response) => {
            setPersons((prevPersons) =>
              prevPersons.map((person) =>
                person.id === existingUser.id ? response : person
              )
            )
            setNewName('')
            setNewNumber('')
            setSuccessMessage(`${newName} was successfully added`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
          .catch((error) => {
            setErrorMessage('Error updating data: ' + error.message)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }

      personService
        .create(personObject)
        .then((response) => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`${newName} was added successfully `)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setErrorMessage('Error adding data: ' + error.message)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id)

    if (personToDelete) {
      const confirmed = window.confirm(`Delete ${personToDelete.name}?`)

      if (confirmed) {
        personService
          .remove(id)
          .then(() => {
            setErrorMessage(
              `${personToDelete.name} was successfully deleted`
            )
            setPersons(persons.filter((person) => person.id !== id))
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch((error) => {
            console.error('Error deleting data:', error)
          })
      }
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    setShowAll(false)
  }

  const personsToShow = showAll
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} success={false} />
    <Notification message={successMessage} success={true} />
      <Filter filter={newFilter} handleFilterChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={handleDelete} />
    </div>
  )
}

export default App