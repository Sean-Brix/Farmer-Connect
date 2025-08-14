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
  const [calendarView, setCalendarView] = useState('calendar');
  
  // Crop details states
  const [expandedCrop, setExpandedCrop] = useState(null);
  const [showDetailedReportModal, setShowDetailedReportModal] = useState(false);
  const [selectedReportCrop, setSelectedReportCrop] = useState(null);

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
    notes: '',
    // Monthly report specific fields
    pestsObserved: '',
    diseasesObserved: '',
    fertilizersApplied: '',
    pesticideApplications: '',
    irrigationFrequency: '',
    soilCondition: '',
    majorActivities: '',
    challenges: '',
    plannedActions: '',
    actualYield: '',
    costs: {
      seeds: '',
      fertilizer: '',
      pesticides: '',
      labor: '',
      irrigation: '',
      equipment: '',
      others: ''
    }
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

  const getReportStatus = (crop) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Check if farmer has submitted report for current month
    const hasCurrentMonthReport = crop.reports?.some(report => {
      const reportDate = new Date(report.reportDate);
      return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
    });
    
    const plantingDate = new Date(crop.plantingDate);
    const isActiveCrop = plantingDate <= now && crop.status === 'Active';
    
    if (!isActiveCrop) return 'not-required';
    if (hasCurrentMonthReport) return 'submitted';
    if (now.getDate() > 25) return 'overdue'; // Reports due by 25th of each month
    return 'pending';
  };

  const getNextReportDue = (crop) => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 25);
    return nextMonth.toISOString().split('T')[0];
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
      variety: selectedCropForReport.variety,
      submissionDate: new Date().toISOString(),
      weatherConditions: weatherData?.current ? {
        temperature: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        precipitation: weatherData.current.precipitation,
        windSpeed: weatherData.current.wind_speed_10m
      } : null
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
      notes: '',
      pestsObserved: '',
      diseasesObserved: '',
      fertilizersApplied: '',
      pesticideApplications: '',
      irrigationFrequency: '',
      soilCondition: '',
      majorActivities: '',
      challenges: '',
      plannedActions: '',
      actualYield: '',
      costs: {
        seeds: '',
        fertilizer: '',
        pesticides: '',
        labor: '',
        irrigation: '',
        equipment: '',
        others: ''
      }
    });
    setShowMonthlyReportModal(false);
    setShowDetailedReportModal(false);
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
          {/* Professional Header - EIC Style */}
          <div className="relative mb-8 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
            <span className="inline-flex items-center justify-center gap-3 w-full">
              <span className="rounded-full bg-green-100 p-2">
                <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                Farmer Dashboard
              </span>
            </span>
            <span className="block text-base md:text-lg text-gray-500 font-medium mt-1">
              Monitor your crops and farming activities - {farmerProfile.name}
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-sm">📍</span>
                <span className="font-medium">{farmerProfile.location}</span>
              </div>
              <span className="hidden sm:inline text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <span className="text-sm">🏞️</span>
                <span className="font-medium">{farmerProfile.farmSize} hectares</span>
              </div>
            </div>
          </div>

          {/* Divider between title and navigation */}
          <hr className="border-t border-gray-300 my-6 w-full max-w-5xl mx-auto" />

          {/* Professional Navigation Tabs - Integrated Design */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'crops', label: 'My Crops', icon: '🌱' },
                { id: 'reports', label: 'Reports', icon: '📋' },
                { id: 'weather', label: 'Weather', icon: '🌤️' },
                { id: 'guidelines', label: 'Guidelines', icon: '📚' }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === t.id
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700 shadow-sm'
                  }`}
                >
                  <span className="text-base">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
              <button 
                onClick={() => setShowCropRegistrationModal(true)} 
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl ml-4"
              >
                <span className="text-lg">+</span>
                <span>Add Crop</span>
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Professional Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <span className="text-xl">🌱</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">ACTIVE</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Active Crops</p>
                    <p className="text-3xl font-bold text-gray-800">{registeredCrops.filter(c => c.status === 'Active').length}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <span className="text-xl">📈</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">AVG</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Avg Progress</p>
                    <p className="text-3xl font-bold text-gray-800">{cropRows.length > 0 ? Math.round(cropRows.reduce((a, b) => a + b.progress, 0) / cropRows.length) : 0}<span className="text-lg text-gray-500">%</span></p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <span className="text-xl">📋</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">TOTAL</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Reports Logged</p>
                    <p className="text-3xl font-bold text-gray-800">{allReports.length}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <span className="text-xl">🏞️</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">AREA</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Area</p>
                    <p className="text-3xl font-bold text-gray-800">{registeredCrops.reduce((sum, c) => sum + parseFloat(c.area || 0), 0).toFixed(1)}<span className="text-lg text-gray-500"> ha</span></p>
                  </div>
                </div>
              </div>

              {/* Professional Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Crop Progress Chart */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                      <span className="text-xl">🌱</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Crop Progress Overview</h3>
                      <p className="text-sm text-gray-500">Track the growth progress of your crops</p>
                    </div>
                  </div>
                  {cropRows.length > 0 ? (
                    <div className="h-80">
                      <Bar
                        data={{
                          labels: cropRows.map(c => `${c.cropType}\n(${c.variety})`),
                          datasets: [{
                            label: 'Progress (%)',
                            data: cropRows.map(c => c.progress),
                            backgroundColor: cropRows.map((_, i) => {
                              const colors = [
                                'rgba(34, 197, 94, 0.8)',
                                'rgba(22, 163, 74, 0.8)', 
                                'rgba(21, 128, 61, 0.8)',
                                'rgba(134, 239, 172, 0.8)',
                                'rgba(187, 247, 208, 0.8)',
                                'rgba(74, 222, 128, 0.8)'
                              ];
                              return colors[i % colors.length];
                            }),
                            borderColor: cropRows.map((_, i) => {
                              const colors = [
                                'rgba(34, 197, 94, 1)',
                                'rgba(22, 163, 74, 1)', 
                                'rgba(21, 128, 61, 1)',
                                'rgba(134, 239, 172, 1)',
                                'rgba(187, 247, 208, 1)',
                                'rgba(74, 222, 128, 1)'
                              ];
                              return colors[i % colors.length];
                            }),
                            borderWidth: 2,
                            borderRadius: 12,
                            borderSkipped: false,
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleColor: '#fff',
                              bodyColor: '#fff',
                              borderColor: 'rgba(34, 197, 94, 1)',
                              borderWidth: 1,
                              cornerRadius: 8,
                              displayColors: false,
                              callbacks: {
                                title: function(context) {
                                  return context[0].label.split('\n')[0];
                                },
                                label: function(context) {
                                  return `Progress: ${context.parsed.y}%`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                borderColor: 'rgba(0, 0, 0, 0.1)'
                              },
                              ticks: {
                                color: '#6b7280',
                                font: {
                                  size: 12,
                                  weight: '500'
                                },
                                callback: function(value) {
                                  return value + '%';
                                }
                              }
                            },
                            x: {
                              grid: {
                                display: false
                              },
                              ticks: {
                                color: '#6b7280',
                                font: {
                                  size: 11,
                                  weight: '500'
                                },
                                maxRotation: 45
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-6xl mb-4 opacity-30">📊</div>
                        <p className="text-gray-500 font-medium">No crops data to display</p>
                        <p className="text-sm text-gray-400 mt-1">Add some crops to see progress charts</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Area Distribution Chart */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                      <span className="text-xl">🏞️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Land Area Distribution</h3>
                      <p className="text-sm text-gray-500">How your farmland is allocated</p>
                    </div>
                  </div>
                  {registeredCrops.length > 0 ? (
                    <div className="h-80">
                      <Doughnut
                        data={{
                          labels: registeredCrops.map(c => c.cropType),
                          datasets: [{
                            data: registeredCrops.map(c => parseFloat(c.area || 0)),
                            backgroundColor: [
                              'rgba(34, 197, 94, 0.85)',
                              'rgba(22, 163, 74, 0.85)',
                              'rgba(21, 128, 61, 0.85)',
                              'rgba(16, 185, 129, 0.85)',
                              'rgba(134, 239, 172, 0.85)',
                              'rgba(187, 247, 208, 0.85)'
                            ],
                            borderWidth: 4,
                            borderColor: '#fff',
                            hoverBorderWidth: 6,
                            hoverBorderColor: '#fff',
                            hoverBackgroundColor: [
                              'rgba(34, 197, 94, 0.95)',
                              'rgba(22, 163, 74, 0.95)',
                              'rgba(21, 128, 61, 0.95)',
                              'rgba(16, 185, 129, 0.95)',
                              'rgba(134, 239, 172, 0.95)',
                              'rgba(187, 247, 208, 0.95)'
                            ]
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: '60%',
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: {
                                  size: 12,
                                  weight: '500'
                                },
                                color: '#374151',
                                generateLabels: function(chart) {
                                  const data = chart.data;
                                  if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                      const dataset = data.datasets[0];
                                      const value = dataset.data[i];
                                      const total = dataset.data.reduce((a, b) => a + b, 0);
                                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                      return {
                                        text: `${label}: ${value} ha (${percentage}%)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: dataset.borderWidth,
                                        hidden: false,
                                        index: i
                                      };
                                    });
                                  }
                                  return [];
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleColor: '#fff',
                              bodyColor: '#fff',
                              borderColor: 'rgba(34, 197, 94, 1)',
                              borderWidth: 1,
                              cornerRadius: 8,
                              displayColors: true,
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || '';
                                  const value = context.parsed;
                                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                  return `${label}: ${value} ha (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-6xl mb-4 opacity-30">🏞️</div>
                        <p className="text-gray-500 font-medium">No area data to display</p>
                        <p className="text-sm text-gray-400 mt-1">Register crops to see area distribution</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Professional Charts Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Expected Yield Chart */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                      <span className="text-xl">📈</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Expected Yield Comparison</h3>
                      <p className="text-sm text-gray-500">Projected harvest yields for your crops</p>
                    </div>
                  </div>
                  {cropRows.length > 0 ? (
                    <div className="h-80">
                      <Line
                        data={{
                          labels: cropRows.map(c => c.cropType),
                          datasets: [{
                            label: 'Expected Yield (kg)',
                            data: cropRows.map(c => parseFloat(c.expectedYield || 0)),
                            borderColor: 'rgba(34, 197, 94, 1)',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 3,
                            pointRadius: 8,
                            pointHoverRadius: 10,
                            pointHoverBorderWidth: 4,
                            borderWidth: 3,
                            pointStyle: 'circle'
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleColor: '#fff',
                              bodyColor: '#fff',
                              borderColor: 'rgba(34, 197, 94, 1)',
                              borderWidth: 1,
                              cornerRadius: 8,
                              displayColors: false,
                              callbacks: {
                                title: function(context) {
                                  return context[0].label;
                                },
                                label: function(context) {
                                  return `Expected Yield: ${context.parsed.y} kg`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                borderColor: 'rgba(0, 0, 0, 0.1)'
                              },
                              ticks: {
                                color: '#6b7280',
                                font: {
                                  size: 12,
                                  weight: '500'
                                },
                                callback: function(value) {
                                  return value + ' kg';
                                }
                              }
                            },
                            x: {
                              grid: {
                                display: false
                              },
                              ticks: {
                                color: '#6b7280',
                                font: {
                                  size: 12,
                                  weight: '500'
                                }
                              }
                            }
                          },
                          interaction: {
                            intersect: false,
                            mode: 'index'
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-6xl mb-4 opacity-30">📈</div>
                        <p className="text-gray-500 font-medium">No yield data to display</p>
                        <p className="text-sm text-gray-400 mt-1">Add crop details to see yield projections</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Monthly Report Activity */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                      <span className="text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Monthly Report Activity</h3>
                      <p className="text-sm text-gray-500">Track your reporting consistency</p>
                    </div>
                  </div>
                  <div className="h-80">
                    <Bar
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                          label: 'Reports Submitted',
                          data: [12, 8, 15, 10, 6, 9],
                          backgroundColor: [
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(22, 163, 74, 0.8)',
                            'rgba(21, 128, 61, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(74, 222, 128, 0.8)',
                            'rgba(134, 239, 172, 0.8)'
                          ],
                          borderColor: [
                            'rgba(34, 197, 94, 1)',
                            'rgba(22, 163, 74, 1)',
                            'rgba(21, 128, 61, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(74, 222, 128, 1)',
                            'rgba(134, 239, 172, 1)'
                          ],
                          borderWidth: 2,
                          borderRadius: 12,
                          borderSkipped: false,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(34, 197, 94, 1)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                              title: function(context) {
                                return context[0].label;
                              },
                              label: function(context) {
                                return `Reports: ${context.parsed.y}`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                              borderColor: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                              color: '#6b7280',
                              font: {
                                size: 12,
                                weight: '500'
                              },
                              stepSize: 5
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            },
                            ticks: {
                              color: '#6b7280',
                              font: {
                                size: 12,
                                weight: '500'
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Crop Overview Table */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                      <span className="text-sm">🌱</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Crop Overview</h3>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Yield</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cropRows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-sm">🌱</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-800">{row.cropType}</div>
                                <div className="text-xs text-gray-500">({row.variety})</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                              {row.currentStage}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <div className="w-16 bg-gray-200 h-2 rounded-full mr-2">
                                <div className="h-2 rounded-full bg-green-500" style={{ width: `${row.progress}%` }}></div>
                              </div>
                              <span className="text-sm text-gray-600">{row.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-800">{row.area} ha</td>
                          <td className="px-6 py-4 text-center text-sm text-gray-800">{row.expectedYield} kg</td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {cropRows.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-30">🌱</div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No crops registered</h3>
                      <p className="text-gray-600 mb-6">Start by registering your first crop to see detailed overview</p>
                      <button 
                        onClick={() => setShowCropRegistrationModal(true)}
                        className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                      >
                        🌱 Register First Crop
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Crops Tab - Enhanced with Expandable Details */}
          {activeTab === 'crops' && (
            <div className="space-y-8">
              {/* Professional Crops Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <span className="text-xl">🌱</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">ACTIVE</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Active Crops</p>
                    <p className="text-3xl font-bold text-gray-800">{registeredCrops.filter(c => c.status === 'Active').length}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <span className="text-xl">🏞️</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">TOTAL</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Area</p>
                    <p className="text-3xl font-bold text-gray-800">{registeredCrops.reduce((sum, c) => sum + parseFloat(c.area || 0), 0).toFixed(1)}<span className="text-lg text-gray-500"> ha</span></p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <span className="text-xl">🌤️</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">LIVE</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Weather Status</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {weatherData?.current ? `${Math.round(weatherData.current.temperature_2m)}°C` : 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Detailed Crops Table */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                      <span className="text-sm">🌱</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Detailed Crop Management</h3>
                      <p className="text-sm text-gray-500">Monitor your crops with integrated weather data and reporting tools</p>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop Details</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Planting Info</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Yield</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Report Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cropRows.map(crop => {
                        const reportStatus = getReportStatus(crop);
                        const isExpanded = expandedCrop === crop.id;
                        return (
                          <React.Fragment key={crop.id}>
                            <tr className="border-b hover:bg-gray-50 cursor-pointer" 
                                onClick={() => setExpandedCrop(isExpanded ? null : crop.id)}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <button className="text-gray-400 hover:text-gray-600">
                                    {isExpanded ? '▼' : '▶'}
                                  </button>
                                  <div>
                                    <div className="font-medium text-gray-800">{crop.cropType}</div>
                                    <div className="text-xs text-gray-500">{crop.variety} • {crop.area} ha</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="text-sm">
                                  <div>Planted: {crop.plantingDate}</div>
                                  <div className="text-xs text-gray-500">Expected: {crop.expectedHarvest}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center">
                                  <div className="w-16 bg-gray-200 h-2 rounded-full mr-2">
                                    <div className="h-2 rounded-full bg-green-500" style={{ width: `${crop.progress}%` }}></div>
                                  </div>
                                  <span className="text-xs font-semibold">{crop.progress}%</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{crop.currentStage}</div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="font-semibold text-green-700">{crop.expectedYield} kg</div>
                                <div className="text-xs text-gray-500">
                                  {(crop.expectedYield / parseFloat(crop.area)).toFixed(0)} kg/ha
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                  reportStatus === 'submitted' ? 'bg-green-100 text-green-700' :
                                  reportStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  reportStatus === 'overdue' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {reportStatus === 'submitted' ? '✅ Current' :
                                   reportStatus === 'pending' ? '⏰ Due Soon' :
                                   reportStatus === 'overdue' ? '🚨 Overdue' : 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {weatherData?.current ? (
                                  <div className="text-xs">
                                    <div className="font-semibold">
                                      {weatherData.current.temperature_2m >= 20 && weatherData.current.temperature_2m <= 30 
                                        ? '🟢 Optimal' 
                                        : weatherData.current.temperature_2m > 30 
                                        ? '🟡 Too Hot' 
                                        : '🔵 Cool'}
                                    </div>
                                    <div className="text-gray-500">{Math.round(weatherData.current.temperature_2m)}°C</div>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-500">Loading...</div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center min-w-0">
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation();
                                      setSelectedCropForReport(crop); 
                                      setShowDetailedReportModal(true); 
                                    }}
                                    className="w-full sm:w-auto text-xs px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md"
                                  >
                                    📊 View Report
                                  </button>
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation();
                                      setSelectedCropForReport(crop); 
                                      setShowMonthlyReportModal(true); 
                                    }}
                                    className="w-full sm:w-auto text-xs px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-medium whitespace-nowrap shadow-sm hover:shadow-md"
                                  >
                                    📋 Add Report
                                  </button>
                                </div>
                              </td>
                            </tr>
                            
                            {/* Expanded Details Row */}
                            {isExpanded && (
                              <tr className="bg-gray-50 border-b">
                                <td colSpan="7" className="px-4 py-6">
                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Crop Details */}
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-gray-800 border-b pb-2">📋 Crop Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                          <span className="text-gray-600">Days Planted:</span>
                                          <span className="font-semibold">{crop.daysFromPlanting} days</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <span className="text-gray-600">Current Stage:</span>
                                          <span className="font-semibold">{crop.currentStage}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <span className="text-gray-600">Latest Height:</span>
                                          <span className="font-semibold">{crop.latestHeight} cm</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <span className="text-gray-600">Status:</span>
                                          <span className={`font-semibold ${crop.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
                                            {crop.status}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <span className="text-gray-600">Yield per Ha:</span>
                                          <span className="font-semibold text-green-700">
                                            {(crop.expectedYield / parseFloat(crop.area)).toFixed(0)} kg/ha
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Weather Integration */}
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-gray-800 border-b pb-2">🌤️ Weather Analysis</h4>
                                      {weatherData?.current ? (
                                        <div className="space-y-2 text-sm">
                                          <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Temperature:</span>
                                            <span className="font-semibold">{Math.round(weatherData.current.temperature_2m)}°C</span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Humidity:</span>
                                            <span className="font-semibold">{weatherData.current.relative_humidity_2m}%</span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Wind Speed:</span>
                                            <span className="font-semibold">{Math.round(weatherData.current.wind_speed_10m)} km/h</span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Precipitation:</span>
                                            <span className="font-semibold">{weatherData.current.precipitation} mm</span>
                                          </div>
                                          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                                            <div className="text-xs font-semibold text-blue-800">Weather Recommendation:</div>
                                            <div className="text-xs text-blue-700 mt-1">
                                              {weatherData.current.temperature_2m > 35 ? 'Consider additional irrigation due to high temperature' :
                                               weatherData.current.precipitation > 5 ? 'Monitor for water-logging and fungal diseases' :
                                               weatherData.current.relative_humidity_2m > 80 ? 'High humidity - watch for pest activity' :
                                               'Weather conditions are favorable for crop growth'}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-sm text-gray-500">Loading weather data...</div>
                                      )}
                                      
                                      {/* Soil conditions if available */}
                                      {weatherData?.hourly && (
                                        <div className="mt-4">
                                          <div className="text-xs font-semibold text-gray-700 mb-2">Soil Conditions:</div>
                                          <div className="space-y-1 text-xs">
                                            <div className="grid grid-cols-2 gap-2">
                                              <span className="text-gray-600">Surface Moisture:</span>
                                              <span className="font-semibold">
                                                {weatherData.hourly.soil_moisture_0_to_1cm?.[0] ? 
                                                  `${(weatherData.hourly.soil_moisture_0_to_1cm[0] * 100).toFixed(1)}%` : 'N/A'}
                                              </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              <span className="text-gray-600">Soil Temp:</span>
                                              <span className="font-semibold">
                                                {weatherData.hourly.soil_temperature_0cm?.[0] ? 
                                                  `${Math.round(weatherData.hourly.soil_temperature_0cm[0])}°C` : 'N/A'}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Recent Reports */}
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-gray-800 border-b pb-2">📊 Recent Reports</h4>
                                      {crop.reports && crop.reports.length > 0 ? (
                                        <div className="space-y-2">
                                          {crop.reports.slice(-3).reverse().map((report, idx) => (
                                            <div key={idx} className="bg-white p-3 rounded-lg border text-sm">
                                              <div className="flex justify-between items-start mb-2">
                                                <span className="font-semibold text-gray-800">{report.reportDate}</span>
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                  {report.growthStage}
                                                </span>
                                              </div>
                                              <div className="text-xs text-gray-600">
                                                Height: {report.plantHeight}cm • Status: {report.healthStatus}
                                              </div>
                                              {report.notes && (
                                                <div className="text-xs text-gray-500 mt-1 truncate">
                                                  {report.notes}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                          {crop.reports.length > 3 && (
                                            <div className="text-xs text-gray-500 text-center">
                                              +{crop.reports.length - 3} more reports
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-sm text-gray-500 text-center py-4">
                                          No reports submitted yet
                                        </div>
                                      )}
                                      
                                      <button 
                                        onClick={() => { 
                                          setSelectedCropForReport(crop); 
                                          setShowDetailedReportModal(true); 
                                        }}
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                                      >
                                        Add Monthly Report
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                  
                  {cropRows.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-4xl mb-4">🌱</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No crops registered</h3>
                      <p className="text-gray-600 mb-4">Start by registering your first crop</p>
                      <button onClick={() => setShowCropRegistrationModal(true)}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                        Register First Crop
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Weather-Based Crop Recommendations */}
              {weatherData?.current && (
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">🌤️ Weather-Based Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Current Conditions Impact</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>Temperature: {Math.round(weatherData.current.temperature_2m)}°C</div>
                        <div>Humidity: {weatherData.current.relative_humidity_2m}%</div>
                        <div className="text-xs mt-2">
                          {weatherData.current.temperature_2m > 30 ? 
                            '⚠️ High temperature - increase irrigation frequency' :
                            weatherData.current.temperature_2m < 15 ?
                            '🌡️ Cool weather - monitor cold-sensitive crops' :
                            '✅ Temperature is suitable for most crops'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Action Items</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        {weatherData.current.precipitation > 0 && <div>• Check drainage systems</div>}
                        {weatherData.current.relative_humidity_2m > 80 && <div>• Monitor for fungal diseases</div>}
                        {weatherData.current.wind_speed_10m > 20 && <div>• Secure tall plants and supports</div>}
                        {weatherData.current.temperature_2m > 35 && <div>• Provide shade for sensitive crops</div>}
                        <div>• Submit monthly reports by 25th</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab - Professional Layout */}
          {activeTab === 'reports' && (
            <div className="space-y-8">
              {/* Professional Reports Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-sm">
                      <span className="text-xl">⏰</span>
                    </div>
                    <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">PENDING</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Pending Reports</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {registeredCrops.filter(crop => getReportStatus(crop) === 'pending').length}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl shadow-sm">
                      <span className="text-xl">🚨</span>
                    </div>
                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">OVERDUE</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Overdue Reports</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {registeredCrops.filter(crop => getReportStatus(crop) === 'overdue').length}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                      <span className="text-xl">✅</span>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">COMPLETED</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Submitted This Month</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {registeredCrops.filter(crop => getReportStatus(crop) === 'submitted').length}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
                      <span className="text-xl">📋</span>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">TOTAL</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Reports</p>
                    <p className="text-3xl font-bold text-gray-800">{allReports.length}</p>
                  </div>
                </div>
              </div>

              {/* Professional Monthly Reporting Requirements */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                      <span className="text-sm">📋</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Monthly Reporting Status</h3>
                      <p className="text-sm text-gray-500">Reports are due by the 25th of each month for all active crops</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop Details</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stage</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Report Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Last Report</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Weather Info</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registeredCrops.map(crop => {
                        const status = getReportStatus(crop);
                        const lastReport = crop.reports && crop.reports.length > 0 
                          ? crop.reports[crop.reports.length - 1] 
                          : null;
                        return (
                          <tr key={crop.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <span className="text-sm">🌱</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-800">{crop.cropType}</div>
                                  <div className="text-xs text-gray-500">{crop.variety} • {crop.area} ha</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                {crop.currentStage}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                status === 'submitted' ? 'bg-green-100 text-green-800' :
                                status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {status === 'submitted' ? '✅ Submitted' :
                                 status === 'pending' ? '⏰ Pending' :
                                 status === 'overdue' ? '🚨 Overdue' : 'Not Required'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-sm text-gray-800">
                              {lastReport ? lastReport.reportDate : 'None'}
                            </td>
                            <td className="px-6 py-4 text-center text-sm text-gray-800">
                              {status !== 'not-required' ? getNextReportDue(crop) : '—'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {weatherData?.current ? (
                                <div className="text-xs">
                                  <div className="font-medium text-gray-800">{Math.round(weatherData.current.temperature_2m)}°C</div>
                                  <div className="text-gray-500">{weatherData.current.relative_humidity_2m}% RH</div>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">Loading...</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                {status === 'pending' || status === 'overdue' ? (
                                  <button 
                                    onClick={() => { 
                                      setSelectedCropForReport(crop); 
                                      setShowDetailedReportModal(true); 
                                    }}
                                    className={`inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 ${
                                      status === 'overdue' 
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md' 
                                        : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
                                    }`}
                                  >
                                    {status === 'overdue' ? 'Submit Now!' : 'Submit Report'}
                                  </button>
                                ) : status === 'submitted' ? (
                                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                    Complete
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">—</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Professional Calendar View */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                      <span className="text-sm">📅</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Monthly Report Calendar</h3>
                      <p className="text-sm text-gray-500">Track reporting deadlines and activities</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                        setCurrentMonth(newMonth);
                        setCurrentYear(newYear);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                    >
                      ‹
                    </button>
                    <span className="text-lg font-semibold text-gray-800 min-w-[140px] text-center">
                      {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => {
                        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
                        setCurrentMonth(newMonth);
                        setCurrentYear(newYear);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                    >
                      ›
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Modern Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">
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
                        const isToday = currentDate.toDateString() === new Date().toDateString();
                        const isDueDate = currentDate.getDate() === 25 && isCurrentMonth;
                        
                        // Get reports for this day
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
                          <div key={d} className={`min-h-[100px] p-1 border rounded ${
                            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                          } ${isToday ? 'ring-2 ring-blue-500' : ''} ${
                            isDueDate ? 'ring-2 ring-orange-500' : ''
                          }`}>
                            <div className={`text-sm font-semibold flex justify-between items-start ${
                              isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                              <span>{currentDate.getDate()}</span>
                              {isDueDate && (
                                <span className="text-xs bg-orange-500 text-white px-1 rounded">DUE</span>
                              )}
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
                            
                            {/* Weather info for today */}
                            {isToday && weatherData?.current && (
                              <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                🌤️ {Math.round(weatherData.current.temperature_2m)}°C
                              </div>
                            )}
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
                      <div className="w-4 h-4 bg-blue-100 rounded"></div>
                      <span>🌤️ Weather Info</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
                      <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-orange-500 rounded"></div>
                      <span>Report Due Date (25th)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Report Submission Trends */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">📊 Monthly Report Submission Trends</h3>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                          label: 'Reports Submitted',
                          data: [12, 8, 15, 10, 6, 9],
                          borderColor: 'rgba(34, 197, 94, 1)',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          tension: 0.4,
                          fill: true
                        }, {
                          label: 'Reports Due',
                          data: [15, 12, 18, 14, 10, 12],
                          borderColor: 'rgba(245, 158, 11, 1)',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
                </div>

                {/* Report Compliance Rate */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">📈 Report Compliance Rate</h3>
                  <div className="h-64">
                    <Doughnut
                      data={{
                        labels: ['Submitted On Time', 'Late Submissions', 'Pending'],
                        datasets: [{
                          data: [75, 15, 10],
                          backgroundColor: [
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
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

              {/* Crops Library Grid - Equal Height Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                {cropGuidelinesData.crops
                  .filter(crop => {
                    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        crop.varieties.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
                    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                  })
                  .map(crop => (
                    <div key={crop.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 mr-3">
                            <h3 className="font-semibold text-gray-800 text-lg truncate">{crop.name}</h3>
                            <p className="text-sm text-gray-600 truncate">
                              {cropGuidelinesData.cropCategories[crop.category]?.icon} {cropGuidelinesData.cropCategories[crop.category]?.name}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-gray-500">Growing Period</div>
                            <div className="text-sm font-semibold whitespace-nowrap">{crop.growingPeriod}</div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex-shrink-0">Expected Yield:</span>
                            <span className="font-semibold text-green-700 truncate ml-2">{crop.expectedYield}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex-shrink-0">Water Requirements:</span>
                            <span className="font-semibold truncate ml-2">{crop.waterRequirements}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex-shrink-0">Difficulty:</span>
                            <span className={`font-semibold flex-shrink-0 ml-2 ${
                              crop.difficulty === 'Easy' ? 'text-green-600' :
                              crop.difficulty === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {crop.difficulty}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex-shrink-0">Market Price:</span>
                            <span className="font-semibold text-blue-700 truncate ml-2">{crop.marketPrice}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-gray-500 mb-2">Key Varieties:</div>
                          <div className="flex flex-wrap gap-1 min-h-[24px]">
                            {crop.varieties.slice(0, 3).map((variety, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs truncate max-w-[80px]">
                                {variety}
                              </span>
                            ))}
                            {crop.varieties.length > 3 && (
                              <span className="text-gray-500 text-xs flex-shrink-0">+{crop.varieties.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Fixed Position Button */}
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => {
                            setSelectedCrop(crop);
                            setShowCropDetail(true);
                          }}
                          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                        >
                          📖 View Full Guide
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

        {/* Professional Modals */}
        {showCropRegistrationModal && (
          <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 pt-24 pb-8 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full min-h-fit my-auto max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
                    <span className="text-white text-lg">🌱</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Register New Crop</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Add a new crop to your farming portfolio</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Crop Type *</label>
                      <select 
                        value={newCrop.cropType} 
                        onChange={(e) => setNewCrop({...newCrop, cropType: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="">Select crop type</option>
                        <option value="Rice">Rice (Palay)</option>
                        <option value="Corn">Corn</option>
                        <option value="Tomato">Tomato</option>
                        <option value="Eggplant">Eggplant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Variety *</label>
                      <input 
                        type="text" 
                        value={newCrop.variety} 
                        onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                        placeholder="e.g., IR64, Sweet variety"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Planting Date *</label>
                      <input 
                        type="date" 
                        value={newCrop.plantingDate} 
                        onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Area (hectares) *</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={newCrop.area} 
                        onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                        placeholder="e.g., 1.5"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Expected Yield (kg)</label>
                      <input 
                        type="number" 
                        value={newCrop.expectedYield} 
                        onChange={(e) => setNewCrop({...newCrop, expectedYield: e.target.value})}
                        placeholder="e.g., 5000"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Current Stage</label>
                      <select 
                        value={newCrop.currentStage} 
                        onChange={(e) => setNewCrop({...newCrop, currentStage: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="Seedling">Seedling</option>
                        <option value="Vegetative">Vegetative</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Fruiting">Fruiting</option>
                        <option value="Maturity">Maturity</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Additional Notes</label>
                    <textarea 
                      value={newCrop.notes} 
                      onChange={(e) => setNewCrop({...newCrop, notes: e.target.value})}
                      placeholder="Any additional information about this crop..."
                      rows="2"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2">
                <button 
                  onClick={() => setShowCropRegistrationModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCrop}
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Register Crop
                </button>
              </div>
            </div>
          </div>
        )}

        {showMonthlyReportModal && selectedCropForReport && (
          <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 pt-24 pb-8 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full min-h-fit my-auto max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                    <span className="text-white text-sm">📋</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      Add Report for {selectedCropForReport.cropType}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">Record progress and observations</p>
                  </div>
                </div>
              </div>
              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Report Date *</label>
                      <input 
                        type="date" 
                        value={newReport.reportDate} 
                        onChange={(e) => setNewReport({...newReport, reportDate: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Growth Stage *</label>
                      <select 
                        value={newReport.growthStage} 
                        onChange={(e) => setNewReport({...newReport, growthStage: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="">Select stage</option>
                        <option value="Seedling">Seedling</option>
                        <option value="Vegetative">Vegetative</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Fruiting">Fruiting</option>
                        <option value="Maturity">Maturity</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Plant Height (cm)</label>
                      <input 
                        type="number" 
                        value={newReport.plantHeight} 
                        onChange={(e) => setNewReport({...newReport, plantHeight: e.target.value})}
                        placeholder="e.g., 45"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Health Status</label>
                      <select 
                        value={newReport.healthStatus || 'Good'} 
                        onChange={(e) => setNewReport({...newReport, healthStatus: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Observations & Notes</label>
                    <textarea 
                      value={newReport.notes} 
                      onChange={(e) => setNewReport({...newReport, notes: e.target.value})}
                      placeholder="Observations, problems, treatments applied..."
                      rows="2"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>
              {/* Modal Footer */}
              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2">
                <button 
                  onClick={() => setShowMonthlyReportModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddReport}
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Add Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Professional Detailed Monthly Report Modal */}
        {showDetailedReportModal && selectedCropForReport && (
          <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 pt-24 pb-8 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full min-h-fit my-auto max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg shadow-sm">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        Monthly Report - {selectedCropForReport.cropType}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {selectedCropForReport.variety} • {selectedCropForReport.area} ha • Planted: {selectedCropForReport.plantingDate}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDetailedReportModal(false)}
                    className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-white/80 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    <span className="text-xl font-light">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                {/* Current Weather Integration */}
                {weatherData?.current && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-600 rounded-lg">
                        <span className="text-white text-xs">🌤️</span>
                      </div>
                      <h4 className="text-sm sm:text-lg font-bold text-gray-800">Current Weather Conditions</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-2 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Temperature</div>
                        <div className="text-lg font-bold text-gray-800">{Math.round(weatherData.current.temperature_2m)}°C</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Humidity</div>
                        <div className="text-lg font-bold text-gray-800">{weatherData.current.relative_humidity_2m}%</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Precipitation</div>
                        <div className="text-lg font-bold text-gray-800">{weatherData.current.precipitation} mm</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Wind Speed</div>
                        <div className="text-lg font-bold text-gray-800">{Math.round(weatherData.current.wind_speed_10m)} km/h</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                        <span className="text-white text-sm">📋</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">Basic Report Information</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Report Date *</label>
                          <input 
                            type="date" 
                            value={newReport.reportDate} 
                            onChange={(e) => setNewReport({...newReport, reportDate: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Growth Stage *</label>
                          <select 
                            value={newReport.growthStage} 
                            onChange={(e) => setNewReport({...newReport, growthStage: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                          >
                            <option value="">Select stage</option>
                            <option value="Seedling">Seedling</option>
                            <option value="Vegetative">Vegetative</option>
                            <option value="Flowering">Flowering</option>
                            <option value="Fruiting">Fruiting</option>
                            <option value="Maturity">Maturity</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Plant Height (cm) *</label>
                          <input 
                            type="number" 
                            value={newReport.plantHeight} 
                            onChange={(e) => setNewReport({...newReport, plantHeight: e.target.value})}
                            placeholder="e.g., 45"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Health Status</label>
                          <select 
                            value={newReport.healthStatus} 
                            onChange={(e) => setNewReport({...newReport, healthStatus: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                          >
                            <option value="Healthy">Healthy</option>
                            <option value="Warning">Warning</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Yield (kg)</label>
                          <input 
                            type="number" 
                            value={newReport.estimatedYield} 
                            onChange={(e) => setNewReport({...newReport, estimatedYield: e.target.value})}
                            placeholder="e.g., 5000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Condition</label>
                          <select 
                            value={newReport.soilCondition} 
                            onChange={(e) => setNewReport({...newReport, soilCondition: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                          >
                            <option value="">Select condition</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Management Activities */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                        <span className="text-white text-sm">🌿</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">Management Activities</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pests Observed</label>
                        <input 
                          type="text" 
                          value={newReport.pestsObserved} 
                          onChange={(e) => setNewReport({...newReport, pestsObserved: e.target.value})}
                          placeholder="e.g., Aphids, Spider mites"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Diseases Observed</label>
                        <input 
                          type="text" 
                          value={newReport.diseasesObserved} 
                          onChange={(e) => setNewReport({...newReport, diseasesObserved: e.target.value})}
                          placeholder="e.g., Leaf spot, Powdery mildew"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fertilizers Applied</label>
                        <input 
                          type="text" 
                          value={newReport.fertilizersApplied} 
                          onChange={(e) => setNewReport({...newReport, fertilizersApplied: e.target.value})}
                          placeholder="e.g., NPK 14-14-14, 50kg"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pesticide Applications</label>
                        <input 
                          type="text" 
                          value={newReport.pesticideApplications} 
                          onChange={(e) => setNewReport({...newReport, pesticideApplications: e.target.value})}
                          placeholder="e.g., Insecticide spray for aphids"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Irrigation Frequency</label>
                        <select 
                          value={newReport.irrigationFrequency} 
                          onChange={(e) => setNewReport({...newReport, irrigationFrequency: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                        >
                          <option value="">Select frequency</option>
                          <option value="Daily">Daily</option>
                          <option value="Every 2 days">Every 2 days</option>
                          <option value="Weekly">Weekly</option>
                          <option value="As needed">As needed</option>
                          <option value="Rain-fed">Rain-fed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Sections */}
                <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                      <span className="text-white text-sm">📝</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">Additional Information</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Major Activities This Month</label>
                      <textarea 
                        value={newReport.majorActivities} 
                        onChange={(e) => setNewReport({...newReport, majorActivities: e.target.value})}
                        placeholder="e.g., Transplanting, weeding, fertilizer application..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Challenges Faced</label>
                      <textarea 
                        value={newReport.challenges} 
                        onChange={(e) => setNewReport({...newReport, challenges: e.target.value})}
                        placeholder="e.g., Pest infestation, drought stress, equipment issues..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Planned Actions for Next Month</label>
                      <textarea 
                        value={newReport.plannedActions} 
                        onChange={(e) => setNewReport({...newReport, plannedActions: e.target.value})}
                        placeholder="e.g., Apply growth booster, pest monitoring, harvest preparation..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
                      <textarea 
                        value={newReport.notes} 
                        onChange={(e) => setNewReport({...newReport, notes: e.target.value})}
                        placeholder="Any other observations, treatments applied, or important notes..."
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Tracking */}
                <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                      <span className="text-white text-sm">💰</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">Monthly Costs (Optional)</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Seeds (₱)</label>
                      <input 
                        type="number" 
                        value={newReport.costs.seeds} 
                        onChange={(e) => setNewReport({...newReport, costs: {...newReport.costs, seeds: e.target.value}})}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Fertilizer (₱)</label>
                      <input 
                        type="number" 
                        value={newReport.costs.fertilizer} 
                        onChange={(e) => setNewReport({...newReport, costs: {...newReport.costs, fertilizer: e.target.value}})}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Pesticides (₱)</label>
                      <input 
                        type="number" 
                        value={newReport.costs.pesticides} 
                        onChange={(e) => setNewReport({...newReport, costs: {...newReport.costs, pesticides: e.target.value}})}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Labor (₱)</label>
                      <input 
                        type="number" 
                        value={newReport.costs.labor} 
                        onChange={(e) => setNewReport({...newReport, costs: {...newReport.costs, labor: e.target.value}})}
                        placeholder="0.00"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="text-red-500">*</span>
                      Required fields. Weather data will be automatically included.
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                    <button 
                      onClick={() => setShowDetailedReportModal(false)}
                      className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddReport}
                      className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md"
                    >
                      Submit Monthly Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Professional Crop Detail Modal */}
        {showCropDetail && selectedCrop && (
          <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 pt-24 pb-8 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full min-h-fit my-auto max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg shadow-sm">
                      <span className="text-white text-sm">
                        {cropGuidelinesData.cropCategories[selectedCrop.category]?.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        {selectedCrop.name} - Complete Growing Guide
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Comprehensive farming guide and best practices
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCropDetail(false)}
                    className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-white/80 rounded-lg transition-all duration-200 hover:shadow-sm"
                  >
                    <span className="text-xl font-light">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">📋 Basic Information</h4>
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-xs sm:text-sm">
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
      <style>{
                 `
                 html, body, #root {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
                    display: none;
              } 
               `}
      </style>
    </>
  );
}
