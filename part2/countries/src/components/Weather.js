import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {

    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`

    axios
      .get(apiUrl)
      .then((response) => {
        setWeatherData(response.data)
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error)
      })
  }, [capital])

  if (!weatherData) {
    return <p>Loading weather data...</p>
  }

const iconCode = weatherData.weather[0].icon
const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature {weatherData.main.temp}°C</p>
      <img src={iconUrl} alt="Weather Icon" />
      <p>Wind Speed {weatherData.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
