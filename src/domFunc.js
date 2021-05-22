import {
  getWeatherByCity,
  getCity,
  addCityToLocalStorage,
  staticMapUrl,
} from "./services";

function renderMap(coords) {
  const img = staticMapUrl(coords);
  document.querySelector(".map").innerHTML = `<img src="${img}"/>`;
}

async function updateWeatherInfo(city) {
  const weather = await getWeatherByCity(city);
  if (!weather) {
    alert("Something is wrong, are you sure you entered the correct city?");
    return;
  }

  document.querySelector(".weather__city span").textContent = weather.name;
  document.querySelector(
    ".weather__temp span"
  ).innerHTML = `${weather.main.temp}	&#8451;`;
  document.querySelector(
    ".weather__icon"
  ).src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;

  renderMap(weather.coord);
}

async function initCity() {
  const city = await getCity();
  if (!city) {
    return;
  }

  updateWeatherInfo(city);
}

function updateCitiesList() {
  const list = document.querySelector(".cities");
  list.innerHTML = "";
  const lsLength = localStorage.length;
  const startElement = lsLength > 10 ? lsLength - 10 : 0;

  for (let i = startElement; i < lsLength; i += 1) {
    const key = localStorage.key(i);
    list.insertAdjacentHTML(
      "beforeend",
      `<li>${localStorage.getItem(key)}</li>`
    );
  }
}

function templateInit() {
  const template = `<form class="form"><input class="input" type="text" placeholder="input city">
  <button class="btn" type="submit">Get Weather</button></form>
  <div class="weather">
    <div class="weather__city">
      Your city: <span></span>
    </div>
    <div class="weather__temp">
      Temperature: <span></span>
      <img class="weather__icon" src="" default='weather-icon'/>
    </div>
  </div>
  <ul class="cities"></ul><div class="map"></div>`;
  document.querySelector(".app").innerHTML = template;

  const form = document.querySelector(".form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = document.querySelector(".input").value.trim();
    if (!city) {
      alert("Input can't be null");
      return;
    }

    if (await updateWeatherInfo(city)) {
      addCityToLocalStorage(city);
      updateCitiesList();
    }
  });
}

export { templateInit, updateCitiesList, initCity, renderMap };
