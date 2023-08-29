import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Search from './components/Search'
import CountryList from './components/CountryList'
import CountryInfo from './components/CountryInfo'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [querySpecific, setQuerySpecific] = useState(false)

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const handleSearch = (query) => {
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCountries(filtered)
    setSelectedCountry(null)

    if (filtered.length > 10) {
      setQuerySpecific(true)
    } else {
      setQuerySpecific(false)
    }
  }

  const handleCountryClick = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <h2>Country Information</h2>
      <Search onSearch={handleSearch} />
      {querySpecific ? ( <p>Too many matches, please be more specific.</p>) : 
      (
        <>
          <CountryList countries={filteredCountries} onCountryClick={handleCountryClick} />
          <CountryInfo country={selectedCountry} />
        </>
      )}
    </div>
  )
}

export default App
