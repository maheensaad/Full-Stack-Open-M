import React from 'react'

const CountryList = ({ countries, onCountryClick }) => {
  if (countries.length === 0) {
    return <p>No countries found.</p>
  }

  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <p>{country.name.common}</p>
        <button onClick={() => onCountryClick(country)}>Show</button>
      </div>
    )
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.cca2}>
          {country.name.common}{' '}
          <button onClick={() => onCountryClick(country)}>Show</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
