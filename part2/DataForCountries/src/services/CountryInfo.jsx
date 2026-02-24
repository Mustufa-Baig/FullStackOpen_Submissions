import axios from 'axios'

const latLon = (latlng) => {
	return axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latlng[0]}&longitude=${latlng[1]}&current_weather=true`)
}

const allCountriesInfo = () => {
	return axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
}

export default {latLon,allCountriesInfo}