import React, { useState } from "react";
import axios from "axios";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
  const WEATHER_HISTORY_API_URL = "https://history.openweathermap.org/data/2.5/history/city";

  const fetchWeather = async () => {
    if (!city || !startDate || !endDate) {
      setError("Please enter a city name and select a date range.");
      return;
    }

    setWeatherData([]);
    setError(null);

    try {
      const geoResponse = await axios.get(GEO_API_URL, {
        params: {
          q: city,
          limit: 1,
          appid: API_KEY,
        },
      });

      if (geoResponse.data.length === 0) {
        setError("Invalid city name. Please try again.");
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      const weatherResponse = await axios.get(WEATHER_HISTORY_API_URL, {
        params: {
          lat: lat,
          lon: lon,
          type: "hour",
          start: Math.floor(new Date(startDate).getTime() / 1000),
          end: Math.floor(new Date(endDate).getTime() / 1000),
          units: unit,
          appid: API_KEY,
        },
      });

      setWeatherData(weatherResponse.data.list);
    } catch (err) {
      setError("Error fetching data. Please try again.");
    }
  };

  return (
    <div className="weather-container">
      <h1 className="title">Weather App</h1>
      <div className="input-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="input-field"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input-field"
        />
        <button onClick={fetchWeather} className="search-button">
          Get Weather
        </button>
      </div>
      <div className="unit-toggle">
        <button onClick={() => setUnit("metric")} className="unit-button">
          Celsius
        </button>
        <button onClick={() => setUnit("imperial")} className="unit-button">
          Fahrenheit
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {weatherData.length > 0 && (
        <div className="weather-results">
          <h2 className="subtitle">Weather Data</h2>
          {weatherData.map((day, index) => (
            <div key={index} className="weather-card">
              <h3>{new Date(day.dt * 1000).toLocaleDateString()}</h3>
              <p>Temperature: {day.main.temp}°{unit === "metric" ? "C" : "F"}</p>
              <p>Humidity: {day.main.humidity}%</p>
              <p>Wind Speed: {day.wind.speed} {unit === "metric" ? "m/s" : "mph"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
