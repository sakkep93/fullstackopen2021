import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ handleChange, filterValue }) => <div> find countries <input value={filterValue} onChange={handleChange} /></div>

const Weather = ({ capital }) => {
    // Weather service
    const [ weather, setWeather ] = useState(null)
    useEffect(() => {
        const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY
        const weatherBaseUrl = 'http://api.weatherstack.com/current'
        const weatherUrl = `${weatherBaseUrl}?access_key=${weatherApiKey}&query=${capital}`
        axios
        .get(weatherUrl)
        .then(response => { setWeather(response.data) })
    }, [capital])

    if ( weather === null ) {
        return (
            <div><h4>Unable to get weather in {capital}.</h4></div>
        )
    }
    return (
        <div>
            <p><b>temperature:</b> {weather.current.temperature} Celcius </p>
            <img src={weather.current.weather_icons[0]} alt='weather icon' width="100" height="auto" />
            <p><b>wind:</b> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
        </div>
    )
}
const LanguageItem = ({ lang }) => <li>{lang.name}</li>
const Languages = ({ languages }) => {

    return (
        <ul>
            {languages.map(lang =>
                <LanguageItem key={lang.name} lang={lang} />
            )}
        </ul>
    )

}
const CountryInfo = ({ country }) => {

    return (
        <div>
            <h2>{country.name}</h2>
            <p>capital {country.capital}</p>
            <p>population {country.population}</p>

            <h3>Spoken languages</h3>
            <Languages languages={country.languages} />
            <img src={country.flag} alt={`${country.name} flag`} width="150" height="auto" />

            <h3>Weather in {country.capital}</h3>
            <Weather capital={country.capital} />
        </div>
    )

}

const CountryShowButton = ({ text, countryName, handleClick }) => <button onClick={handleClick(countryName)}> {text} </button>
const CountryListEntry = ({ countryName, handleCountryShowBtnOnClick }) => {
    return (
        <li>
            {countryName}
            <CountryShowButton
                text="show"
                countryName={countryName}
                handleClick={handleCountryShowBtnOnClick} />
        </li>
    )
}
const CountryList = ({ countries, handleCountryShowBtnOnClick }) => {
    return (
        <ul>
            {countries.map(c =>
                <CountryListEntry
                    key={c.alpha3Code}
                    countryName={c.name}
                    handleCountryShowBtnOnClick={handleCountryShowBtnOnClick} />
            )}
        </ul>
    )
}

const TooManyMatches = () => <p> Too many matches, specify another filter </p>

const PageContent = ({ countries, handleCountryShowBtnOnClick }) => {

    if ( countries.length === 1 ) {
        return ( <CountryInfo
                    country={countries[0]} />
                )
    } else if ( countries.length <= 10 && countries.length > 1) {
        return ( <CountryList
                    countries={countries}
                    handleCountryShowBtnOnClick={handleCountryShowBtnOnClick} />
                )
    } else {
        return ( <TooManyMatches />)
    }
}

const App = () => {

    // states
    const [ countries, setCountries ] = useState([])
    const [ countryFilter, setCountryFilter ] = useState('')

    // Countries data getter
    useEffect(() => {
        axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(response => { setCountries(response.data) })
    }, [])

    // filtering and capital changing
    const countriesToShow = countries.filter(c => c.name.toLowerCase().indexOf(countryFilter.toLowerCase()) !== -1)
    const handleFilterChange = (event) => setCountryFilter(event.target.value)
    const handleCountryShowBtnOnClick = (newFilterValue) => () => { setCountryFilter(newFilterValue) }

    return (
        <div>
            <Filter handleChange={handleFilterChange} filterValue={countryFilter} />
            <PageContent
                countries={countriesToShow}
                handleCountryShowBtnOnClick={handleCountryShowBtnOnClick} />
        </div>
  )

}

export default App
