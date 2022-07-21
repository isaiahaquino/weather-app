const WeatherReport = (() => {

    const appId = '6a0dbc1c4d85b3b4ea06c7304b1af7b9';
    const units = 'imperial';

    // First box
    let currentCity = 'honolulu';           // name
    let currentTemp = null;                 // main.temp
    let currentWeatherCondition = null;     // weather.main

    // Second box (list[0-7])
    const hoursToShow = 8;
    let hourTemps = [];                     // list.main.temp
    let hourWeatherConditions = [];         // list.weather.main
    let hourTimes = [];                     // list.dt

    // Thirt box (list[3,11,19,27,35])
    const daysToShow = 5;
    let dayName = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
    let dayTemps = [];                      // list.main.temp
    let dayWeatherConditions = [];          // list.weather.main
    let dayDay = [];                        // list.dt

    const outputDataTest = () => {
        console.log('Current:');
        console.log(`City: ${currentCity}; Temp: ${currentTemp}; Weather: ${currentWeatherCondition}`);

        console.log('Hourly:');
        console.log(`Hour: ${hourTimes} Temps: ${hourTemps}; Weathers: ${hourWeatherConditions}`);

        console.log('Days:');
        console.log(`Day: ${dayDay} Temps: ${dayTemps}; Weathers: ${dayWeatherConditions}`);
    }

    const getData = () => {
        return { currentCity, currentTemp, currentWeatherCondition,
                hourTemps, hourWeatherConditions, hourTimes,
                dayTemps, dayDay, dayWeatherConditions, daysToShow, hoursToShow }
    }

    const parseResponseCurr = (response) => {
        currentCity = response.name;
        currentTemp = Math.round(response.main.temp);
        currentWeatherCondition = response.weather[0].main;
    }

    const parseResponseDays = (response) => {
        for (let i=0; i<hoursToShow; i++) {
            hourTemps[i] = Math.round(response.list[i].main.temp);
            hourWeatherConditions[i] = response.list[i].weather[0].main;
            hourTimes[i] = new Date(response.list[i].dt * 1000).getUTCHours();
            hourTimes[i] = `${hourTimes[i]}:00`;
        }

        for (let i=0; i<daysToShow; i++) {
            let j = (i * 8) + 3;
            dayTemps[i] = Math.round(response.list[j].main.temp);
            dayWeatherConditions[i] = response.list[j].weather[0].main;
            dayDay[i] = new Date(response.list[j].dt * 1000).getDay();
            dayDay[i] = dayName[dayDay[i]];
        }
    }
    
    const getWeather = () => {

        // Current Weather API
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${appId}&units=${units}`, { mode: 'cors' })
            .then(response => {
                return response.json();
            })
            .then(response => {
                parseResponseCurr(response);
                DisplayControl.displayReport();
            })
            .catch(error => {
                console.log("Error: " + error);
            });

        // 5 Day / 3 Hour API
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=${appId}&units=${units}`, { mode: 'cors' })
            .then(response => {
                return response.json();
            })
            .then(response => {
                parseResponseDays(response);
                DisplayControl.displayReport();
                console.log(response);
            })
            .catch(error => {
                console.log("Error: " + error);
            });

    }

    const changeCity = (newCity) => {
        currentCity = newCity;
    }

    return {getWeather, changeCity, outputDataTest, getData};
})();

const DisplayControl = (() => {

    const inputField = document.querySelector('#searchInput');

    const search = (event) => {
        event.preventDefault();
        WeatherReport.changeCity(inputField.value);
        inputField.value = '';
        WeatherReport.getWeather();
    }

    const resetReport = () => {
        removeChildren(document.querySelector('.current'));
        removeChildren(document.querySelector('.hourlyContainer'));
        removeChildren(document.querySelector('.dailyContainer'));

    }

    const removeChildren = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    const displayReport = () => {
        resetReport();
        const report = WeatherReport.getData();

        // Current
        const parent = document.querySelector('.current')
        const currentTemp = document.createElement('h1');
        currentTemp.classList.add('currentTemp');
        currentTemp.innerHTML = `${report.currentTemp}&#176`;
        parent.appendChild(currentTemp);

        const currentCity = document.createElement('h2');
        currentCity.classList.add('currentCity');
        currentCity.innerHTML = report.currentCity;
        parent.appendChild(currentCity);

        const imgContainer = document.createElement('div');
        const img = document.createElement('img');
        img.classList.add('currentImage');
        img.src = `photos/${report.currentWeatherCondition}.png`;
        imgContainer.appendChild(img);
        parent.appendChild(imgContainer);

        // Hourly
        for (let i=0; i<report.hoursToShow; i++) {
            const parent = document.createElement('div');
            parent.classList.add('hourlyReport');

            const temp = document.createElement('p');
            temp.classList.add('hourlyTemp');
            temp.innerHTML = `${report.hourTemps[i]}&#176`;
            parent.appendChild(temp);

            const weather = document.createElement('img');
            weather.classList.add('hourlyWeather');
            weather.src = `photos/${report.hourWeatherConditions[i]}.png`;
            parent.appendChild(weather);

            const time = document.createElement('p');
            time.classList.add('hourlyTime');
            time.innerHTML = report.hourTimes[i];
            parent.appendChild(time);

            document.querySelector('.hourlyContainer').appendChild(parent);
        }

        // Daily
        for (let i=0; i<report.daysToShow; i++) {
            const parent = document.createElement('div');
            parent.classList.add('dailyReport');

            const temp = document.createElement('p');
            temp.classList.add('dailyTemp');
            temp.innerHTML = `${report.dayTemps[i]}&#176`;
            parent.appendChild(temp);

            const weather = document.createElement('img');
            weather.classList.add('dailyWeather');
            weather.src = `photos/${report.dayWeatherConditions[i]}.png`;
            parent.appendChild(weather);

            const day = document.createElement('p');
            day.classList.add('dailyDay');
            day.innerHTML = report.dayDay[i];
            parent.appendChild(day);

            document.querySelector('.dailyContainer').appendChild(parent);
        }
    }

    return {search, displayReport, resetReport};
})();

WeatherReport.getWeather();
