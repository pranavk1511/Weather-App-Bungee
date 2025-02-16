# Weather Application

## Introduction
This Weather Application allows users to retrieve historical weather data for a specified city and date range using the OpenWeather API. Users can input a city name, select a date range, and view temperature, humidity, and wind speed details.

## Technologies Used
- **React.js** - Frontend framework
- **Axios** - For making API requests
- **OpenWeather API** - For fetching weather data
- **CSS** - For UI styling and better user experience

## Prerequisites
Before running this project, ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm** or **yarn** (package manager)

## Setup and Installation
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Create an .env file in the root directory** and add your OpenWeather API key:
   ```sh
   REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
   ```
4. **Start the application**
   ```sh
   npm start
   ```
   The application will be available at `http://localhost:3000/`

## Obtaining and Configuring the API Key
1. **Sign up for an API key** on OpenWeather:
   - Go to [OpenWeather API](https://home.openweathermap.org/api_keys)
   - Create an account if you don’t have one.
   - Navigate to the API Keys section and generate a new key.
2. **Add the API key to your environment file** (`.env`)
   ```sh
   REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
   ```
3. **Restart the application** after adding the API key:
   ```sh
   npm start
   ```

## Dependencies
The project uses the following npm packages:
```sh
"axios": "^latest",
"react": "^latest",
"react-dom": "^latest",
"react-scripts": "^latest"
```

## License
This project is open-source and available under the MIT License.

---

### Notes
- Ensure your OpenWeather API plan includes **historical weather data access**.
- If you get a `401 Unauthorized` error, check your API key and subscription level.
- Modify the CSS in `WeatherApp.css` for further customization.
- **If there are multiple cities with the same name, you need to mention the country or state to avoid ambiguity.**

