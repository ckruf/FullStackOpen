import {useState, useEffect} from 'react'
import axios from 'axios'
import Input from './components/Input'
import SearchResults from './components/searchResults'

const App = () => {

  const [countries, setCountries] = useState([])

  const [searchQuery, setNewSearchQuery] = useState('')

  const InputStateSetter = (setter) => (event) => setter(event.target.value)

  useEffect(() => {
    console.log("effect")

    if (searchQuery.length > 0)
    {
      axios
      .get(`https://restcountries.com/v3.1/name/${searchQuery}`)
      .then(response => {
        console.log("promise fulfilled")
        if (response.data instanceof Array) {
            setCountries(response.data)
          }
        }
      )
    }
    else {
      setCountries([])
    }
  
  }, [searchQuery])

  return (
    <div>
      <h1>countries</h1>
      <div>
        filter shown with <Input value={searchQuery} onChangeHandler={InputStateSetter(setNewSearchQuery)} />
      </div>
      <div>
        <SearchResults countries={countries} />
      </div>
    </div>
  );
}

export default App;
