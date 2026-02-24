import {useState} from 'react'

import CountryInfo from '../services/CountryInfo'
import wmo_descriptions from '../services/WmoMapping'

const CountryStats = ({country,weather})=> (
  <>
    <h1>{country.name.common}</h1>
    <p>Capital {country.capital}</p>
    <p>Area {country.area}</p>

    <h2>Languages</h2>
    <ul>
      {Object.values(country.languages).map((lang,i)=><li key={i}>{lang}</li>)}
    </ul>
    <img style={{width:'250px',height:'auto'}} alt={country.flags.alt} src={country.flags.png}/>
    <h2>Weather in {country.capital}</h2>
    <img style={{width:'100px',height:'auto'}} alt={weather.wmo.description} src={weather.wmo.image}/>
    <p>{weather.wmo.description}</p>
    <p>Temperature {weather.temp} Celsius</p>
    <p>Wind {weather.windspeed} km/h</p>
  </>
)


const Countries = ({filteredCounteries,setFilteredCountries,weather,setWeather})=> {

  const showCountry = (country)=>{
    setFilteredCountries(filteredCounteries.filter(c=>c.name.common==country.name.common))
  }

  if (filteredCounteries.length>10){
    return (<p>Too many matches, specify another filter</p>)
  }

  if (filteredCounteries.length==1){
    const country=filteredCounteries[0]
    
    if (weather==null || country.latlng!=weather.latlng){
      CountryInfo.latLon(country.latlng)
      .then(response=>{
        let w = response.data.current_weather

        setWeather({latlng:country.latlng,temp:w.temperature,windspeed:w.windspeed,
          wmo: w.is_day ? wmo_descriptions[w.weathercode].day : wmo_descriptions[w.weathercode].night
        })
      })
    }
    
    if (weather==null){
      return null
    }
    return <CountryStats country={country} weather={weather} />
  }

  return (
    <>
      {filteredCounteries.map(country=>
        <div key={country.name.common}>
          {country.name.common} <button onClick={()=>showCountry(country)}>Show</button>
        </div>
      )}
    </>
  )
}

export default Countries