import "./hourly-forecast.css";

interface HourlyForecastData {
  time: string;
  icon: string;
  temp: string | number;
  rain: number;
  condition?: string; // Add weather condition
}

interface HourlyForecastProps {
  data: HourlyForecastData[];
}

// Weather condition to icon mapping using OpenWeatherMap icons
const getWeatherIcon = (condition: string, temp: number) => {
  const conditionLower = condition.toLowerCase();
  
  // OpenWeatherMap icon base URL
  const baseUrl = "https://openweathermap.org/img/wn/";
  
  // Map conditions to icon codes
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return `${baseUrl}01d@2x.png`; // Clear sky day
  } else if (conditionLower.includes('cloud')) {
    if (conditionLower.includes('few')) {
      return `${baseUrl}02d@2x.png`; // Few clouds
    } else if (conditionLower.includes('scattered') || conditionLower.includes('broken')) {
      return `${baseUrl}03d@2x.png`; // Scattered clouds
    } else {
      return `${baseUrl}04d@2x.png`; // Overcast clouds
    }
  } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    if (conditionLower.includes('light')) {
      return `${baseUrl}10d@2x.png`; // Light rain
    } else {
      return `${baseUrl}09d@2x.png`; // Heavy rain
    }
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return `${baseUrl}11d@2x.png`; // Thunderstorm
  } else if (conditionLower.includes('snow')) {
    return `${baseUrl}13d@2x.png`; // Snow
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog') || conditionLower.includes('haze')) {
    return `${baseUrl}50d@2x.png`; // Mist/Fog
  }
  
  // Default based on temperature
  if (temp > 25) {
    return `${baseUrl}01d@2x.png`; // Sunny for hot weather
  } else if (temp < 5) {
    return `${baseUrl}13d@2x.png`; // Snow for cold weather
  } else {
    return `${baseUrl}02d@2x.png`; // Partly cloudy default
  }
};

const HourlyForecast = ({ data }: HourlyForecastProps) => {
  return (
    <div className="hourly-forecast-container">
      <h2>Hourly Forecast</h2>
      <div className="forecast-scroll">
        {data.map((hour, index) => {
          const tempNum = typeof hour.temp === 'string' ? parseFloat(hour.temp) : hour.temp;
          const weatherIcon = getWeatherIcon(hour.condition || '', tempNum);
          
          return (
            <div className="forecast-card" key={index}>
              <p className="hour">{hour.time}</p>
              <img 
                src={weatherIcon} 
                alt={hour.condition || 'weather'} 
                className="weather-icon"
                onError={(e) => {
                  // Fallback to a default icon if the image fails to load
                  e.currentTarget.src = "https://openweathermap.org/img/wn/01d@2x.png";
                }}
              />
              <p className="temp">{hour.temp}°</p>
              <p className="rain">{hour.rain}% 💧</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;