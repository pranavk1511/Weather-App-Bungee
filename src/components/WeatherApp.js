import React, { useState } from "react";
import axios from "axios";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const API_URL = "https://api.openweathermap.org/data/2.5/onecall/timemachine";

  const fetchWeather = async () => {
    if (!city || !startDate || !endDate || !lat || !lon) {
      setError("Please enter a city name, latitude, longitude, and select a date range");
      return;
    }

    setWeatherData([]); // Reset previous results
    setError(null);

    let start = new Date(startDate);
    let end = new Date(endDate);
    let current = new Date(start);

    let weatherResults = [];

    while (current <= end) {
      let timestamp = Math.floor(current.getTime() / 1000);

      try {
        const response = await axios.get(API_URL, {
          params: {
            lat: lat,
            lon: lon,
            dt: timestamp,
            units: unit,
            appid: API_KEY,
          },
        });

        weatherResults.push({
          date: current.toISOString().split("T")[0], // Store date as YYYY-MM-DD
          temp: response.data.current.temp,
          humidity: response.data.current.humidity,
          wind_speed: response.data.current.wind_speed,
        });

      } catch (err) {
        setError("City not found or an error occurred");
      }

      // Move to the next day
      current.setDate(current.getDate() + 1);
    }

    setWeatherData(weatherResults);
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        className="border p-2 rounded"
      />
      <input
        type="text"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Enter latitude"
        className="border p-2 rounded ml-2"
      />
      <input
        type="text"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        placeholder="Enter longitude"
        className="border p-2 rounded ml-2"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 rounded ml-2"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 rounded ml-2"
      />
      <button onClick={fetchWeather} className="bg-blue-500 text-white p-2 ml-2 rounded">
        Get Weather
      </button>
      <div className="mt-4">
        <button onClick={() => setUnit("metric")} className="mr-2 p-2 border rounded">
          Celsius
        </button>
        <button onClick={() => setUnit("imperial")} className="p-2 border rounded">
          Fahrenheit
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {weatherData.length > 0 && (
        <div className="mt-4 border p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold">Weather Data</h2>
          {weatherData.map((day, index) => (
            <div key={index} className="border p-2 mt-2 rounded shadow-sm">
              <h3 className="font-semibold">{day.date}</h3>
              <p>Temperature: {day.temp}°{unit === "metric" ? "C" : "F"}</p>
              <p>Humidity: {day.humidity}%</p>
              <p>Wind Speed: {day.wind_speed} {unit === "metric" ? "m/s" : "mph"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
