import {
  weatherApiUrl,
  weatherApipKey,
  staticMapApiBaseUrl,
  staticMapApiKey,
} from "./config";

async function getWeatherByCity(
  city: string
): Promise<boolean | Promise<Record<string, any>>> {
  if (!city) {
    return false;
  }

  const response = await fetch(
    `${weatherApiUrl}weather?q=${city}&appid=${weatherApipKey}&units=metric`
  );

  if (response.ok) {
    return response.json();
  }

  return false;
}

async function getCity(): Promise<boolean | string> {
  const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
  if (!response.ok) {
    return false;
  }
  const res = await response.json();
  return res.city;
}

function staticMapUrl(coords: Coord): string {
  if (typeof coords !== "object" || !coords.lat || !coords.lon) {
    return "";
  }
  const { lat, lon } = coords;
  return `${staticMapApiBaseUrl}getmap?key=${staticMapApiKey}&size=600,400&zoom=13&center=${lat},${lon}`;
}

function addCityToLocalStorage(city: string): void {
  const cityFormated = String(city).trim().toLowerCase();
  if (cityFormated.length < 1) {
    return;
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
