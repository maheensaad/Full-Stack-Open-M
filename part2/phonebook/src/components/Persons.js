import React from 'react'

  const Person = ({ person, onDelete }) => {
    const handleDelete = () => {
      onDelete(person.id)
    }

  return (
    <div>
      {person.name} {person.number}{' '}
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons && persons.map((person) => (
        <Person key={person.id} person={person} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default Persons
