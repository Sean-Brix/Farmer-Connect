import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import Navbar from '../../Components/Navbar.jsx';

// Import data files
import cropGuidelinesData from '../../../data/cropGuidelinesData.json';
import reportData from '../../../data/reportData.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

export default function Farmer_Report() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCropRegistrationModal, setShowCropRegistrationModal] = useState(false);
  const [showMonthlyReportModal, setShowMonthlyReportModal] = useState(false);
  const [selectedCropForReport, setSelectedCropForReport] = useState(null);

  // E-library states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showCropDetail, setShowCropDetail] = useState(false);
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarView, setCalendarView] = useState('month');

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
      console.log('Weather data fetched:', data);
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
    const latestReport = c.reports && c.reports.length > 0 ? c.reports[c.reports.length - 1] : null;
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
      crop.reports && crop.reports.length > 0 ? crop.reports.map(report => ({
        ...report,
        cropType: crop.cropType,
        variety: crop.variety
      })) : []
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Active Crops</p>
                      <p className="text-2xl font-bold text-green-700">{registeredCrops.filter(c => c.status === 'Active').length}</p>
                    </div>
                    <div className="text-2xl">🌱</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Progress</p>
                      <p className="text-2xl font-bold text-green-700">{cropRows.length > 0 ? Math.round(cropRows.reduce((a, b) => a + b.progress, 0) / cropRows.length) : 0}%</p>
                    </div>
                    <div className="text-2xl">📈</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Reports Logged</p>
                      <p className="text-2xl font-bold text-green-700">{allReports.length}</p>
                    </div>
                    <div className="text-2xl">📋</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total Area</p>
                      <p className="text-2xl font-bold text-green-700">{registeredCrops.reduce((sum, c) => sum + parseFloat(c.area || 0), 0).toFixed(1)} ha</p>
                    </div>
                    <div className="text-2xl">🏞️</div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Crop Progress Chart */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">🌱 Crop Progress Overview</h3>
                  {cropRows.length > 0 ? (
                    <div className="h-64">
                      <Bar
                        data={{
                          labels: cropRows.map(c => `${c.cropType} (${c.variety})`),
                          datasets: [{
                            label: 'Progress (%)',
                            data: cropRows.map(c => c.progress),
                            backgroundColor: 'rgba(34, 197, 94, 0.8)',
                            borderColor: 'rgba(34, 197, 94, 1)',
                            borderWidth: 1
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p>No crops data to display</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Area Distribution Chart */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">🏞️ Land Area Distribution</h3>
                  {registeredCrops.length > 0 ? (
                    <div className="h-64">
                      <Doughnut
                        data={{
                          labels: registeredCrops.map(c => c.cropType),
                          datasets: [{
                            data: registeredCrops.map(c => parseFloat(c.area || 0)),
                            backgroundColor: [
                              'rgba(34, 197, 94, 0.8)',
                              'rgba(59, 130, 246, 0.8)',
                              'rgba(245, 158, 11, 0.8)',
                              'rgba(239, 68, 68, 0.8)',
                              'rgba(139, 92, 246, 0.8)',
                              'rgba(236, 72, 153, 0.8)'
                            ],
                            borderWidth: 2,
                            borderColor: '#fff'
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🥧</div>
                        <p>No area data to display</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expected Yield Chart */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">📈 Expected Yield Comparison</h3>
                  {cropRows.length > 0 ? (
                    <div className="h-64">
                      <Line
                        data={{
                          labels: cropRows.map(c => c.cropType),
                          datasets: [{
                            label: 'Expected Yield (kg)',
                            data: cropRows.map(c => parseFloat(c.expectedYield || 0)),
                            borderColor: 'rgba(34, 197, 94, 1)',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            tension: 0.4,
                            fill: true
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📈</div>
                        <p>No yield data to display</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Monthly Report Trend */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">📊 Monthly Report Activity</h3>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                          label: 'Reports Submitted',
                          data: [12, 8, 15, 10, 6, 9],
                          backgroundColor: 'rgba(59, 130, 246, 0.8)',
                          borderColor: 'rgba(59, 130, 246, 1)',
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
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

              {/* Weather Summary */}
              <div className="bg-white border rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  🌤️ Today's Weather - {LOCATION.name}
                  <button onClick={fetchWeatherData} 
                    className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                    Refresh
                  </button>
                </h3>
                {weatherLoading && <p className="text-sm text-gray-600">Loading weather data...</p>}
                {weatherError && (
                  <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
                    {weatherError}
                    <button onClick={fetchWeatherData} 
                      className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                      Retry
                    </button>
                  </div>
                )}
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
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* View Toggle and Analytics */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalendarView('table')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      calendarView === 'table' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📋 Table View
                  </button>
                  <button
                    onClick={() => setCalendarView('calendar')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      calendarView === 'calendar' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📅 Calendar View
                  </button>
                </div>
                
                {/* Reports Analytics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="text-lg font-bold text-green-700">{allReports.length}</div>
                    <div className="text-xs text-gray-600">Total Reports</div>
                  </div>
                  <div className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="text-lg font-bold text-blue-700">
                      {new Set(allReports.map(r => r.cropType)).size}
                    </div>
                    <div className="text-xs text-gray-600">Crops Tracked</div>
                  </div>
                  <div className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="text-lg font-bold text-purple-700">
                      {Math.round(allReports.length / Math.max(registeredCrops.length, 1) * 10) / 10}
                    </div>
                    <div className="text-xs text-gray-600">Avg Reports/Crop</div>
                  </div>
                </div>
              </div>

              {/* Calendar View */}
              {calendarView === 'calendar' && (
                <div className="bg-white border rounded-lg shadow-sm">
                  <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">📅 Monthly Report Calendar</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                          const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                          setCurrentMonth(newMonth);
                          setCurrentYear(newYear);
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        ‹ Prev
                      </button>
                      <span className="font-semibold text-gray-800 min-w-[120px] text-center">
                        {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => {
                          const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                          const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
                          setCurrentMonth(newMonth);
                          setCurrentYear(newYear);
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        Next ›
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Day Headers */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded">
                          {day}
                        </div>
                      ))}
                      
                      {/* Calendar Days */}
                      {(() => {
                        const firstDay = new Date(currentYear, currentMonth, 1);
                        const lastDay = new Date(currentYear, currentMonth + 1, 0);
                        const startDate = new Date(firstDay);
                        startDate.setDate(startDate.getDate() - firstDay.getDay());
                        
                        const days = [];
                        for (let d = 0; d < 42; d++) {
                          const currentDate = new Date(startDate);
                          currentDate.setDate(startDate.getDate() + d);
                          
                          const isCurrentMonth = currentDate.getMonth() === currentMonth;
                          const dayReports = allReports.filter(report => {
                            const reportDate = new Date(report.reportDate);
                            return reportDate.toDateString() === currentDate.toDateString();
                          });
                          
                          // Get crops expected to be harvested this day
                          const harvestingCrops = registeredCrops.filter(crop => {
                            const harvestDate = new Date(crop.expectedHarvest);
                            return harvestDate.toDateString() === currentDate.toDateString();
                          });
                          
                          days.push(
                            <div key={d} className={`min-h-[80px] p-1 border rounded ${
                              isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                            } ${currentDate.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500' : ''}`}>
                              <div className={`text-sm font-semibold ${
                                isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                              }`}>
                                {currentDate.getDate()}
                              </div>
                              
                              {/* Report indicators */}
                              {dayReports.map((report, idx) => (
                                <div key={idx} className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded mb-1 truncate"
                                     title={`${report.cropType} - ${report.growthStage}`}>
                                  📋 {report.cropType}
                                </div>
                              ))}
                              
                              {/* Harvest indicators */}
                              {harvestingCrops.map((crop, idx) => (
                                <div key={idx} className="text-xs bg-orange-100 text-orange-800 px-1 py-0.5 rounded mb-1 truncate"
                                     title={`Expected harvest: ${crop.cropType}`}>
                                  🌾 {crop.cropType}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return days;
                      })()}
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 rounded"></div>
                        <span>📋 Report Submitted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-100 rounded"></div>
                        <span>🌾 Expected Harvest</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table View */}
              {calendarView === 'table' && (
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

              {/* Report Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Stage Distribution */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">📊 Growth Stage Distribution</h3>
                  {allReports.length > 0 ? (
                    <div className="h-64">
                      <Pie
                        data={{
                          labels: [...new Set(allReports.map(r => r.growthStage))],
                          datasets: [{
                            data: [...new Set(allReports.map(r => r.growthStage))].map(stage => 
                              allReports.filter(r => r.growthStage === stage).length
                            ),
                            backgroundColor: [
                              'rgba(34, 197, 94, 0.8)',
                              'rgba(59, 130, 246, 0.8)',
                              'rgba(245, 158, 11, 0.8)',
                              'rgba(239, 68, 68, 0.8)',
                              'rgba(139, 92, 246, 0.8)'
                            ]
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p>No reports data available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Plant Height Trends */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">📈 Plant Height Trends</h3>
                  {allReports.length > 0 ? (
                    <div className="h-64">
                      <Line
                        data={{
                          labels: allReports
                            .sort((a, b) => new Date(a.reportDate) - new Date(b.reportDate))
                            .map(r => new Date(r.reportDate).toLocaleDateString()),
                          datasets: [{
                            label: 'Plant Height (cm)',
                            data: allReports
                              .sort((a, b) => new Date(a.reportDate) - new Date(b.reportDate))
                              .map(r => parseFloat(r.plantHeight || 0)),
                            borderColor: 'rgba(34, 197, 94, 1)',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            tension: 0.4,
                            fill: true
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📈</div>
                        <p>No height data available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                    <button onClick={fetchWeatherData} 
                      className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                      {weatherLoading ? 'Loading...' : 'Refresh'}
                    </button>
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

                  {weatherLoading && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading weather data...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 7-Day Forecast */}
              {weatherData?.daily && weatherData.daily.time && (
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
                            {weatherData.hourly.soil_moisture_0_to_1cm && weatherData.hourly.soil_moisture_0_to_1cm[0] ? 
                              (weatherData.hourly.soil_moisture_0_to_1cm[0] * 100).toFixed(1) : '—'}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_temperature_0cm && weatherData.hourly.soil_temperature_0cm[0] || '—'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {weatherData.hourly.soil_moisture_0_to_1cm && weatherData.hourly.soil_moisture_0_to_1cm[0] > 0.3 ? 'Well hydrated' : 'Needs watering'}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-3 py-2 font-medium">Shallow (1-3cm)</td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_moisture_1_to_3cm && weatherData.hourly.soil_moisture_1_to_3cm[0] ? 
                              (weatherData.hourly.soil_moisture_1_to_3cm[0] * 100).toFixed(1) : '—'}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_temperature_6cm && weatherData.hourly.soil_temperature_6cm[0] || '—'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {weatherData.hourly.soil_moisture_1_to_3cm && weatherData.hourly.soil_moisture_1_to_3cm[0] > 0.25 ? 'Good for seeds' : 'Too dry for planting'}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-3 py-2 font-medium">Root Zone (3-9cm)</td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_moisture_3_to_9cm && weatherData.hourly.soil_moisture_3_to_9cm[0] ? 
                              (weatherData.hourly.soil_moisture_3_to_9cm[0] * 100).toFixed(1) : '—'}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold">
                            {weatherData.hourly.soil_temperature_18cm && weatherData.hourly.soil_temperature_18cm[0] || '—'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {weatherData.hourly.soil_moisture_3_to_9cm && weatherData.hourly.soil_moisture_3_to_9cm[0] > 0.2 ? 'Optimal for roots' : 'Deep watering needed'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Guidelines Tab - Enhanced E-Library */}
          {activeTab === 'guidelines' && (
            <div className="space-y-6">
              {/* Search and Filter Controls */}
              <div className="bg-white border rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search crops, varieties, or techniques..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(cropGuidelinesData.cropCategories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Overview */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                  {Object.entries(cropGuidelinesData.cropCategories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        selectedCategory === key
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <div className="text-xs font-semibold">{category.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Crops Library Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cropGuidelinesData.crops
                  .filter(crop => {
                    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        crop.varieties.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
                    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                  })
                  .map(crop => (
                    <div key={crop.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">{crop.name}</h3>
                            <p className="text-sm text-gray-600">
                              {cropGuidelinesData.cropCategories[crop.category]?.icon} {cropGuidelinesData.cropCategories[crop.category]?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Growing Period</div>
                            <div className="text-sm font-semibold">{crop.growingPeriod}</div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expected Yield:</span>
                            <span className="font-semibold text-green-700">{crop.expectedYield}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Water Requirements:</span>
                            <span className="font-semibold">{crop.waterRequirements}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Difficulty:</span>
                            <span className={`font-semibold ${
                              crop.difficulty === 'Easy' ? 'text-green-600' :
                              crop.difficulty === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {crop.difficulty}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Market Price:</span>
                            <span className="font-semibold text-blue-700">{crop.marketPrice}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-gray-500 mb-2">Key Varieties:</div>
                          <div className="flex flex-wrap gap-1">
                            {crop.varieties.slice(0, 3).map((variety, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {variety}
                              </span>
                            ))}
                            {crop.varieties.length > 3 && (
                              <span className="text-gray-500 text-xs">+{crop.varieties.length - 3} more</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCrop(crop);
                            setShowCropDetail(true);
                          }}
                          className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                        >
                          View Full Guide
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* Farming Calendar Reference */}
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-800">📅 Philippine Farming Calendar</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Month</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Season</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Planting Activities</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Harvest Activities</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Weather Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(cropGuidelinesData.farmingCalendar).map(([month, data]) => (
                        <tr key={month} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-800 capitalize">{month}</td>
                          <td className="px-3 py-2 text-sm">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                              {data.season}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm text-green-700">
                            {data.plantingActivities.join(', ')}
                          </td>
                          <td className="px-3 py-2 text-sm text-orange-700">
                            {data.harvestActivities.join(', ')}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">
                            {data.weatherConsiderations}
                          </td>
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

        {/* Crop Detail Modal */}
        {showCropDetail && selectedCrop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {cropGuidelinesData.cropCategories[selectedCrop.category]?.icon} {selectedCrop.name} - Complete Growing Guide
                </h3>
                <button onClick={() => setShowCropDetail(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">📋 Basic Information</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-semibold">{cropGuidelinesData.cropCategories[selectedCrop.category]?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Growing Period:</span>
                          <span className="font-semibold">{selectedCrop.growingPeriod}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Expected Yield:</span>
                          <span className="font-semibold text-green-700">{selectedCrop.expectedYield}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Difficulty:</span>
                          <span className={`font-semibold ${
                            selectedCrop.difficulty === 'Easy' ? 'text-green-600' :
                            selectedCrop.difficulty === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                          }`}>{selectedCrop.difficulty}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Market Price:</span>
                          <span className="font-semibold text-blue-700">{selectedCrop.marketPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">🌱 Varieties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrop.varieties.map((variety, idx) => (
                          <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {variety}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">🌿 Growing Requirements</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <div><strong>Soil Type:</strong> {selectedCrop.soilType}</div>
                        <div><strong>Climate:</strong> {selectedCrop.climate}</div>
                        <div><strong>Spacing:</strong> {selectedCrop.spacing}</div>
                        <div><strong>Water Requirements:</strong> {selectedCrop.waterRequirements}</div>
                        <div><strong>Fertilizer:</strong> {selectedCrop.fertilizer}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Key Growing Tips</h4>
                      <ul className="space-y-2">
                        {selectedCrop.keyTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">🐛 Common Pests</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrop.commonPests.map((pest, idx) => (
                          <span key={idx} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                            {pest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">🦠 Common Diseases</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrop.diseases.map((disease, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                            {disease}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">📅 Planting Seasons</h4>
                      <div className="space-y-1">
                        {selectedCrop.plantingSeasons.map((season, idx) => (
                          <div key={idx} className="bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm font-semibold">
                            {season}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Stages */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">🔄 Growth Stages & Timeline</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Stage</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-600">Duration</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-600">Key Activities</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCrop.stages.map((stage, idx) => (
                          <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-800">{stage.stage}</td>
                            <td className="px-4 py-3 text-center font-semibold text-blue-700">{stage.duration}</td>
                            <td className="px-4 py-3 text-gray-600">{stage.description}</td>
                            <td className="px-4 py-3">
                              <ul className="space-y-1">
                                {stage.activities.map((activity, actIdx) => (
                                  <li key={actIdx} className="flex items-start gap-2 text-sm">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Profitability Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{selectedCrop.profitability}</div>
                    <div className="text-sm text-gray-600">Profitability Rating</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{selectedCrop.marketPrice}</div>
                    <div className="text-sm text-gray-600">Current Market Price</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-700">{selectedCrop.expectedYield}</div>
                    <div className="text-sm text-gray-600">Expected Yield</div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
                <div className="text-sm text-gray-600">
                  💡 Tip: Consider your local climate and soil conditions when following these guidelines
                </div>
                <button onClick={() => setShowCropDetail(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
