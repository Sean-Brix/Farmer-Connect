import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import Navbar from '../../Components/Navbar.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Farmer_Report() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCropRegistrationModal, setShowCropRegistrationModal] = useState(false);
  const [showMonthlyReportModal, setShowMonthlyReportModal] = useState(false);
  const [selectedCropForReport, setSelectedCropForReport] = useState(null);

  // Form states
  const [newCrop, setNewCrop] = useState({
    cropType: '',
    variety: '',
    plantingDate: '',
    area: '',
    expectedYield: '',
    currentStage: 'Seedling',
    notes: ''
  });

  const [newReport, setNewReport] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    growthStage: '',
    plantHeight: '',
    healthStatus: 'Healthy',
    estimatedYield: '',
    weatherImpact: '',
    notes: ''
  });

  // Weather state for Tanza, Cavite (14.4, 120.9)
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // Tanza, Cavite coordinates
  const LOCATION = {
    latitude: 14.4,
    longitude: 120.9,
    timezone: 'Asia/Manila',
    name: 'Tanza, Cavite'
  };

  // Weather API Functions
  const fetchWeatherData = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    
    try {
      const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&hourly=soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm&timezone=${LOCATION.timezone}&forecast_days=7`;
      
      const response = await fetch(currentUrl);
      if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
      
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Weather fetch error:', error);
      setWeatherError(`Failed to load weather data: ${error.message}`);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Weather helper functions
  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
      55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 65) return '🌧️';
    if (code <= 82) return '🌦️';
    return '⛈️';
  };

  // Load weather data on component mount
  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Sample farmer data
  const [farmerProfile] = useState({
    id: 1,
    name: 'Juan Dela Cruz',
    location: 'Tanza, Cavite',
    farmSize: 2.5,
    joinDate: '2024-01-15'
  });

  // Farmer's registered crops state
  const [registeredCrops, setRegisteredCrops] = useState([
    {
      id: 1,
      cropType: 'Rice',
      variety: 'IR64',
      plantingDate: '2024-01-15',
      expectedHarvest: '2024-05-15',
      area: 1.5,
      status: 'Active',
      currentStage: 'Tillering',
      expectedYield: 6750,
      reports: [
        {
          id: 1,
          reportDate: '2024-01-30',
          growthStage: 'Germination',
          plantHeight: 15,
          healthStatus: 'Healthy',
          estimatedYield: 6500,
          weatherImpact: 'Favorable',
          notes: 'Seeds germinating well, uniform growth'
        }
      ]
    },
    {
      id: 2,
      cropType: 'Tomato',
      variety: 'Cherokee Purple',
      plantingDate: '2024-02-01',
      expectedHarvest: '2024-05-01',
      area: 0.5,
      status: 'Active',
      currentStage: 'Flowering',
      expectedYield: 12500,
      reports: []
    }
  ]);

  // Local helper functions
  const calculateProgress = (plantingDate, expectedHarvest) => {
    if (!plantingDate || !expectedHarvest) return 0;
    const planted = new Date(plantingDate);
    const harvest = new Date(expectedHarvest);
    const now = new Date();
    const totalDays = (harvest - planted) / (1000 * 60 * 60 * 24);
    const daysElapsed = (now - planted) / (1000 * 60 * 60 * 24);
    return Math.min(Math.max(Math.round((daysElapsed / totalDays) * 100), 0), 100);
  };

  const handleAddCrop = () => {
    if (!newCrop.cropType || !newCrop.variety || !newCrop.plantingDate) {
      alert('Please fill in all required fields');
      return;
    }

    const cropData = {
      ...newCrop,
      id: Date.now(),
      status: 'Active',
      reports: []
    };

    setRegisteredCrops(prev => [...prev, cropData]);
    setNewCrop({
      cropType: '',
      variety: '',
      plantingDate: '',
      area: '',
      expectedYield: '',
      currentStage: 'Seedling',
      notes: ''
    });
    setShowCropRegistrationModal(false);
  };

  const handleAddReport = () => {
    if (!newReport.reportDate || !newReport.growthStage || !newReport.plantHeight) {
      alert('Please fill in all required fields');
      return;
    }

    const reportData = {
      ...newReport,
      id: Date.now(),
      cropId: selectedCropForReport.id,
      cropType: selectedCropForReport.cropType,
      variety: selectedCropForReport.variety
    };

    setRegisteredCrops(prev => prev.map(crop => 
      crop.id === selectedCropForReport.id 
        ? { ...crop, reports: [...crop.reports, reportData], currentStage: newReport.growthStage }
        : crop
    ));

    setNewReport({
      reportDate: new Date().toISOString().split('T')[0],
      growthStage: '',
      plantHeight: '',
      healthStatus: 'Healthy',
      estimatedYield: '',
      weatherImpact: '',
      notes: ''
    });
    setShowMonthlyReportModal(false);
    setSelectedCropForReport(null);
  };

  // Calculate crop rows for display
  const cropRows = useMemo(() => registeredCrops.map(c => {
    const daysFromPlanting = Math.floor((Date.now() - new Date(c.plantingDate)) / 86400000);
    const progress = calculateProgress(c.plantingDate, c.expectedHarvest);
    const latestReport = c.reports?.[c.reports.length - 1];
    return { 
      ...c, 
      daysFromPlanting, 
      progress, 
      latestHeight: latestReport?.plantHeight || '—'
    };
  }), [registeredCrops]);

  // Get all reports for reports tab
  const allReports = useMemo(() => {
    return registeredCrops.flatMap(crop => 
      crop.reports.map(report => ({
        ...report,
        cropType: crop.cropType,
        variety: crop.variety
      }))
    );
  }, [registeredCrops]);

  return (
    <>
      <Navbar />
      <div className="pt-[14vh] min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Farmer Dashboard - {farmerProfile.name}
            </h1>
            <p className="text-gray-600">{farmerProfile.location} • {farmerProfile.farmSize} hectares</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'crops', label: '🌱 Crops' },
              { id: 'reports', label: '📋 Reports' },
              { id: 'weather', label: '🌤️ Weather' },
              { id: 'guidelines', label: '📚 Guidelines' }
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === t.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50 shadow-sm'
                }`}>
                {t.label}
              </button>
            ))}
            <div className="ml-auto">
              <button onClick={() => setShowCropRegistrationModal(true)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                + Add Crop
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Active Crops</p>
                  <p className="text-2xl font-bold text-green-700">{registeredCrops.filter(c => c.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Progress</p>
                  <p className="text-2xl font-bold text-green-700">{Math.round(cropRows.reduce((a, b) => a + b.progress, 0) / cropRows.length) || 0}%</p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Reports Logged</p>
                  <p className="text-2xl font-bold text-green-700">{allReports.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Area</p>
                  <p className="text-2xl font-bold text-green-700">{registeredCrops.reduce((sum, c) => sum + parseFloat(c.area || 0), 0).toFixed(1)} ha</p>
                </div>
              </div>

              {/* Crop Overview Table */}
              <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-800">🌱 Crop Overview</h3>
                </div>
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">Crop</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-600">Stage</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-600">Progress</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-600">Area</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropRows.map(row => (
                      <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {row.cropType}
                          <span className="text-xs text-gray-400 ml-1">({row.variety})</span>
                        </td>
                        <td className="px-3 py-2 text-center text-sm">{row.currentStage}</td>
                        <td className="px-3 py-2 text-center">
                          <div className="w-full bg-gray-200 h-2 rounded-full">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: `${row.progress}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600 mt-1">{row.progress}%</span>
                        </td>
                        <td className="px-3 py-2 text-center text-sm">{row.area} ha</td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => { setSelectedCropForReport(row); setShowMonthlyReportModal(true); }}
                            className="text-blue-600 underline text-xs hover:text-blue-800">
                            Add Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Weather Summary */}
              <div className="bg-white border rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  🌤️ Today's Weather - {LOCATION.name}
                </h3>
                {weatherLoading && <p className="text-sm text-gray-600">Loading weather data...</p>}
                {weatherError && <p className="text-sm text-red-600">{weatherError}</p>}
                {weatherData?.current && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Temperature</p>
                      <p className="font-semibold text-lg">{Math.round(weatherData.current.temperature_2m)}°C</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Humidity</p>
                      <p className="font-semibold text-lg">{weatherData.current.relative_humidity_2m}%</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Precipitation</p>
                      <p className="font-semibold text-lg">{weatherData.current.precipitation} mm</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Wind</p>
                      <p className="font-semibold text-lg">{Math.round(weatherData.current.wind_speed_10m)} km/h</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Crops Tab */}
          {activeTab === 'crops' && (
            <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-800">🌱 All Registered Crops</h3>
              </div>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Crop Details</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Planting Date</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Progress</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Area</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Expected Yield</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cropRows.map(row => (
                    <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-800">{row.cropType}</div>
                        <div className="text-xs text-gray-500">{row.variety} • {row.currentStage}</div>
                      </td>
                      <td className="px-3 py-2 text-center text-sm">{row.plantingDate}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-200 h-2 rounded-full mr-2">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: `${row.progress}%` }}></div>
                          </div>
                          <span className="text-xs">{row.progress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center text-sm">{row.area} ha</td>
                      <td className="px-3 py-2 text-center text-sm">{row.expectedYield} kg</td>
                      <td className="px-3 py-2 text-center">
                        <button onClick={() => { setSelectedCropForReport(row); setShowMonthlyReportModal(true); }}
                          className="text-blue-600 underline text-xs hover:text-blue-800">
                          Add Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cropRows.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">🌱</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No crops registered</h3>
                  <p className="text-gray-600 mb-4">Start by registering your first crop</p>
                  <button onClick={() => setShowCropRegistrationModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Register First Crop
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-800">📋 All Crop Reports</h3>
              </div>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Report Date</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Crop</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Growth Stage</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Height (cm)</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Health Status</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Weather Impact</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {allReports.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)).map(r => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm font-medium">{r.reportDate}</td>
                      <td className="px-3 py-2 text-center text-sm">{r.cropType} ({r.variety})</td>
                      <td className="px-3 py-2 text-center text-sm">{r.growthStage}</td>
                      <td className="px-3 py-2 text-center text-sm">{r.plantHeight}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          r.healthStatus === 'Healthy' ? 'bg-green-100 text-green-700' :
                          r.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {r.healthStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-sm">{r.weatherImpact || '—'}</td>
                      <td className="px-3 py-2 text-sm max-w-xs truncate" title={r.notes}>{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allReports.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                  <p className="text-gray-600">Start tracking by adding your first crop report</p>
                </div>
              )}
            </div>
          )}

          {/* Weather Tab */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              {/* Current Weather */}
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    🌤️ Current Weather - {LOCATION.name}
                    {weatherLoading && <span className="text-xs text-gray-500">(Loading...)</span>}
                  </h3>
                </div>
                <div className="p-4">
                  {weatherError && (
                    <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
                      {weatherError}
                      <button onClick={fetchWeatherData} 
                        className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                        Retry
                      </button>
                    </div>
                  )}
                  
                  {!weatherData && !weatherLoading && (
                    <button onClick={fetchWeatherData} 
                      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Load Weather Data
                    </button>
                  )}
                  
                  {weatherData?.current && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-600">Metric</th>
                            <th className="px-3 py-2 text-center font-medium text-gray-600">Current Value</th>
                            <th className="px-3 py-2 text-center font-medium text-gray-600">Unit</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-3 py-2 font-medium">Temperature</td>
                            <td className="px-3 py-2 text-center text-lg font-semibold">{Math.round(weatherData.current.temperature_2m)}</td>
                            <td className="px-3 py-2 text-center">°C</td>
                            <td className="px-3 py-2 text-sm text-gray-600">{getWeatherDescription(weatherData.current.weather_code)}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-3 py-2 font-medium">Humidity</td>
                            <td className="px-3 py-2 text-center text-lg font-semibold">{weatherData.current.relative_humidity_2m}</td>
                            <td className="px-3 py-2 text-center">%</td>
                            <td className="px-3 py-2 text-sm text-gray-600">
                              {weatherData.current.relative_humidity_2m > 80 ? 'High humidity' : 
                               weatherData.current.relative_humidity_2m < 40 ? 'Low humidity' : 'Optimal humidity'}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-3 py-2 font-medium">Wind Speed</td>
                            <td className="px-3 py-2 text-center text-lg font-semibold">{Math.round(weatherData.current.wind_speed_10m)}</td>
                            <td className="px-3 py-2 text-center">km/h</td>
                            <td className="px-3 py-2 text-sm text-gray-600">
                              {weatherData.current.wind_speed_10m > 25 ? 'Strong winds' : 
                               weatherData.current.wind_speed_10m < 5 ? 'Calm' : 'Light breeze'}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-3 py-2 font-medium">Precipitation</td>
                            <td className="px-3 py-2 text-center text-lg font-semibold">{weatherData.current.precipitation}</td>
                            <td className="px-3 py-2 text-center">mm</td>
                            <td className="px-3 py-2 text-sm text-gray-600">
                              {weatherData.current.precipitation > 0 ? 'Currently raining' : 'No rain'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* 7-Day Forecast */}
              {weatherData?.daily && (
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-800">📅 7-Day Forecast</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Date</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-600">Weather</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-600">Max Temp</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-600">Min Temp</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-600">Rain</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Farming Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weatherData.daily.time.slice(0, 7).map((date, i) => (
                          <tr key={date} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                            <td className="px-3 py-2 text-center">
                              <span className="text-lg">{getWeatherIcon(weatherData.daily.weather_code[i])}</span>
                              <div className="text-xs text-gray-600">{getWeatherDescription(weatherData.daily.weather_code[i])}</div>
                            </td>
                            <td className="px-3 py-2 text-center font-semibold text-red-600">{Math.round(weatherData.daily.temperature_2m_max[i])}°</td>
                            <td className="px-3 py-2 text-center font-semibold text-blue-600">{Math.round(weatherData.daily.temperature_2m_min[i])}°</td>
                            <td className="px-3 py-2 text-center">
                              <span className="font-semibold">{weatherData.daily.precipitation_sum[i]} mm</span>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">
                              {weatherData.daily.precipitation_sum[i] > 10 ? 'Heavy rain - ensure drainage' :
                               weatherData.daily.temperature_2m_max[i] > 35 ? 'Hot weather - increase irrigation' :
                               'Good conditions for farming'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Soil Conditions */}
              {weatherData?.hourly && (
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-800">🌱 Soil Conditions (Current)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Soil Layer</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-600">Moisture (%)</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-600">Temperature (°C)</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-3 py-2 font-medium">Surface (0-1cm)</td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_moisture_0_to_1cm?.[0] ? (weatherData.hourly.soil_moisture_0_to_1cm[0] * 100).toFixed(1) : '—'}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_temperature_0cm?.[0] || '—'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {weatherData.hourly.soil_moisture_0_to_1cm?.[0] > 0.3 ? 'Well hydrated' : 'Needs watering'}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-3 py-2 font-medium">Shallow (1-3cm)</td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_moisture_1_to_3cm?.[0] ? (weatherData.hourly.soil_moisture_1_to_3cm[0] * 100).toFixed(1) : '—'}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_temperature_6cm?.[0] || '—'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {weatherData.hourly.soil_moisture_1_to_3cm?.[0] > 0.25 ? 'Good for seeds' : 'Too dry for planting'}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-3 py-2 font-medium">Root Zone (3-9cm)</td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_moisture_3_to_9cm?.[0] ? (weatherData.hourly.soil_moisture_3_to_9cm[0] * 100).toFixed(1) : '—'}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_temperature_18cm?.[0] || '—'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {weatherData.hourly.soil_moisture_3_to_9cm?.[0] > 0.2 ? 'Optimal for roots' : 'Deep watering needed'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <div className="space-y-6">
              {/* Crop Guidelines Table */}
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-800">📚 Crop Growing Guidelines</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Crop Type</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-600">Planting Season</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-600">Growing Period</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-600">Water Needs</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-600">Expected Yield</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Key Tips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          crop: 'Rice (Palay)',
                          season: 'Jun-Oct (Wet), Nov-May (Dry)',
                          period: '120-150 days',
                          water: 'High (flooded)',
                          yield: '4-6 tons/ha',
                          tips: 'Monitor water levels, transplant after 21 days'
                        },
                        {
                          crop: 'Corn',
                          season: 'Mar-May, Oct-Dec',
                          period: '90-120 days',
                          water: 'Medium',
                          yield: '3-5 tons/ha',
                          tips: 'Hill up soil around plants, control borers'
                        },
                        {
                          crop: 'Tomato',
                          season: 'Oct-Mar',
                          period: '90-120 days',
                          water: 'Medium-High',
                          yield: '15-25 tons/ha',
                          tips: 'Stake plants, regular pruning needed'
                        },
                        {
                          crop: 'Eggplant',
                          season: 'Year-round',
                          period: '90-150 days',
                          water: 'Medium',
                          yield: '10-20 tons/ha',
                          tips: 'Support heavy fruits, watch for pests'
                        }
                      ].map((guide, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-800">{guide.crop}</td>
                          <td className="px-3 py-2 text-center text-sm">{guide.season}</td>
                          <td className="px-3 py-2 text-center text-sm">{guide.period}</td>
                          <td className="px-3 py-2 text-center text-sm">{guide.water}</td>
                          <td className="px-3 py-2 text-center text-sm">{guide.yield}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{guide.tips}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Calendar */}
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-800">📅 Filipino Farming Calendar</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Month</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Season</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Plant</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Harvest</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Farm Activities</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { month: 'January', season: 'Dry Season', plant: 'Vegetables, Upland rice', harvest: 'Sweet potato', activities: 'Irrigation maintenance, pest control' },
                        { month: 'February', season: 'Dry Season', plant: 'Corn, Vegetables', harvest: 'Rice (irrigated)', activities: 'Land preparation for wet season' },
                        { month: 'March', season: 'Dry Season', plant: 'Corn, Root crops', harvest: 'Vegetables', activities: 'Nursery establishment' },
                        { month: 'April', season: 'Dry Season', plant: 'Vegetables', harvest: 'Corn', activities: 'Equipment repair, seed preparation' },
                        { month: 'May', season: 'Hot Dry', plant: 'Rice nursery', harvest: 'Vegetables', activities: 'Rice field preparation' },
                        { month: 'June', season: 'Wet Season Start', plant: 'Rice transplanting', harvest: 'Fruits', activities: 'Major planting season begins' }
                      ].map((cal, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-800">{cal.month}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{cal.season}</td>
                          <td className="px-3 py-2 text-sm text-green-700">{cal.plant}</td>
                          <td className="px-3 py-2 text-sm text-orange-700">{cal.harvest}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{cal.activities}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showCropRegistrationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">🌱 Register New Crop</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                      <select value={newCrop.cropType} onChange={(e) => setNewCrop({...newCrop, cropType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">Select crop type</option>
                        <option value="Rice">Rice (Palay)</option>
                        <option value="Corn">Corn</option>
                        <option value="Tomato">Tomato</option>
                        <option value="Eggplant">Eggplant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                      <input type="text" value={newCrop.variety} onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                        placeholder="e.g., IR64, Sweet variety"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Planting Date</label>
                      <input type="date" value={newCrop.plantingDate} onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area (hectares)</label>
                      <input type="number" step="0.1" value={newCrop.area} onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                        placeholder="e.g., 1.5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                <button onClick={() => setShowCropRegistrationModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddCrop}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Register Crop
                </button>
              </div>
            </div>
          </div>
        )}

        {showMonthlyReportModal && selectedCropForReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800">
                  📋 Add Report for {selectedCropForReport.cropType}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
                    <input type="date" value={newReport.reportDate} onChange={(e) => setNewReport({...newReport, reportDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
                      <select value={newReport.growthStage} onChange={(e) => setNewReport({...newReport, growthStage: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">Select stage</option>
                        <option value="Seedling">Seedling</option>
                        <option value="Vegetative">Vegetative</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Fruiting">Fruiting</option>
                        <option value="Maturity">Maturity</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plant Height (cm)</label>
                      <input type="number" value={newReport.plantHeight} onChange={(e) => setNewReport({...newReport, plantHeight: e.target.value})}
                        placeholder="e.g., 45"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea value={newReport.notes} onChange={(e) => setNewReport({...newReport, notes: e.target.value})}
                      placeholder="Observations, problems, treatments applied..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                <button onClick={() => setShowMonthlyReportModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Add Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
