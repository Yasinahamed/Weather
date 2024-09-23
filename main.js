const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/",
  onecallBase: "https://api.openweathermap.org/data/2.5/onecall"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

// Use geolocation to get the user's location on load
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      getWeatherByCoords(position.coords.latitude, position.coords.longitude);
    });
  }
});

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => weather.json())
    .then(result => {
      getWeatherByCoords(result.coord.lat, result.coord.lon);
    });
}

function getWeatherByCoords(lat, lon) {
  fetch(`${api.onecallBase}?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${api.key}`)
    .then(res => res.json())
    .then(displayResults);
}

function displayResults(weather) {
  let city = document.querySelector('.city');
  city.innerText = `${weather.timezone}`;

  let now = new Date();
  let date = document.querySelector('.date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.current.temp)}<span>°C</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.current.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.daily[0].temp.min)}°C / ${Math.round(weather.daily[0].temp.max)}°C`;

  setBackgroundImage(weather.timezone);
  displayForecast(weather.daily);
}

function setBackgroundImage(location) {
  // Random image based on location (You can improve this with actual API for images)
  document.querySelector('.app-wrap').style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${location}')`;
}

function displayForecast(daily) {
  let forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = '';
  for (let i = 1; i < 8; i++) {
    let forecastDay = daily[i];
    let dayElement = document.createElement('div');
    dayElement.classList.add('forecast-day');
    dayElement.innerHTML = `
      <div>${new Date(forecastDay.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</div>
      <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="${forecastDay.weather[0].main}" />
      <div>${Math.round(forecastDay.temp.day)}°C</div>
    `;
    forecastContainer.appendChild(dayElement);
  }
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

