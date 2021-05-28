import {
  getWeatherByCity,
  getCity,
  addCityToLocalStorage,
  staticMapUrl,
} from "./services";

describe("getWeatherByCity", () => {
  it("should be ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ weather: "test" }),
      })
    );

    expect(await getWeatherByCity("Moscow")).toEqual({ weather: "test" });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=619769815d2e235e82cf7ee1a4435658&units=metric"
    );
  });

  it("should be with problem", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    expect(await getWeatherByCity("Moscow")).toBeFalsy();
    expect(() => getWeatherByCity("")).rejects.toThrow("City can't be empty");
  });
});

describe("getCity", () => {
  it("should be ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ city: "Moscow" }),
      })
    );

    expect(await getCity()).toBe("Moscow");
    expect(fetch).toHaveBeenCalledWith("https://get.geojs.io/v1/ip/geo.json");
  });

  it("should be false", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    expect(await getCity()).toBeFalsy();
  });
});

describe("addCityToLocalStorage", () => {
  it("shold be ok", () => {
    jest.spyOn(Object.getPrototypeOf(window.localStorage), "setItem");

    addCityToLocalStorage("moscow");
    expect(localStorage.setItem).toBeCalledWith(
      "cities",
      JSON.stringify(["moscow"])
    );

    addCityToLocalStorage(" Izhevsk ");
    expect(localStorage.setItem.mock.calls[1]).toEqual([
      "cities",
      JSON.stringify(["moscow", "izhevsk"]),
    ]);

    jest
      .spyOn(Object.getPrototypeOf(window.localStorage), "getItem")
      .mockReturnValueOnce(
        JSON.stringify([
          "city1",
          "city2",
          "city3",
          "city4",
          "city5",
          "city6",
          "city7",
          "city8",
          "city9",
          "city10",
        ])
      );
    addCityToLocalStorage("city11");
    const parsedCitesArr = JSON.parse(localStorage.setItem.mock.calls[2][1]);
    expect(parsedCitesArr.length).toBe(10);
    expect(parsedCitesArr[9]).toBe("city11");
  });

  it("shold be error", () => {
    expect(() => addCityToLocalStorage("")).toThrow("City can't be empty");
    expect(() => addCityToLocalStorage("    ")).toThrow("City can't be empty");
    expect(() => addCityToLocalStorage(["Moscow"])).toThrow(
      "City must be string"
    );
  });
});

describe("staticMapUrl", () => {
  it("should be ok", () => {
    expect(staticMapUrl({ lat: 12.01, lon: 92.91 })).toBe(
      "https://open.mapquestapi.com/staticmap/v4/getmap?key=JlKtJ5EFyri7nHAgFPPohAADdjnGYR4N&size=600,400&zoom=13&center=12.01,92.91"
    );

    expect(staticMapUrl({ lon: 12.01, lat: 92.91 })).toBe(
      "https://open.mapquestapi.com/staticmap/v4/getmap?key=JlKtJ5EFyri7nHAgFPPohAADdjnGYR4N&size=600,400&zoom=13&center=92.91,12.01"
    );
  });

  it("should be error", () => {
    expect(() => staticMapUrl({ lon: 92.91 })).toThrow(
      "coords must by object and contain properties lat and lon"
    );
    expect(() => staticMapUrl({ lat: 12.01 })).toThrow(
      "coords must by object and contain properties lat and lon"
    );
    expect(() => staticMapUrl([12.01, 92.91])).toThrow(
      "coords must by object and contain properties lat and lon"
    );
  });
});
