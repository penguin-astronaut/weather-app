import { templateInit, updateCitiesList, updateWeatherInfo } from "./domFunc";
import { getCity } from "./services";

import "./style.css";

(async () => {
  templateInit();
  const city = await getCity();
  if (city) {
    updateWeatherInfo(city as string);
  }
  updateCitiesList();
})();