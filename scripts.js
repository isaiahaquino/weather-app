const WeatherApp = (() => {

  const appId = '6a0dbc1c4d85b3b4ea06c7304b1af7b9';

  let units = 'imperial';
  let currentCity = 'honolulu';

  const getWeather = () => {

    // Current Weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${appId}&units=${units}`, { mode: 'cors' })
      .then(response => { return response.json(); })
      .then(response => {
        console.log(response)
      })
      .catch(error => console.log('Error: ' + error))

    // 5 Day - 3 Hour
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${appId}&units=${units}`, { mode: 'cors' })
      .then(response => { return response.json(); })
      .then(response => {
        console.log(response)
      })
      .catch(error => console.log('Error: ' + error))

  }

  return { getWeather, };

})();

const DisplayController = (() => {



})();