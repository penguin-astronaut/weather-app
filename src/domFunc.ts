import {
  getWeatherByCity,
  addCityToLocalStorage,
  staticMapUrl,
} from "./services";

function renderMap(coords: Coord): void {
  const img = staticMapUrl(coords);
  document.querySelector(".map").innerHTML = `<img src="${img}"/>`;
}

async function updateWeatherInfo(city: string): Promise<boolean> {
  const weather = (await getWeatherByCity(city)) as Record<string, any>;
  if (!weather) {
    alert("Something is wrong, are you sure you entered the correct city?");
    return false;
  }

  document.querySelector(".weather__city span").textContent = weather.name;
  document.querySelector(
    ".weather__temp span"
  ).innerHTML = `${weather.main.temp}	&#8451;`;
  (
    document.querySelector(".weather__icon") as HTMLImageElement
  ).src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;

  renderMap(weather.coord);
  return true;
}

function updateCitiesList(): void {
  const list = document.querySelector(".cities");
  list.innerHTML = "";
  const cities = JSON.parse(localStorage.getItem("cities")) ?? [];

  cities.forEach((item: string) => {
    list.insertAdjacentHTML(
      "beforeend",
      `<li class="cities__item">${item}</li>`
    );
  });
}

function templateInit(): void {
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

    const city = (
      document.querySelector(".input") as HTMLInputElement
    ).value.trim();
    if (!city) {
      alert("Input can't be null");
      return;
    }

    if (await updateWeatherInfo(city)) {
      addCityToLocalStorage(city);
      updateCitiesList();
    }
    (document.querySelector(".input") as HTMLInputElement).value = "";
  });

  document.querySelector(".cities").addEventListener("click", (e) => {
    if ((e.target as HTMLElement).textContent) {
      updateWeatherInfo((e.target as HTMLElement).textContent);
    }
  });
}

export { templateInit, updateCitiesList, renderMap, updateWeatherInfo };
