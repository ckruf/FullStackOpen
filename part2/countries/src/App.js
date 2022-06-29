import {useState, useEffect} from 'react'
import axios from 'axios'
import Input from './components/Input'
import SearchResults from './components/searchResults'

const App = () => {

  const [countries, setCountries] = useState([])

  const [searchQuery, setNewSearchQuery] = useState('')

  const [manuallySelectedCountry, setNewManualCountry] = useState({})

  const [isLoading, setIsLoading] = useState(false)

  const [isError, setIsError] = useState(false)

  const InputStateSetter = (setter) => (event) => setter(event.target.value)

  const onFocusHandler = (setNewManualCountry) => () => setNewManualCountry({})

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

  return (
    <div>
      <h1>countries</h1>
      <div>
        filter shown with <Input value={searchQuery} onChangeHandler={InputStateSetter(setNewSearchQuery)} onFocusHandler={onFocusHandler(setNewManualCountry)} />
      </div>
      <div>
        <SearchResults countries={countries} manuallySelectedCountry={manuallySelectedCountry} setNewManualCountry={setNewManualCountry} isLoading={isLoading} isError={isError}/>
      </div>
    </div>
  );
}

export default App;
