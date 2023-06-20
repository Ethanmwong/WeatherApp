const apiKey = "4578d419cee9b64b610060ebd7a7928f";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?";

const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const useLocationButton = document.querySelector(".useMyLocation");
const weatherIcon = document.querySelector(".weather-icon");

let isImperialUnit = true; // Initial unit is imperial
let temperatureValue;
let windSpeedValue;

async function checkWeather(city) {
  const unitSystem = isImperialUnit ? "imperial" : "metric";
  const response = await fetch(
    `${apiURL}q=${city}&appid=${apiKey}&units=${unitSystem}`
  );

  if (response.status === 404) {
    displayErrorMessage("Invalid city name");
  } else {
    const data = await response.json();
    displayWeatherData(data);
  }
}

function displayErrorMessage(message) {
  document.querySelector(".error").textContent = message;
  document.querySelector(".error").style.display = "block";
  document.querySelector(".weather").style.display = "none";
}

function displayWeatherData(data) {
  document.querySelector(".city").innerHTML = data.name;
  temperatureValue = data.main.temp;
  windSpeedValue = data.wind.speed;
  updateTemperature();
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  updateWindSpeed();
  setWeatherIcon(data.weather[0].main);
  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

function updateTemperature() {
  const temperatureElement = document.querySelector(".temp");
  temperatureElement.innerHTML = `${Math.round(
    temperatureValue
  )}${getTemperatureUnit()}`;
}

function getTemperatureUnit() {
  return isImperialUnit ? "°F" : "°C";
}

function updateWindSpeed() {
  const windSpeedElement = document.querySelector(".wind");
  windSpeedElement.innerHTML = `${Math.round(
    windSpeedValue
  )}${getWindSpeedUnit()}`;
}

function getWindSpeedUnit() {
  return isImperialUnit ? "mph" : "kph";
}

function setWeatherIcon(weatherMain) {
  switch (weatherMain) {
    case "Clouds":
      weatherIcon.src = "images/clouds.png";
      break;
    case "Rain":
      weatherIcon.src = "images/rain.png";
      break;
    case "Clear":
      weatherIcon.src = "images/clear.png";
      break;
    case "Snow":
      weatherIcon.src = "images/snow.png";
      break;
    case "Drizzle":
      weatherIcon.src = "images/drizzle.png";
      break;
    case "Mist":
      weatherIcon.src = "images/mist.png";
      break;
    default:
      weatherIcon.src = "";
      break;
  }
}

function toggleUnit() {
  const unitSlider = document.getElementById("unitSlider");
  isImperialUnit = unitSlider.value === "0"; // 0 represents Fahrenheit, 1 represents Celsius
  updateTemperature();
  updateWindSpeed();
}

searchButton.addEventListener("click", () => {
  const city = searchBox.value;
  checkWeather(city);
});

useLocationButton.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getCityByCoordinates(latitude, longitude);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          displayErrorMessage("Geolocation is disabled");
        } else {
          displayErrorMessage("Error getting location");
        }
      }
    );
  } else {
    displayErrorMessage("Geolocation is not supported by this browser.");
  }
});

async function getCityByCoordinates(latitude, longitude) {
  const unitSystem = isImperialUnit ? "imperial" : "metric";
  const response = await fetch(
    `${apiURL}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unitSystem}`
  );

  if (response.status === 404) {
    displayErrorMessage("Weather data not found");
  } else {
    const data = await response.json();
    displayWeatherData(data);
  }
}

const unitSlider = document.getElementById("unitSlider");
unitSlider.addEventListener("input", toggleUnit);
