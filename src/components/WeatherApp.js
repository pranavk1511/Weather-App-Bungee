import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // Initially set to metric (Celsius)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API_KEY = "4634bb512e16d276a6219eebb4980de8"; // Your OpenWeather API Key
  const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
  const WEATHER_FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
  const WEATHER_HISTORY_API_URL = "https://api.openweathermap.org/data/2.5/weather";

  useEffect(() => {
    return () => {
      setWeatherData([]);
    };
  }, []);

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    setWeatherData([]);
    setError(null);

    try {
      // Get latitude and longitude from city
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
      // Convert start and end dates to timestamps
      const startTimestamp = new Date(startDate).getTime() / 1000;
      const endTimestamp = new Date(endDate).getTime() / 1000;
      const currentTimestamp = new Date().getTime() / 1000;

      let results = [];

      for (let timestamp = startTimestamp; timestamp <= endTimestamp; timestamp += 86400) {
        const date = new Date(timestamp * 1000).toISOString().split("T")[0];

        if (timestamp < currentTimestamp - 432000) { 
          results.push({ date, error: "Past data is only available for the last 5 days." });
        } else if (timestamp >= currentTimestamp) {
          const response = await axios.get(WEATHER_FORECAST_API_URL, {
            params: {
              lat: lat,
              lon: lon,
              units: unit,
              appid: API_KEY,
            },
          });

          const forecastData = response.data.list.filter((entry) =>
            entry.dt_txt.includes("12:00:00")
          ); // Taking midday temperature for consistency

          const dayWeather = forecastData.find((entry) =>
            entry.dt_txt.startsWith(date)
          );

          if (dayWeather) {
            results.push({
              date,
              temp: dayWeather.main.temp,
              humidity: dayWeather.main.humidity,
              wind_speed: dayWeather.wind.speed,
              description: dayWeather.weather[0].description,
            });
          } else {
            results.push({ date, error: "No forecast data available." });
          }
        } else {
          const response = await axios.get(WEATHER_HISTORY_API_URL, {
            params: {
              lat: lat,
              lon: lon,
              dt: timestamp,
              units: unit,
              appid: API_KEY,
            },
          });

          results.push({
            date,
            temp: response.data.main.temp,
            humidity: response.data.main.humidity,
            wind_speed: response.data.wind.speed,
            description: response.data.weather[0].description,
          });
        }
      }

      setWeatherData(results);
    } catch (err) {
      setError("Error fetching data. Please check your API key and subscription plan.");
    }
  };

  // Convert temperature based on selected unit
  const convertTemperature = (temp) => {
    return unit === "imperial" ? ((temp * 9/5) + 32).toFixed(2) : temp.toFixed(2);
  };

  // Convert wind speed based on selected unit
  const convertWindSpeed = (speed) => {
    return unit === "imperial" ? (speed * 2.23694).toFixed(2) : speed.toFixed(2);
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
        <button onClick={fetchWeather} className="search-button">
          Get Weather
        </button>
      </div>
      <div className="date-range">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="date-input"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="date-input"
        />
      </div>
      <div className="unit-toggle">
        <button
          onClick={() => setUnit("metric")}
          className={`unit-button ${unit === "metric" ? "active" : ""}`}
        >
          Celsius (°C, m/s)
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`unit-button ${unit === "imperial" ? "active" : ""}`}
        >
          Fahrenheit (°F, mph)
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {weatherData.length > 0 && (
        <div className="weather-results">
          <h2 className="subtitle">Weather Data</h2>
          {weatherData.map((day, index) => (
            <div key={index} className="weather-card">
              <h3>{day.date}</h3>
              {day.error ? (
                <p className="error-message">{day.error}</p>
              ) : (
                <>
                  <p>Temperature: {convertTemperature(day.temp)}°{unit === "metric" ? "C" : "F"}</p>
                  <p>Humidity: {day.humidity}%</p>
                  <p>Wind Speed: {convertWindSpeed(day.wind_speed)} {unit === "metric" ? "m/s" : "mph"}</p>
                  <p>Weather: {day.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
