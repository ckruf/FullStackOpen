const WeatherDisplay = ({weather, isLoadingWeather, isErrorWeather, capital}) => {
    if (isLoadingWeather || Object.keys(weather).length === 0) {
        return (
            <>
            <p>Loading weather for {capital}</p>
            </>
        )
    }
    else if (isErrorWeather) {
        return (
            <>
            <p>Error in fetching weather for {capital}</p>
            </>
        )
    }
    else {
        console.log("weatherData")
        console.log(weather)
        let iconName = weather.weather[0].icon
        let imgURL = `http://openweathermap.org/img/wn/${iconName}@2x.png`
        let description = weather.weather[0].description
        let temperature = weather.main.temp
        temperature = (temperature - 273).toFixed(1)
        return (
            <>
            <h3>Weather in {capital}</h3>
            <p>temperature {temperature} Celsius</p>
            <img src={imgURL} alt="weather icon" />
            <p>{description}</p>
            </>
        )
    }
}

export default WeatherDisplay