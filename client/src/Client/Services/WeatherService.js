// Weather Service for Farmer Connect
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const ARCHIVE_API_BASE = 'https://archive-api.open-meteo.com/v1';

// Philippines coordinates (Manila)
const DEFAULT_COORDS = {
  latitude: 14.29,
  longitude: 120.85,
  timezone: 'Asia/Manila'
};

export class WeatherService {
  static async getCurrentWeather(coords = DEFAULT_COORDS) {
    try {
      const url = `${WEATHER_API_BASE}/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&timezone=${coords.timezone}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch current weather');
      
      const data = await response.json();
      return this.formatCurrentWeather(data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  static async getForecast(days = 5, coords = DEFAULT_COORDS) {
    try {
      const url = `${WEATHER_API_BASE}/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=${coords.timezone}&forecast_days=${days}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather forecast');
      
      const data = await response.json();
      return this.formatForecast(data);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }

  static async getHistoricalWeather(startDate, endDate, coords = DEFAULT_COORDS) {
    try {
      const url = `${ARCHIVE_API_BASE}/archive?latitude=${coords.latitude}&longitude=${coords.longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=${coords.timezone}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch historical weather');
      
      const data = await response.json();
      return this.formatHistoricalWeather(data);
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      throw error;
    }
  }

  static formatCurrentWeather(data) {
    const current = data.current;
    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      feelsLike: Math.round(current.apparent_temperature),
      precipitation: current.precipitation || 0,
      weatherCode: current.weather_code,
      pressure: current.surface_pressure,
      windSpeed: current.wind_speed_10m,
      description: this.getWeatherDescription(current.weather_code),
      icon: this.getWeatherIcon(current.weather_code),
      timestamp: new Date().toISOString()
    };
  }

  static formatForecast(data) {
    const daily = data.daily;
    return daily.time.map((date, index) => ({
      date,
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      precipitation: daily.precipitation_sum[index] || 0,
      weatherCode: daily.weather_code[index],
      description: this.getWeatherDescription(daily.weather_code[index]),
      icon: this.getWeatherIcon(daily.weather_code[index])
    }));
  }

  static formatHistoricalWeather(data) {
    const daily = data.daily;
    return daily.time.map((date, index) => ({
      date,
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
      precipitation: daily.precipitation_sum[index] || 0,
      weatherCode: daily.weather_code[index],
      description: this.getWeatherDescription(daily.weather_code[index])
    }));
  }

  static getWeatherDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
  }

  static getWeatherIcon(code) {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2 || code === 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 57) return '🌦️';
    if (code >= 61 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌤️';
  }

  // Get last month's weather data for farming reports
  static async getLastMonthWeather() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const startDate = lastMonth.toISOString().split('T')[0];
    const endDate = lastMonthEnd.toISOString().split('T')[0];
    
    return this.getHistoricalWeather(startDate, endDate);
  }

  // Get specific month weather data
  static async getMonthWeather(year, month) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
    
    return this.getHistoricalWeather(startDate, endDate);
  }
}

export default WeatherService;
