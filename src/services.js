async function getWeatherByCity(city) {
  const key = "619769815d2e235e82cf7ee1a4435658";
  const baseUrl = "http://api.openweathermap.org/data/2.5/";

  const response = await fetch(`${baseUrl}/weather?q=${city}&appid=${key}`);

  if (response.ok) {
    return response.json();
  }
  alert("A error occurred while sending the request!");
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

export { getWeatherByCity, getCity };
