const key = "619769815d2e235e82cf7ee1a4435658";
const baseUrl = "http://api.openweathermap.org/data/2.5/";

export default async function getWeatherByCity(city) {
  const response = await fetch(`${baseUrl}/weather?q=${city}&appid=${key}`);

  if (response.ok) {
    return response.json();
  }
  alert("A error occurred while sending the request!");
  return null;
}
