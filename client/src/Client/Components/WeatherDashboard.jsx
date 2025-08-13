import React, { useState, useEffect } from 'react';
import WeatherService from '../Services/WeatherService';

const WeatherDashboard = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load current weather and 5-day forecast
      const [current, forecastData, historical] = await Promise.all([
        WeatherService.getCurrentWeather(),
        WeatherService.getForecast(5),
        WeatherService.getLastMonthWeather()
      ]);

      setCurrentWeather(current);
      setForecast(forecastData);
      setHistoricalData(historical);
    } catch (err) {
      setError('Failed to load weather data');
      console.error('Weather data error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadWeatherData}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      {currentWeather && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🌤️ Current Weather
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">{currentWeather.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{currentWeather.temperature}°C</div>
              <div className="text-sm text-gray-600">{currentWeather.description}</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Feels like:</span>
                <span className="font-semibold">{currentWeather.feelsLike}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Humidity:</span>
                <span className="font-semibold">{currentWeather.humidity}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Wind:</span>
                <span className="font-semibold">{currentWeather.windSpeed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pressure:</span>
                <span className="font-semibold">{currentWeather.pressure} hPa</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Precipitation:</span>
                <span className="font-semibold">{currentWeather.precipitation} mm</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(currentWeather.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📅 5-Day Forecast
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div key={day.date} className="text-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="font-semibold text-gray-800 mb-2">
                  {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-2xl mb-2">{day.icon}</div>
                <div className="text-sm text-gray-600 mb-2">{day.description}</div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-red-600">{day.maxTemp}°</span>
                  <span className="text-blue-600">{day.minTemp}°</span>
                </div>
                {day.precipitation > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    🌧️ {day.precipitation}mm
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Weather Summary */}
      {historicalData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📊 Last Month Weather Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-red-50">
              <div className="text-lg font-bold text-red-600">
                {Math.max(...historicalData.map(d => d.maxTemp))}°C
              </div>
              <div className="text-sm text-gray-600">Highest Temperature</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-lg font-bold text-blue-600">
                {Math.min(...historicalData.map(d => d.minTemp))}°C
              </div>
              <div className="text-sm text-gray-600">Lowest Temperature</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <div className="text-lg font-bold text-green-600">
                {historicalData.reduce((sum, d) => sum + d.precipitation, 0).toFixed(1)}mm
              </div>
              <div className="text-sm text-gray-600">Total Rainfall</div>
            </div>
          </div>
          
          {/* Farming Insights */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">🌱 Farming Insights</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              {historicalData.reduce((sum, d) => sum + d.precipitation, 0) > 100 ? (
                <p>• High rainfall last month - good for water-dependent crops</p>
              ) : (
                <p>• Low rainfall last month - consider irrigation for crops</p>
              )}
              {Math.max(...historicalData.map(d => d.maxTemp)) > 35 ? (
                <p>• High temperatures recorded - ensure adequate crop shading</p>
              ) : (
                <p>• Moderate temperatures - favorable for most crop varieties</p>
              )}
              <p>• Weather data can help optimize planting schedules</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
