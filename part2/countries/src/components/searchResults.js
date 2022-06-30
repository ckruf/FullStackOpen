import Button from "./Button"
import WeatherDisplay from "./WeatherDisplay"

const SearchResults = (props) => {
    const {
        countries,
        manuallySelectedCountry,
        setNewSingleCountry,
        isLoading,
        isError,
        weather,
        isLoadingWeather,
        isErrorWeather
    } = props


    let countryCount = countries.length

    const manualCountryBtnHandler = (countries, cca3, setNewSingleCountry) => () => {
        let countryObject = {}
        for (const country of countries) {
            if (country.cca3 === cca3) {
                countryObject = country
            }
        }
        setNewSingleCountry(countryObject)
    }

    const displaySingleCountry = (countryData, isLoadingWeather, isErrorWeather, weather) => {
        console.log("display single country", countryData.cca3)

        return (
            <>
            <h1>{countryData.name.common}</h1>
            <div>
                <p>capital {countryData.capital}</p>
                <p>area {countryData.area}</p>
            </div>
            <h4>languages:</h4>
            <ul>
                {
                    Object.entries(countryData.languages).map(entry => 
                        <li key={entry[0]}>{entry[1]}</li>
                    )
                }
            </ul>
            <img src={countryData.flags.png} alt={countryData.name.commom + " flag"}/>
            <WeatherDisplay  weather={weather} isErrorWeather={isErrorWeather} isLoadingWeather={isLoadingWeather} capital={countryData.capital}/>
            </>
        )
    }

    if (isError) {
        return (
            <>
            <p>Error in fetching API :(</p>
            </>
        )
    }

    if (isLoading) {
        return (
            <>
            <p>Loading...</p>
            </>
        )
    }

    if (Object.keys(manuallySelectedCountry).length !== 0) {
        return displaySingleCountry(manuallySelectedCountry, isLoadingWeather, isErrorWeather, weather)
    } 


    if (countryCount > 10) {
        return (
            <>
            <p>Too many matches, specify another filter</p>
            </>
        )
    }
    else if (countryCount <= 10 && countryCount > 1) {
        return (
            <>
            {countries.map(country => {
                return(
                    <div key={country.ccn3}>
                    <p>{country.name.common}</p>
                    <Button buttonText="Show" onClickHandler={manualCountryBtnHandler(countries, country.cca3, setNewSingleCountry)}/>
                    </div>
                )
            })}
            </>
        )
    }
    else if (countryCount === 1) {
        let countryData = countries[0]
        return displaySingleCountry(countryData, isLoadingWeather, isErrorWeather, weather)
        // setNewSingleCountry(countryData)
    }
    // no countries come up in search
    else {
        return (
            <>
            <p>No countries match your search</p>
            </>
        )
    }

}

export default SearchResults;