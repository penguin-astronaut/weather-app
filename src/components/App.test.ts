/* eslint-disable no-new */
import { weatherApipKey, weatherApiUrl } from "../config";
import App from "./App";

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

beforeEach(() => {
  window.fetch = jest.fn();
  localStorage.setItem(
    "cities",
    JSON.stringify(["Moscow", "Boston", "Berlin"])
  );
});

const getCityData = { city: "Izhevsk" };
const weatherData = {
  name: "Izhevsk",
  coord: { lon: 53.2333, lat: 56.85 },
  weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
  main: { temp: 18.65 },
};

describe("App test", () => {
  beforeEach(() => {
    document.querySelector("body").innerHTML = '<div class="app"></div>';
  });
  it("inital component", async () => {
    new App(document.querySelector(".app"));
    await sleep(20);

    expect(document.querySelector(".input")).toBeTruthy();
    expect(document.querySelector(".btn")).toBeTruthy();
    expect(document.querySelector(".weather")).toBeTruthy();
    expect(document.querySelector(".weather__city")).toBeTruthy();
    expect(document.querySelector(".weather__temp")).toBeTruthy();
    expect(document.querySelector(".cities")).toBeTruthy();
    expect(document.querySelector(".map")).toBeTruthy();
    expect(document.querySelector(".map")).toBeTruthy();
    expect(document.querySelectorAll(".cities__item").length).toBe(3);
    expect(document.querySelector(".weather__city span").innerHTML).toBeFalsy();
  });

  it("initial with city detected api", async () => {
    (global as any).fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(getCityData),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(weatherData),
        })
      );

    new App(document.querySelector(".app"));
    await sleep(20);

    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(
      `https://get.geojs.io/v1/ip/geo.json`
    );

    expect((global.fetch as jest.Mock).mock.calls[1][0]).toBe(
      `${weatherApiUrl}weather?q=${weatherData.name}&appid=${weatherApipKey}&units=metric`
    );

    expect(document.querySelector(".weather__city span").innerHTML).toBe(
      weatherData.name
    );
    expect(document.querySelectorAll(".cities__item").length).toBe(4);
  });

  it("cities list item click", async () => {
    new App(document.querySelector(".app"));
    await sleep(20);

    const listItem = document.querySelectorAll(
      ".cities__item"
    )[1] as HTMLLIElement;
    weatherData.name = listItem.innerHTML;
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(weatherData),
      })
    );
    listItem.click();
    expect(global.fetch as jest.Mock).toBeCalledWith(
      `${weatherApiUrl}weather?q=${weatherData.name}&appid=${weatherApipKey}&units=metric`
    );
    expect(document.querySelectorAll(".cities__item").length).toBe(3);
  });

  it.skip("form submit", async () => {
    new App(document.querySelector(".app"));
    await sleep(20);
    (global as any).fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(weatherData),
      })
    );

    const cityName = "Minsk";
    const input = document.querySelector(".input") as HTMLInputElement;
    input.value = "Minsk";
    (document.querySelector(".form") as HTMLFormElement).submit();
    weatherData.name = cityName;

    expect(global.fetch as jest.Mock).toBeCalledWith(
      `${weatherApiUrl}weather?q=${weatherData.name}&appid=${weatherApipKey}&units=metric`
    );
    expect(document.querySelector(".weather__city span").innerHTML).toBe(
      weatherData.name
    );
    expect(document.querySelectorAll(".cities__item").length).toBe(5);
    expect((document.querySelector(".input") as HTMLInputElement).value).toBe(
      ""
    );
  });
});
