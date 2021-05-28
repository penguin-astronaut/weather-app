import { templateInit, updateCitiesList, updateWeatherInfo } from "./domFunc";

const originalAlert = window.alert;

beforeEach(() => {
  document.body.innerHTML = '<div class="app"></div>';
  templateInit();

  window.alert = jest.fn();
});

afterEach(() => {
  document.body.innerHTML = "";

  window.alert = originalAlert;
});

const weatherApi = {
  name: "Izhevsk",
  coord: { lon: 53.2333, lat: 56.85 },
  weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
  main: { temp: 18.65 },
};

describe("DOM test", () => {
  it("template init", () => {
    expect(document.querySelector(".input")).toBeTruthy();
    expect(document.querySelector(".btn")).toBeTruthy();
    expect(document.querySelector(".weather")).toBeTruthy();
    expect(document.querySelector(".weather__city")).toBeTruthy();
    expect(document.querySelector(".weather__temp")).toBeTruthy();
    expect(document.querySelector(".cities")).toBeTruthy();
    expect(document.querySelector(".map")).toBeTruthy();
  });

  it("form submit false", async () => {
    document.querySelector(".input").value = "";
    await document.querySelector(".form").submit();

    expect(window.alert).toBeCalledWith("Input can't be null");
  });
});

describe("update info", () => {
  it("should be ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(weatherApi),
      })
    );
    expect(await updateWeatherInfo("izhevsk")).toBeTruthy();
    expect(fetch).toBeCalledWith(
      "https://api.openweathermap.org/data/2.5/weather?q=izhevsk&appid=619769815d2e235e82cf7ee1a4435658&units=metric"
    );

    expect(document.querySelector(".weather__city span").innerHTML).toBe(
      weatherApi.name
    );
    expect(document.querySelector(".weather__temp span").innerHTML).toBe(
      `${weatherApi.main.temp}	℃`
    );
    expect(document.querySelector(".weather__icon").src).toBe(
      `https://openweathermap.org/img/wn/${weatherApi.weather[0].icon}.png`
    );
  });

  it("should be alert", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );
    expect(await updateWeatherInfo("city")).toBeFalsy();
    expect(alert).toBeCalledWith(
      "Something is wrong, are you sure you entered the correct city?"
    );
  });
});

describe("updateCitiesList", () => {
  it("should be ok", () => {
    jest
      .spyOn(Object.getPrototypeOf(window.localStorage), "getItem")
      .mockReturnValueOnce(
        JSON.stringify(["Moscow", "Izhevsk", "London", "Boston"])
      );
    updateCitiesList();
    expect(document.querySelectorAll(".cities li").length).toBe(4);
  });
});
