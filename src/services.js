async function getWeatherByCity(city) {
  if (!city) {
    throw new Error("City can't be empty");
  }
  const key = "619769815d2e235e82cf7ee1a4435658";
  const baseUrl = "https://api.openweathermap.org/data/2.5/";

  const response = await fetch(
    `${baseUrl}weather?q=${city}&appid=${key}&units=metric`
  );

  if (response.ok) {
    return response.json();
  }

  return false;
}

async function getCity() {
  const response = await fetch("https://get.geojs.io/v1/ip/geo.json");

  if (!response.ok) {
    return false;
  }
  const res = await response.json();

  return res.city;
}

function staticMapUrl(coords) {
  if (typeof coords !== "object" || !coords.lat || !coords.lon) {
    throw new Error("coords must by object and contain properties lat and lon");
  }
  const { lat, lon } = coords;
  const key = "JlKtJ5EFyri7nHAgFPPohAADdjnGYR4N";
  return `https://open.mapquestapi.com/staticmap/v4/getmap?key=${key}&size=600,400&zoom=13&center=${lat},${lon}`;
}

function addCityToLocalStorage(city) {
  if (typeof city !== "string") {
    throw new Error("City must be string");
  }

  const cityFormated = String(city).trim().toLowerCase();
  if (cityFormated.length < 1) {
    throw new Error("City can't be empty");
  }

  const storageCities = localStorage.getItem("cities");

  const cities = JSON.parse(storageCities) ?? [];
  if (!cities.includes(cityFormated)) {
    cities.push(cityFormated);
  }
  if (cities.length > 10) {
    cities.shift();
  }

  localStorage.setItem("cities", JSON.stringify(cities));
}

export { getWeatherByCity, getCity, addCityToLocalStorage, staticMapUrl };
