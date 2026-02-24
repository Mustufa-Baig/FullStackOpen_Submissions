import {useState,useEffect} from 'react'

import CountryInfo from './services/CountryInfo'
import Countries from './components/Countries'


const App = ()=> {
  const [searchCountry,setSearchCountry] = useState('')
  const [filteredCounteries,setFilteredCountries] = useState([])
  const [allCountries,setAllCountries] = useState([])
  const [weather,setWeather] = useState(null)

  const handleCountryName = (event) => {
    setSearchCountry(event.target.value)
    setFilteredCountries(allCountries.filter(country=> country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
  }
  

  useEffect(() => {
    if (!allCountries.length){
      console.log('Fetching Country data')

      CountryInfo.allCountriesInfo()
      .then(response => {
        console.log("Data fetched Successfully")
        setAllCountries(response.data)
      })
    }
  },[])


  return (
    <>
      <div>
        find countries <input value={searchCountry} onChange={handleCountryName}/>
        <Countries filteredCounteries={filteredCounteries} setFilteredCountries={setFilteredCountries} 
          weather={weather} setWeather={setWeather}/>
      </div>
    </>
  )
}

export default App