import {
  addCityToLocalStorage,
  ERROR_API_CONNECTION,
  ERROR_INCORRECT_CITY,
  getCity,
  getWeatherByCity,
  staticMapUrl,
} from "../services";
import { Component } from "./Component";

export default class App extends Component {
  async onMount(): Promise<void> {
    let userCity: string | boolean;
    try {
      userCity = await getCity();
      // eslint-disable-next-line no-empty
    } catch {}
    if (userCity) {
      this.updateCity(userCity as string);
    } else {
      const cities = JSON.parse(localStorage.getItem("cities"));
      this.setState({ cities });
    }
  }

  template(): string {
    return `
    <form class="form"><input class="input" type="text" placeholder="input city">
      <button class="btn" type="submit">Get Weather</button>
    </form>
    <div class="weather">
      <div class="weather__city">
        Your city: <span>{{city}}</span>
      </div>
      <div class="weather__temp">
        Temperature: <span>{{temp}}</span>
        {{ if weatherIcon }}
          <img class="weather__icon" src="https://openweathermap.org/img/wn/{{weatherIcon}}.png" default='weather-icon'/>
        {{ endif }}
        
      </div>
    </div>
    <p>Search history:</p>
    <ul class="cities">
      {{ for item in cities}}
        <li class="cities__item">{{item}}</li>
      {{ endfor }}
    </ul>
    <div class="map">
      <img src="{{mapImg}}"/>
    </div>`;
  }

  events = {
    "submit@.form": async (e: Event): Promise<void> => {
      e.preventDefault();
      const city = (
        document.querySelector(".input") as HTMLInputElement
      ).value.trim();
      if (!city) {
        alert("Input can't be null");
        return;
      }
      await this.updateCity(city);
    },

    "click@.cities__item": async (e: Event): Promise<void> => {
      const city = (e.target as HTMLElement).textContent;
      this.updateCity(city);
    },
  };

  private async updateCity(city: string) {
    const weather = await getWeatherByCity(city);
    if (weather === ERROR_INCORRECT_CITY) {
      alert("Something is wrong, are you sure you entered the correct city?");
      return;
    } else if (weather === ERROR_API_CONNECTION) {
      alert("server side problem please try again later");
      return;
    }

    addCityToLocalStorage(city);
    const cities = JSON.parse(localStorage.getItem("cities"));
    const mapImg = staticMapUrl((weather as Record<string, any>).coord);

    this.setState({
      city: (weather as Record<string, any>).name,
      weatherIcon: (weather as Record<string, any>).weather[0].icon,
      cities,
      mapImg,
    });
  }
}
