import {useState, useEffect} from 'react'
import axios from 'axios'
import Input from './components/Input'
import SearchResults from './components/searchResults'

const App = () => {

  const [countries, setCountries] = useState([])

  const [searchQuery, setNewSearchQuery] = useState('')

  const [manuallySelectedCountry, setNewSingleCountry] = useState({})

  const [isLoading, setIsLoading] = useState(false)

  const [isError, setIsError] = useState(false)

  const [weather, setWeather] = useState({})

  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  const [isErrorWeather, setIsErrorWeather] = useState(false)

  const InputStateSetter = (setter) => (event) => setter(event.target.value)

  const onFocusHandler = (setNewSingleCountry) => () => setNewSingleCountry({})


  useEffect(() => {
    console.log("effect")

    if (searchQuery.length > 0)
    {
      setIsLoading(true)
      setIsError(false)
      axios
      .get(`https://restcountries.com/v3.1/name/${searchQuery}`)
      .then(response => {
        if (response.status > 199 && response.status < 300) {
          setIsLoading(false)
          console.log("promise fulfilled")
          if (response.data instanceof Array) {
              setCountries(response.data)
            }
          }
        else {
          console.log("Error in fetching API")
          setIsError(true)
        }
      }

        
      ).catch(error => {
        console.log("Error in fetching API", error)
        setIsError(true)
      })
    }
    else {
      setCountries([])
    }
  
  }, [searchQuery])

  useEffect(() => {
    console.log("weatherEffect")
    if (countries.length === 1 || Object.keys(manuallySelectedCountry).length !== 0) {
      console.log("weatherEffect condition fulfilled")
      setIsLoadingWeather(true)
      setIsErrorWeather(false)
      let countryCapital = ""
      if (countries.length === 1) {
        let countryObject = countries[0]
        countryCapital = countryObject.capital[0]
      }
      else {
        countryCapital = manuallySelectedCountry.capital[0]
      }

      let url = `https://api.openweathermap.org/data/2.5/weather?q=${countryCapital}&appid=${process.env.REACT_APP_API_KEY}`
      console.log("fetching weather at", url)
      axios
      .get(url)
      .then(response => {
        if (response.status > 199 && response.status < 300) {
          setIsLoadingWeather(false)
          setWeather(response.data)
        }
        else {
          setIsLoadingWeather(false)
          setIsErrorWeather(true)
          console.log("error in fetching weatherAPI")
        }
      }).catch(error => {
        setIsLoadingWeather(false)
        setIsErrorWeather(true)
        console.log("error in fetching weather API")
      })
    }
  }, [countries, manuallySelectedCountry])

  return (
    <div>
      <h1>countries</h1>
      <div>
        filter shown with <Input value={searchQuery} onChangeHandler={InputStateSetter(setNewSearchQuery)} onFocusHandler={onFocusHandler(setNewSingleCountry)} />
      </div>
      <div>
        <SearchResults countries={countries} manuallySelectedCountry={manuallySelectedCountry} setNewSingleCountry={setNewSingleCountry}
        isLoading={isLoading} isError={isError} weather={weather} isLoadingWeather={isLoadingWeather} isErrorWeather={isErrorWeather} />
      </div>
    </div>
  );
}

export default App;
