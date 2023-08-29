import React, { useState } from 'react'

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleChange = (event) => {
    setQuery(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for a country"
        value={query}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default Search
