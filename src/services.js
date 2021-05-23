async function getWeatherByCity(city) {
  if (!city) {
    throw new Error("City can't be empty");
  }
  const key = "619769815d2e235e82cf7ee1a4435658";
  const baseUrl = "http://api.openweathermap.org/data/2.5/";

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
  const { lat, lon } = coords;
  const key = "JlKtJ5EFyri7nHAgFPPohAADdjnGYR4N";
  return `https://open.mapquestapi.com/staticmap/v4/getmap?key=${key}&size=600,400&zoom=13&center=${lat},${lon}`;
}

function addCityToLocalStorage(city) {
  const cityClear = String(city).trim();
  if (cityClear.length < 1) {
    throw new Error("City can't be empty");
  }
  const cityCapitalized = cityClear[0].toUpperCase() + cityClear.slice(1);

  const storageCities = localStorage.getItem("cites");
  const cites = JSON.parse(storageCities) ?? [];
  if (!cites.includes(cityCapitalized)) {
    cites.push(cityCapitalized);
  }
  localStorage.setItem("cites", JSON.stringify(cites));
}

export { getWeatherByCity, getCity, addCityToLocalStorage, staticMapUrl };
