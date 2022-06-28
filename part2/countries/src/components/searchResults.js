import Button from "./Button"

const SearchResults = ({countries, setCountries}) => {
    let countryCount = countries.length

    const filterSingleCountry = (countries, setCountries, cca3) => () => {
        const singleCountryArray = countries.filter(country => country.cca3 === cca3)
        setCountries(singleCountryArray)
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
                    <Button buttonText="Show" onClickHandler={filterSingleCountry(countries, setCountries, country.cca3)}/>
                    </div>
                )
            })}
            </>
        )
    }
    else if (countryCount === 1) {
        let countryData = countries[0]
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
            </>
        )
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