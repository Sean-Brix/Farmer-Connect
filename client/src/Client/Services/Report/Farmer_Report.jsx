import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../../contexts/ThemeContext';
import { useMyCrops, useCreateCrop, useCreateReport } from './hooks/useFarmerSeedTrack.js';
import { useCropGuidelines } from './hooks/useCropGuidelines.js';
import Navbar from '../../Components/Navbar.jsx';
import StageProgressionUI from '../../Components/StageProgressionUI.jsx';
import CropCard from '../../Components/CropCard.jsx';

// Import data files (for category icons and farming calendar)
import cropGuidelinesData from '../../../data/cropGuidelinesData.json';

// Charts removed for farmer simplicity

export default function Farmer_Report() {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('crops');
  const [showCropRegistrationModal, setShowCropRegistrationModal] = useState(false);
  const [showMonthlyReportModal, setShowMonthlyReportModal] = useState(false);
  const [selectedCropForReport, setSelectedCropForReport] = useState(null);

  // E-library states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showCropDetail, setShowCropDetail] = useState(false);
  
  // Pagination states for guidelines
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 items per page for guidelines
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarView, setCalendarView] = useState('calendar');
  
  // Crop details states
  const [expandedCrop, setExpandedCrop] = useState(null);
  const [showDetailedReportModal, setShowDetailedReportModal] = useState(false);
  const [selectedReportCrop, setSelectedReportCrop] = useState(null);
  
  // New sidebar states for Reports tab
  const [selectedCropInSidebar, setSelectedCropInSidebar] = useState(null);
  const [selectedStageView, setSelectedStageView] = useState(null); // For viewing past reports

  // Stage comment system states
  const [showStageCommentModal, setShowStageCommentModal] = useState(false);
  const [selectedCropForComment, setSelectedCropForComment] = useState(null);
  const [stageCommentText, setStageCommentText] = useState('');
  const [stageComments, setStageComments] = useState([]); // Will fetch from backend later

  // Form states
  const [newCrop, setNewCrop] = useState({
    guidelineId: '',
    cropType: '',
    variety: '',
    plantingDate: '',
    area: '',
    currentStage: 'Seedling',
    notes: ''
  });
  
  // Selected guideline for showing details
  const [selectedGuideline, setSelectedGuideline] = useState(null);

  const [newReport, setNewReport] = useState({
    plantHeight: '',
    healthStatus: 'Healthy',
    weatherImpact: '',
    notes: '',
    // Monthly report specific fields
    pestsObserved: '',
    diseasesObserved: '',
    fertilizersApplied: '',
    pesticideApplications: '',
    irrigationFrequency: '',
    soilCondition: '',
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

  // TanStack Query for user account details and access control
  const { data: accountData, isLoading: accessLoading, error: accessError } = useQuery({
    queryKey: ['account-details'],
    queryFn: async () => {
      const response = await fetch('/api/account/details/me');
      if (!response.ok) {
        throw new Error('Failed to verify user access');
      }
      const data = await response.json();
      return data;
    },
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  // Determine user access level with fallback to localStorage demo role
  const userAccess = useMemo(() => {
    if (accountData?.access) {
      return accountData.access;
    }
    
    // Fallback to demo role from localStorage
    const demoRole = localStorage.getItem('demoRole');
    if (demoRole) {
      return demoRole === 'User'? 'User' : 'Admin';
    }
    
    return 'User'; // Default to User access
  }, [accountData]);

  // Fetch crop guidelines from API
  const { data: apiGuidelines, isLoading: guidelinesLoading, error: guidelinesError } = useCropGuidelines({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm
  });

  // Use API data if available, otherwise fall back to JSON for categories and calendar
  const guidelinesCrops = apiGuidelines || [];

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

  // Backup sample weather data for demonstration (when no internet)
  const sampleWeatherData = {
    current: {
      temperature_2m: 28.5,
      relative_humidity_2m: 75,
      precipitation: 0.2,
      weather_code: 2,
      wind_speed_10m: 12.3
    },
    daily: {
      time: [
        '2024-08-18',
        '2024-08-19',
        '2024-08-20',
        '2024-08-21',
        '2024-08-22',
        '2024-08-23',
        '2024-08-24'
      ],
      temperature_2m_max: [32.1, 30.5, 31.8, 29.7, 33.2, 31.4, 30.9],
      temperature_2m_min: [24.8, 23.9, 25.1, 24.2, 25.8, 24.6, 23.7],
      precipitation_sum: [2.1, 0.0, 5.7, 12.3, 0.8, 3.2, 1.4],
      weather_code: [2, 1, 3, 61, 2, 3, 1]
    },
    hourly: {
      soil_temperature_0cm: [26.8, 27.2, 26.5, 27.8, 26.1, 27.4, 26.9],
      soil_temperature_6cm: [25.3, 25.7, 25.1, 26.2, 24.8, 25.9, 25.4],
      soil_temperature_18cm: [24.1, 24.3, 23.9, 24.7, 23.6, 24.5, 24.0],
      soil_moisture_0_to_1cm: [0.32, 0.28, 0.41, 0.55, 0.26, 0.38, 0.33],
      soil_moisture_1_to_3cm: [0.28, 0.25, 0.36, 0.48, 0.23, 0.34, 0.29],
      soil_moisture_3_to_9cm: [0.24, 0.22, 0.31, 0.42, 0.21, 0.29, 0.25]
    }
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
      console.log('Using sample weather data for demonstration...');
      
      // Use sample data as fallback for demonstration
      setWeatherData(sampleWeatherData);
      setWeatherError(`Using sample data (Demo mode): ${error.message}`);
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

  // Reset pagination when search term or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Fetch messages when modal opens
  useEffect(() => {
    if (showStageCommentModal && selectedCropForComment) {
      fetchMessages();
    }
  }, [showStageCommentModal, selectedCropForComment]);

  // Fetch messages for selected crop
  const fetchMessages = async () => {
    if (!selectedCropForComment?.id) return;
    
    try {
      const response = await fetch(`/api/seed-track/crops/${selectedCropForComment.id}/messages?userId=${accountData?.id}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      if (data.success) {
        // Flatten messages with replies for display
        const formattedMessages = [];
        // Reverse to show oldest first (newest at bottom like chat)
        const reversedData = [...data.data].reverse();
        reversedData.forEach(msg => {
          formattedMessages.push({
            text: msg.message,
            isAdmin: msg.isAdminReply,
            createdAt: msg.createdAt,
            userId: msg.userId
          });
          // Add replies
          if (msg.replies && msg.replies.length > 0) {
            msg.replies.forEach(reply => {
              formattedMessages.push({
                text: reply.message,
                isAdmin: reply.isAdminReply,
                createdAt: reply.createdAt,
                userId: reply.userId
              });
            });
          }
        });
        setStageComments(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Submit new message
  const submitMessage = async () => {
    if (!stageCommentText.trim() || !selectedCropForComment?.id) return;
    
    try {
      const response = await fetch(`/api/seed-track/crops/${selectedCropForComment.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: stageCommentText,
          userId: accountData?.id // Pass userId explicitly
        })
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      const data = await response.json();
      if (data.success) {
        // Refresh messages
        await fetchMessages();
        setStageCommentText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Derive farmer profile from account data (fallbacks provided)
  const farmerProfile = useMemo(() => ({
    id: accountData?.id || 1,
    name: accountData?.firstName ? `${accountData.firstName} ${accountData.surname || ''}`.trim() : 'Juan Dela Cruz',
    location: accountData?.address || 'Tanza, Cavite',
    farmSize: 3.1,
    joinDate: accountData?.createdAt ? String(accountData.createdAt).slice(0,10) : '2024-01-15'
  }), [accountData]);

  // Farmer's registered crops fetched from backend
  const userId = accountData?.id;
  const { data: crops = [], isLoading: cropsLoading, error: cropsError } = useMyCrops(userId, { includeReports: true });
  const createCrop = useCreateCrop();
  const createReport = useCreateReport();
  const registeredCrops = crops || [];

  // Check if user can register more crops (max 3 active)
  const canRegisterNewCrop = useMemo(() => {
    const activeCropsCount = registeredCrops.filter(
      crop => crop.status !== 'Completed' && crop.status !== 'Archived'
    ).length;
    return activeCropsCount < 3;
  }, [registeredCrops]);

  const handleOpenCropRegistration = () => {
    if (!canRegisterNewCrop) {
      alert('You have reached the maximum of 3 active crops. Please complete or archive an existing crop before registering a new one.');
      return;
    }
    setShowCropRegistrationModal(true);
  };

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
      const reportDate = new Date(report.createdAt);
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

  const handleAddCrop = async () => {
    const finalVariety = newCrop.variety === '__custom__' ? newCrop.customVariety : newCrop.variety;
    
    if (!newCrop.guidelineId || !finalVariety || !newCrop.plantingDate) {
      alert('Please select a crop guideline, enter variety, and planting date');
      return;
    }

    // Calculate expected harvest from guideline stages
    let expectedHarvest = null;
    if (selectedGuideline && selectedGuideline.stages && selectedGuideline.stages.length > 0) {
      const plantingDate = new Date(newCrop.plantingDate);
      
      // Calculate total days from all stages
      let totalDays = 0;
      selectedGuideline.stages.forEach(stage => {
        if (stage.durationValue && stage.durationUnit) {
          const value = parseInt(stage.durationValue);
          if (stage.durationUnit === 'days') {
            totalDays += value;
          } else if (stage.durationUnit === 'weeks') {
            totalDays += value * 7;
          } else if (stage.durationUnit === 'months') {
            totalDays += value * 30;
          }
        }
      });
      
      // Add days to planting date
      expectedHarvest = new Date(plantingDate);
      expectedHarvest.setDate(expectedHarvest.getDate() + totalDays);
    }

    try {
      await createCrop.mutateAsync({
        userId,
        guidelineId: newCrop.guidelineId,
        cropType: newCrop.cropType,
        variety: finalVariety,
        plantingDate: newCrop.plantingDate,
        expectedHarvest: expectedHarvest ? expectedHarvest.toISOString().split('T')[0] : null,
        area: newCrop.area ? Number(newCrop.area) : null,
        expectedYield: newCrop.expectedYield ? Number(newCrop.expectedYield) : null,
        currentStage: 'Seedling', // Default to Seedling, will track by stage index later
        notes: newCrop.notes || null,
      });
    } catch (e) {
      console.error('Create crop failed:', e);
      // Show error message from backend if available
      const errorMessage = e.response?.data?.message || e.message || 'Failed to register crop.';
      alert(errorMessage);
      return;
    }

    setNewCrop({
      guidelineId: '',
      cropType: '',
      variety: '',
      plantingDate: '',
      area: '',
      expectedYield: '',
      currentStage: 'Seedling',
      notes: ''
    });
    setSelectedGuideline(null);
    setShowCropRegistrationModal(false);
  };

  const handleAddReport = async () => {
    if (!newReport.plantHeight) {
      alert('Please fill in plant height');
      return;
    }

    try {
      await createReport.mutateAsync({
        cropId: selectedCropForReport.id,
        plantHeight: newReport.plantHeight ? Number(newReport.plantHeight) : null,
        healthStatus: newReport.healthStatus || null,
        weatherImpact: newReport.weatherImpact || null,
        notes: newReport.notes || null,
        pestsObserved: newReport.pestsObserved || null,
        diseasesObserved: newReport.diseasesObserved || null,
        fertilizersApplied: newReport.fertilizersApplied || null,
        pesticideApplications: newReport.pesticideApplications || null,
        irrigationFrequency: newReport.irrigationFrequency || null,
        soilCondition: newReport.soilCondition || null,
        plannedActions: newReport.plannedActions || null,
        actualYield: newReport.actualYield ? Number(newReport.actualYield) : null,
        costs: newReport.costs || null,
        weatherSnapshot: weatherData?.current ? {
          temperature: weatherData.current.temperature_2m,
          humidity: weatherData.current.relative_humidity_2m,
          precipitation: weatherData.current.precipitation,
          windSpeed: weatherData.current.wind_speed_10m,
        } : null,
        userId,
      });
    } catch (e) {
      console.error('Create report failed:', e);
      alert('Failed to add report.');
      return;
    }

    setNewReport({
      plantHeight: '',
      healthStatus: 'Healthy',
      weatherImpact: '',
      notes: '',
      pestsObserved: '',
      diseasesObserved: '',
      fertilizersApplied: '',
      pesticideApplications: '',
      irrigationFrequency: '',
      soilCondition: '',
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
      
      {/* Loading State */}
      {accessLoading && (
        <div className="pt-[14vh] min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Verifying access permissions...</p>
          </div>
        </div>
      )}

      {/* Access Error State */}
      {accessError && !accessLoading && (
        <div className="pt-[14vh] min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="rounded-full bg-red-100 p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Access Error</h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{accessError.message || 'Unable to verify user access'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Non-User Access Restriction (Admin, etc.) */}
      {userAccess && userAccess !== 'User' && !accessLoading && !accessError && (
        <div className="pt-[14vh] min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center max-w-lg mx-auto px-6">
            <div className="rounded-full bg-blue-100 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Access Restricted</h2>
            <p className={`mb-2 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>This Farmer Report module is exclusively designed for farmers.</p>

            <div className="space-y-4">
              <a 
                href="/admin" 
                className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Go to Admin Dashboard
              </a>
              
              <div className="flex justify-center gap-4">
                <a 
                  href="/" 
                  className={`font-medium underline transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Return to Home
                </a>
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>•</span>
                {userAccess !== 'User' && 
                  <a 
                  href="/admin" 
                  className={`font-medium underline transition-colors duration-200 ${theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Admin Panel
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Farmer Dashboard Content - Only show for User access */}
      {userAccess === 'User' && !accessLoading && !accessError && (
      <div className={`pt-[14vh] min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-green-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Professional Header - EIC Style */}
          <div className="relative mb-8 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
            <span className="inline-flex items-center justify-center gap-3 w-full">
              <span className={`rounded-full p-2 ${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                <svg className={`w-9 h-9 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className={`text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Farmer Dashboard
              </span>
            </span>
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center gap-1">
                <span className="text-sm">📍</span>
                <span className="font-medium">{farmerProfile.location}</span>
              </div>
            </div>
          </div>

          {/* Divider between title and navigation */}
          <hr className="border-t border-gray-300 my-6 w-full max-w-5xl mx-auto" />

          {/* Professional Navigation Tabs - Integrated Design */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
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
                      : `border border-gray-200 shadow-sm transition-all duration-200 ${theme === 'dark' ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-green-400 hover:text-green-400' : 'bg-white text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700'}`
                  }`}
                >
                  <span className="text-base">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
              <button 
                onClick={handleOpenCropRegistration}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ml-4 ${
                  canRegisterNewCrop
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                }`}
                disabled={!canRegisterNewCrop}
              >
                <span className="text-lg">+</span>
                <span>Add Crop</span>
                {!canRegisterNewCrop && <span className="text-xs">(Max 3)</span>}
              </button>
            </div>
          </div>

          {/* My Crops Tab - Redesigned with Cards + Archive */}
          {activeTab === 'crops' && (
            <div className="space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`rounded-xl border-2 p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Active Crops</p>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {registeredCrops.filter(c => c.status === 'Active').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`rounded-xl border-2 p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl">🏞️</span>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Area</p>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {registeredCrops.filter(c => c.status === 'Active').reduce((sum, c) => sum + parseFloat(c.area || 0), 0).toFixed(1)} ha
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`rounded-xl border-2 p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-2xl">🌾</span>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Expected Yield</p>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {registeredCrops.filter(c => c.status === 'Active').reduce((sum, c) => sum + parseFloat(c.expectedYield || 0), 0).toFixed(0)} kg
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`rounded-xl border-2 p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Archived</p>
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {registeredCrops.filter(c => c.status !== 'Active').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Crops Section - Table View */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    🌱 My Crops
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {registeredCrops.filter(c => c.status === 'Active').length} crops in progress
                  </p>
                </div>

                {registeredCrops.filter(c => c.status === 'Active').length > 0 ? (
                  <div className={`rounded-xl border overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <table className="w-full">
                      <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>Crop</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>Variety</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>Current Stage</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>Progress</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>Area</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredCrops
                          .filter(c => c.status === 'Active')
                          .map((crop, idx) => (
                            <React.Fragment key={crop.id}>
                              {/* Main Row */}
                              <tr className={`border-t ${
                                theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'
                              } transition-colors`}>
                                <td className={`px-4 py-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                                    }`}>
                                      <span className="text-lg">🌱</span>
                                    </div>
                                    <span className="font-semibold">{crop.cropType}</span>
                                  </div>
                                </td>
                                <td className={`px-4 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {crop.variety}
                                </td>
                                <td className={`px-4 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {crop.currentStageName || 'N/A'}
                                </td>
                                <td className={`px-4 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                      theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      {crop.currentStageIndex + 1 || 1}/{crop.totalStages || '?'}
                                    </span>
                                  </div>
                                </td>
                                <td className={`px-4 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {crop.area} ha
                                </td>
                                <td className="px-4 py-4">
                                  <button
                                    onClick={() => {
                                      setSelectedCropInSidebar(crop);
                                      setActiveTab('reports');
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                      theme === 'dark'
                                        ? 'bg-green-900 text-green-200 hover:bg-green-800'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                  >
                                    📊 View Report
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={`rounded-xl border-2 border-dashed p-12 text-center ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <span className="text-6xl mb-4 block">🌱</span>
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      No Active Crops
                    </h3>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Start by registering your first crop to begin tracking
                    </p>
                    <button
                      onClick={() => setShowCropRegistrationModal(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      + Register First Crop
                    </button>
                  </div>
                )}
              </div>

              {/* Archived Crops Section */}
              {registeredCrops.filter(c => c.status !== 'Active').length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      📦 Archived Crops
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {registeredCrops.filter(c => c.status !== 'Active').length} completed crops
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredCrops
                      .filter(c => c.status !== 'Active')
                      .map(crop => (
                        <CropCard 
                          key={crop.id}
                          crop={crop}
                          theme={theme}
                          weatherData={weatherData}
                          isArchived={true}
                          onViewDetails={(selectedCrop) => {
                            setSelectedCropInSidebar(selectedCrop);
                            setActiveTab('reports');
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Reports Tab - Redesigned with Sidebar */}
          {activeTab === 'reports' && (
            <div className="flex gap-6 h-[calc(100vh-280px)]">
              {/* Left Sidebar - Crop List */}
              <div className={`w-80 flex-shrink-0 rounded-xl border overflow-hidden flex flex-col ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* Sidebar Header */}
                <div className={`px-4 py-4 border-b ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    🌱 Active Crops
                  </h3>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select a crop to view stage progression
                  </p>
                </div>

                {/* Crop List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {registeredCrops
                    .filter(crop => crop.guideline && crop.status === 'Active')
                    .map(crop => (
                      <button
                        key={crop.id}
                        onClick={() => {
                          setSelectedCropInSidebar(crop);
                          setSelectedStageView(null);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          selectedCropInSidebar?.id === crop.id
                            ? theme === 'dark'
                              ? 'bg-green-900 border-2 border-green-500'
                              : 'bg-green-50 border-2 border-green-500'
                            : theme === 'dark'
                            ? 'bg-gray-700 border-2 border-transparent hover:bg-gray-600'
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {/* Crop Icon & Name */}
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedCropInSidebar?.id === crop.id
                              ? 'bg-green-100'
                              : theme === 'dark'
                              ? 'bg-gray-600'
                              : 'bg-white'
                          }`}>
                            <span className="text-lg">🌱</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm truncate ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {crop.cropType}
                            </h4>
                            <p className={`text-xs truncate ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {crop.variety}
                            </p>
                          </div>
                        </div>

                        {/* Crop Details */}
                        <div className={`mt-2 pt-2 border-t grid grid-cols-2 gap-2 text-xs ${
                          theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                          <div>
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                              Area:
                            </span>
                            <span className={`ml-1 font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {crop.area} ha
                            </span>
                          </div>
                          <div>
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                              Stage:
                            </span>
                            <span className={`ml-1 font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {crop.currentStageIndex + 1}/{crop.guideline.stages.length}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className={`h-1.5 rounded-full overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            <div
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{
                                width: `${((crop.currentStageIndex + 1) / crop.guideline.stages.length) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      </button>
                    ))}

                  {/* Empty State */}
                  {registeredCrops.filter(crop => crop.guideline && crop.status === 'Active').length === 0 && (
                    <div className="text-center py-8 px-4">
                      <div className="text-4xl mb-3">🌾</div>
                      <p className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        No Active Crops
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        Register crops to track stages
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Stage Progression Details */}
              <div className="flex-1 overflow-y-auto">
                {selectedCropInSidebar ? (
                  <div className={`rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    {/* Crop Header */}
                    <div className={`px-6 py-4 border-b ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {selectedCropInSidebar.cropType} - {selectedCropInSidebar.variety}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Planted: {selectedCropInSidebar.plantingDate} • Area: {selectedCropInSidebar.area} ha
                            {selectedCropInSidebar.status !== 'Active' && (
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                                theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}>
                                {selectedCropInSidebar.status}
                              </span>
                            )}
                          </p>
                        </div>
                        {selectedCropInSidebar.guideline?.stages && (
                          <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                          }`}>
                            Stage {(selectedCropInSidebar.currentStageIndex || 0) + 1} of {selectedCropInSidebar.guideline.stages.length}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stage Progression Component or Archived Crop Details */}
                    <div className="p-6">
                      {selectedCropInSidebar.guideline ? (
                        <StageProgressionUI 
                          crop={selectedCropInSidebar}
                          theme={theme}
                          onSubmitReport={(selectedCrop) => {
                            setSelectedCropForReport(selectedCrop);
                            setShowDetailedReportModal(true);
                          }}
                          onMessageAdmin={(selectedCrop) => {
                            setSelectedCropForComment(selectedCrop);
                            setShowStageCommentModal(true);
                          }}
                          onStageClick={(stageIndex) => {
                            setSelectedStageView(stageIndex);
                          }}
                        />
                      ) : (
                        /* Archived Crop Without Guideline */
                        <div className={`text-center py-12 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <div className="text-5xl mb-4">📦</div>
                          <h4 className={`text-lg font-semibold mb-2 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Archived Crop
                          </h4>
                          <p className="text-sm mb-4">
                            This crop was registered without a guideline or has been archived.
                          </p>
                          <div className={`inline-block text-left p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <div className="space-y-2 text-sm">
                              <div><strong>Status:</strong> {selectedCropInSidebar.status}</div>
                              <div><strong>Planting Date:</strong> {selectedCropInSidebar.plantingDate}</div>
                              {selectedCropInSidebar.expectedHarvest && (
                                <div><strong>Expected Harvest:</strong> {selectedCropInSidebar.expectedHarvest}</div>
                              )}
                              <div><strong>Area:</strong> {selectedCropInSidebar.area} hectares</div>
                              {selectedCropInSidebar.currentStage && (
                                <div><strong>Last Stage:</strong> {selectedCropInSidebar.currentStage}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Empty State - No Crop Selected */
                  <div className={`rounded-xl border h-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className="text-center py-16 px-8">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className={`text-xl font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Select a Crop
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Choose a crop from the sidebar to view its stage progression and submit reports
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Weather Tab */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              {/* Current Weather */}
              <div className={`border rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    🌤️ Current Weather - {LOCATION.name}
                    <button onClick={fetchWeatherData} 
                      className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                      {weatherLoading ? 'Loading...' : 'Refresh'}
                    </button>
                  </h3>
                </div>
                <div className="p-4">
                  {weatherError && (
                    <div className={`text-sm mb-4 p-3 rounded-lg ${
                      weatherError.includes('Demo mode') 
                        ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                        : 'text-red-600 bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {weatherError.includes('Demo mode') ? '🌐' : '⚠️'}
                        </span>
                        <span>{weatherError}</span>
                      </div>
                      <button onClick={fetchWeatherData} 
                        className={`ml-2 px-2 py-1 rounded text-xs mt-2 ${
                          weatherError.includes('Demo mode')
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}>
                        {weatherError.includes('Demo mode') ? 'Try Live Data' : 'Retry'}
                      </button>
                    </div>
                  )}
                  
                  {weatherData?.current && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                          <tr>
                            <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Metric</th>
                            <th className={`px-3 py-2 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Current Value</th>
                            <th className={`px-3 py-2 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Unit</th>
                            <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-3 py-2 font-medium">Temperature</td>
                            <td className="px-3 py-2 text-center text-lg font-semibold">{Math.round(weatherData.current.temperature_2m)}</td>
                            <td className="px-3 py-2 text-center">°C</td>
                            <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{getWeatherDescription(weatherData.current.weather_code)}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-3 py-2 font-medium">Humidity</td>
                            <td className="px-3 py-2 text-center text-lg font-semibold">{weatherData.current.relative_humidity_2m}</td>
                            <td className="px-3 py-2 text-center">%</td>
                            <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {weatherData.current.relative_humidity_2m > 80 ? 'High humidity' : 
                               weatherData.current.relative_humidity_2m < 40 ? 'Low humidity' : 'Optimal humidity'}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-3 py-2 font-medium">Wind Speed</td>
                            <td className="px-3 py-2 text-center text-lg font-semibold">{Math.round(weatherData.current.wind_speed_10m)}</td>
                            <td className="px-3 py-2 text-center">km/h</td>
                            <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {weatherData.current.wind_speed_10m > 25 ? 'Strong winds' : 
                               weatherData.current.wind_speed_10m < 5 ? 'Calm' : 'Light breeze'}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-3 py-2 font-medium">Precipitation</td>
                            <td className="px-3 py-2 text-center text-lg font-semibold">{weatherData.current.precipitation}</td>
                            <td className="px-3 py-2 text-center">mm</td>
                            <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                      <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading weather data...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 7-Day Forecast */}
              {weatherData?.daily && weatherData.daily.time && (
                <div className={`border rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>📅 7-Day Forecast</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                          <th className={`px-3 py-2 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Weather</th>
                          <th className={`px-3 py-2 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Max Temp</th>
                          <th className={`px-3 py-2 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Min Temp</th>
                          <th className={`px-3 py-2 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Rain</th>
                          <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Farming Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weatherData.daily.time.slice(0, 7).map((date, i) => (
                          <tr key={date} className={`border-b last:border-0 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <td className="px-3 py-2 font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                            <td className="px-3 py-2 text-center">
                              <span className="text-lg">{getWeatherIcon(weatherData.daily.weather_code[i])}</span>
                              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{getWeatherDescription(weatherData.daily.weather_code[i])}</div>
                            </td>
                            <td className="px-3 py-2 text-center font-semibold text-red-600">{Math.round(weatherData.daily.temperature_2m_max[i])}°</td>
                            <td className="px-3 py-2 text-center font-semibold text-blue-600">{Math.round(weatherData.daily.temperature_2m_min[i])}°</td>
                            <td className="px-3 py-2 text-center">
                              <span className="font-semibold">{weatherData.daily.precipitation_sum[i]} mm</span>
                            </td>
                            <td className={`px-3 py-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
                <div className={`border rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🌱 Soil Conditions (Current)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Soil Layer</th>
                          <th className={`px-3 py-2 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Moisture (%)</th>
                          <th className={`px-3 py-2 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Temperature (°C)</th>
                          <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
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
                          <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                          <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                          <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-3 text-sm border-2 rounded-lg bg-transparent focus:outline-none focus:border-green-500 transition-colors ${theme === 'dark' ? 'border-gray-500 text-white placeholder-gray-400 focus:border-green-400' : 'border-gray-400 text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full sm:w-64 px-4 py-3 text-sm border-2 rounded-lg bg-transparent focus:outline-none focus:border-green-500 transition-colors ${theme === 'dark' ? 'border-gray-500 text-white focus:border-green-400' : 'border-gray-400 text-gray-900'}`}
                >
                  <option value="all">All Categories</option>
                  {Object.entries(cropGuidelinesData.cropCategories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crops Library Grid - Equal Height Cards with Pagination */}
              <div className="space-y-4">
                {guidelinesLoading ? (
                  <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    Loading crop guidelines...
                  </div>
                ) : guidelinesError ? (
                  <div className={`text-center py-12 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                    <p className="mb-2">⚠️ Failed to load crop guidelines</p>
                    <p className="text-sm">{guidelinesError.message}</p>
                  </div>
                ) : (() => {
                  // Filter is already done by the API hook, but we can do client-side filtering for varieties
                  const filteredCrops = guidelinesCrops.filter(crop => {
                    if (!searchTerm) return true;
                    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        crop.varieties.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
                    return matchesSearch;
                  });

                  // Calculate pagination
                  const totalItems = filteredCrops.length;
                  const totalPages = Math.ceil(totalItems / itemsPerPage);
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const currentItems = filteredCrops.slice(startIndex, endIndex);

                  // Reset to page 1 if current page exceeds total pages
                  if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(1);
                  }

                  return (
                    <>
                      {/* Results summary */}
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} crops
                        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                        {currentItems.map(crop => (
                          <div key={crop.id} className={`border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="p-4 flex-1 flex flex-col">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0 mr-3">
                                  <h3 className={`font-semibold text-lg truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{crop.name}</h3>
                                  <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {cropGuidelinesData.cropCategories[crop.category]?.icon} {cropGuidelinesData.cropCategories[crop.category]?.name}
                                  </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Growing Period</div>
                                  <div className={`text-sm font-semibold whitespace-nowrap ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{crop.growingPeriod}</div>
                                </div>
                              </div>

                              <div className="space-y-2 text-sm flex-1">
                                <div className="flex justify-between items-center">
                                  <span className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Expected Yield:</span>
                                  <span className={`font-semibold truncate ml-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{crop.expectedYield}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Water Requirements:</span>
                                  <span 
                                    className={`font-semibold truncate ml-2 cursor-help ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                                    title={crop.waterRequirements}
                                  >
                                    {crop.waterRequirements.length > 20 ? 
                                      `${crop.waterRequirements.substring(0, 20)}...` : 
                                      crop.waterRequirements
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Difficulty:</span>
                                  <span className={`font-semibold flex-shrink-0 ml-2 ${
                                    crop.difficulty === 'Easy' ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') :
                                    crop.difficulty === 'Moderate' ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600') : 
                                    (theme === 'dark' ? 'text-red-400' : 'text-red-600')
                                  }`}>
                                    {crop.difficulty}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={`flex-shrink-0 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Market Price:</span>
                                  <span className={`font-semibold truncate ml-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>{crop.marketPrice}</span>
                                </div>
                              </div>

                              <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                                <div className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Key Varieties:</div>
                                <div className="flex flex-wrap gap-1 min-h-[24px]">
                                  {crop.varieties.slice(0, 3).map((variety, idx) => (
                                    <span key={idx} className={`px-2 py-1 rounded text-xs truncate max-w-[80px] ${theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                                      {variety}
                                    </span>
                                  ))}
                                  {crop.varieties.length > 3 && (
                                    <span className={`text-xs flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>+{crop.varieties.length - 3} more</span>
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
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 mt-6">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === 1 
                                ? (theme === 'dark' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                                : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200')
                            }`}
                          >
                            ← Previous
                          </button>
                          
                          {/* Page numbers */}
                          <div className="flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                              // Show current page, first, last, and pages around current
                              const showPage = page === 1 || page === totalPages || 
                                             (page >= currentPage - 1 && page <= currentPage + 1);
                              
                              if (!showPage) {
                                // Show ellipsis for gaps
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                  return (
                                    <span key={page} className={`px-2 py-1 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                      ...
                                    </span>
                                  );
                                }
                                return null;
                              }
                              
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === page
                                      ? 'bg-green-600 text-white'
                                      : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200')
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === totalPages 
                                ? (theme === 'dark' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                                : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200')
                            }`}
                          >
                            Next →
                          </button>
                        </div>
                      )}

                      {/* No results message */}
                      {filteredCrops.length === 0 && (
                        <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="text-4xl mb-2">🔍</div>
                          <div className="text-lg font-medium mb-1">No crops found</div>
                          <div className="text-sm">Try adjusting your search terms or category filter</div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Farming Calendar Reference */}
              <div className={`border rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>📅 Philippine Farming Calendar</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Month</th>
                        <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Season</th>
                        <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Planting Activities</th>
                        <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Harvest Activities</th>
                        <th className={`px-3 py-2 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Weather Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(cropGuidelinesData.farmingCalendar).map(([month, data]) => (
                        <tr key={month} className={`border-b last:border-0 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                          <td className={`px-3 py-2 font-medium capitalize ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{month}</td>
                          <td className="px-3 py-2 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${theme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                              {data.season}
                            </span>
                          </td>
                          <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                            {data.plantingActivities.join(', ')}
                          </td>
                          <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-orange-400' : 'text-orange-700'}`}>
                            {data.harvestActivities.join(', ')}
                          </td>
                          <td className={`px-3 py-2 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
            <div className={`rounded-xl shadow-2xl max-w-2xl w-full min-h-fit my-auto max-h-[calc(100vh-8rem)] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Modal Header */}
              <div className={`px-4 sm:px-6 py-4 border-b ${theme === 'dark' ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 border-gray-600' : 'bg-gradient-to-r from-green-50 to-green-100 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
                    <span className="text-white text-lg">🌱</span>
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Register New Crop</h3>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Add a new crop to your farming portfolio</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Guideline Selection */}
                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Select Crop Guideline * 
                      <span className="text-xs font-normal ml-2 text-gray-500">(Choose from available crop guidelines)</span>
                    </label>
                    {guidelinesLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                        <p className="text-xs text-gray-500 mt-2">Loading guidelines...</p>
                      </div>
                    ) : guidelinesError ? (
                      <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                        ⚠️ Failed to load guidelines. Please refresh the page.
                      </div>
                    ) : (
                      <select 
                        value={newCrop.guidelineId} 
                        onChange={(e) => {
                          const guidelineId = e.target.value;
                          const guideline = guidelinesCrops.find(g => g.id === guidelineId);
                          setSelectedGuideline(guideline);
                          setNewCrop({
                            ...newCrop, 
                            guidelineId,
                            cropType: guideline?.name || '',
                            variety: ''
                          });
                        }}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">-- Select a crop guideline --</option>
                        {guidelinesCrops?.map((guideline) => (
                          <option key={guideline.id} value={guideline.id}>
                            {guideline.name} ({guideline.category})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Guideline Info Preview */}
                  {selectedGuideline && (
                    <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'}`}>
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[140px]">Growing Period:</span>
                          <span>{selectedGuideline.growingPeriod}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[140px]">Expected Yield:</span>
                          <span>{selectedGuideline.expectedYield}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold min-w-[140px]">Growth Stages:</span>
                          <span>{selectedGuideline.stages?.length || 0} stages</span>
                        </div>
                        {selectedGuideline.stages && selectedGuideline.stages.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-green-300">
                            <div className="text-xs font-semibold mb-1">Stages Timeline:</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedGuideline.stages.map((stage, idx) => (
                                <span 
                                  key={idx}
                                  className={`px-2 py-1 rounded text-xs ${
                                    theme === 'dark' 
                                      ? 'bg-gray-600 text-gray-200' 
                                      : 'bg-white text-gray-700 border border-green-300'
                                  }`}
                                >
                                  {idx + 1}. {stage.stageName} ({stage.duration})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Variety Selection */}
                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Variety *
                      {selectedGuideline?.varieties && selectedGuideline.varieties.length > 0 && (
                        <span className="text-xs font-normal ml-2 text-gray-500">
                          (Suggested: {selectedGuideline.varieties.slice(0, 3).join(', ')})
                        </span>
                      )}
                    </label>
                    {selectedGuideline?.varieties && selectedGuideline.varieties.length > 0 ? (
                      <select 
                        value={newCrop.variety} 
                        onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="">-- Select variety --</option>
                        {selectedGuideline.varieties.map((variety, idx) => (
                          <option key={idx} value={variety}>{variety}</option>
                        ))}
                        <option value="__custom__">Other (specify below)</option>
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        value={newCrop.variety} 
                        onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                        placeholder="e.g., IR64, Sweet variety"
                        disabled={!selectedGuideline}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                    )}
                  </div>

                  {/* Custom Variety Input (if "Other" selected) */}
                  {newCrop.variety === '__custom__' && (
                    <div>
                      <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Custom Variety Name *
                      </label>
                      <input 
                        type="text" 
                        value={newCrop.customVariety || ''} 
                        onChange={(e) => setNewCrop({...newCrop, customVariety: e.target.value})}
                        placeholder="Enter your variety name"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Planting Date *</label>
                      <input 
                        type="date" 
                        value={newCrop.plantingDate} 
                        onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                        disabled={!selectedGuideline}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Area (hectares) *</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={newCrop.area} 
                        onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                        placeholder="e.g., 1.5"
                        disabled={!selectedGuideline}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Expected Yield (kg)
                      {selectedGuideline?.expectedYield && (
                        <span className="text-xs font-normal ml-2 text-gray-500">
                          (Guideline suggests: {selectedGuideline.expectedYield})
                        </span>
                      )}
                    </label>
                    <input 
                      type="number" 
                      value={newCrop.expectedYield} 
                      onChange={(e) => setNewCrop({...newCrop, expectedYield: e.target.value})}
                      placeholder="e.g., 5000"
                      disabled={!selectedGuideline}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Additional Notes</label>
                    <textarea 
                      value={newCrop.notes} 
                      onChange={(e) => setNewCrop({...newCrop, notes: e.target.value})}
                      placeholder="Any additional information about this crop..."
                      rows="2"
                      disabled={!selectedGuideline}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className={`px-4 sm:px-6 py-3 border-t flex flex-col sm:flex-row justify-end gap-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <button 
                  onClick={() => setShowCropRegistrationModal(false)}
                  className={`w-full sm:w-auto px-4 py-2 text-sm border rounded-lg transition-colors duration-200 font-medium ${theme === 'dark' ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}`}
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
            <div className={`rounded-xl shadow-2xl max-w-2xl w-full min-h-fit my-auto max-h-[calc(100vh-8rem)] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Modal Header */}
              <div className={`px-4 sm:px-6 py-3 border-b ${theme === 'dark' ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 border-gray-600' : 'bg-gradient-to-r from-green-50 to-green-100 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                    <span className="text-white text-sm">📋</span>
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      Add Report for {selectedCropForReport.cropType}
                    </h3>
                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Record progress and observations</p>
                  </div>
                </div>
              </div>
              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Plant Height (cm) *</label>
                    <input 
                      type="number" 
                      value={newReport.plantHeight} 
                      onChange={(e) => setNewReport({...newReport, plantHeight: e.target.value})}
                      placeholder="e.g., 45"
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Health Status</label>
                    <select 
                      value={newReport.healthStatus || 'Good'} 
                      onChange={(e) => setNewReport({...newReport, healthStatus: e.target.value})}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-xs sm:text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Observations & Notes</label>
                    <textarea 
                      value={newReport.notes} 
                      onChange={(e) => setNewReport({...newReport, notes: e.target.value})}
                      placeholder="Observations, problems, treatments applied..."
                      rows="3"
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
              {/* Modal Footer */}
              <div className={`px-4 sm:px-6 py-3 border-t flex flex-col sm:flex-row justify-end gap-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <button 
                  onClick={() => setShowMonthlyReportModal(false)}
                  className={`w-full sm:w-auto px-4 py-2 text-sm border rounded-lg transition-colors duration-200 font-medium ${theme === 'dark' ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}`}
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
            <div className={`rounded-xl shadow-2xl max-w-4xl w-full min-h-fit my-auto max-h-[calc(100vh-8rem)] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Modal Header */}
              <div className={`px-4 sm:px-6 py-3 border-b ${theme === 'dark' ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 border-gray-600' : 'bg-gradient-to-r from-green-50 to-green-100 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg shadow-sm">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Monthly Report - {selectedCropForReport.cropType}
                      </h3>
                      <p className={`text-xs sm:text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {selectedCropForReport.variety} • {selectedCropForReport.area} ha • Planted: {selectedCropForReport.plantingDate}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDetailedReportModal(false)}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:shadow-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'}`}
                  >
                    <span className="text-xl font-light">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                {/* Current Weather Integration */}
                {weatherData?.current && (
                  <div className={`mb-4 p-4 border rounded-xl ${theme === 'dark' ? 'bg-gradient-to-r from-gray-700/50 to-gray-600/50 border-gray-600' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-600 rounded-lg">
                        <span className="text-white text-xs">🌤️</span>
                      </div>
                      <h4 className={`text-sm sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Current Weather Conditions</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className={`p-2 rounded-lg border hover:shadow-sm transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Temperature</div>
                        <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{Math.round(weatherData.current.temperature_2m)}°C</div>
                      </div>
                      <div className={`p-3 rounded-lg border hover:shadow-sm transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Humidity</div>
                        <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{weatherData.current.relative_humidity_2m}%</div>
                      </div>
                      <div className={`p-3 rounded-lg border hover:shadow-sm transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Precipitation</div>
                        <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{weatherData.current.precipitation} mm</div>
                      </div>
                      <div className={`p-3 rounded-lg border hover:shadow-sm transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Wind Speed</div>
                        <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{Math.round(weatherData.current.wind_speed_10m)} km/h</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                        <span className="text-white text-sm">📋</span>
                      </div>
                      <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Basic Report Information</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Plant Height (cm) *</label>
                          <input 
                            type="number" 
                            value={newReport.plantHeight} 
                            onChange={(e) => setNewReport({...newReport, plantHeight: e.target.value})}
                            placeholder="e.g., 45"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Health Status</label>
                          <select 
                            value={newReport.healthStatus} 
                            onChange={(e) => setNewReport({...newReport, healthStatus: e.target.value})}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="Healthy">Healthy</option>
                            <option value="Warning">Warning</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Soil Condition</label>
                        <select 
                          value={newReport.soilCondition} 
                          onChange={(e) => setNewReport({...newReport, soilCondition: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
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

                  {/* Management Activities */}
                  <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                        <span className="text-white text-sm">🌿</span>
                      </div>
                      <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Management Activities</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pests Observed</label>
                        <input 
                          type="text" 
                          value={newReport.pestsObserved} 
                          onChange={(e) => setNewReport({...newReport, pestsObserved: e.target.value})}
                          placeholder="e.g., Aphids, Spider mites"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Diseases Observed</label>
                        <input 
                          type="text" 
                          value={newReport.diseasesObserved} 
                          onChange={(e) => setNewReport({...newReport, diseasesObserved: e.target.value})}
                          placeholder="e.g., Leaf spot, Powdery mildew"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fertilizers Applied</label>
                        <input 
                          type="text" 
                          value={newReport.fertilizersApplied} 
                          onChange={(e) => setNewReport({...newReport, fertilizersApplied: e.target.value})}
                          placeholder="e.g., NPK 14-14-14, 50kg"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pesticide Applications</label>
                        <input 
                          type="text" 
                          value={newReport.pesticideApplications} 
                          onChange={(e) => setNewReport({...newReport, pesticideApplications: e.target.value})}
                          placeholder="e.g., Insecticide spray for aphids"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Irrigation Frequency</label>
                        <select 
                          value={newReport.irrigationFrequency} 
                          onChange={(e) => setNewReport({...newReport, irrigationFrequency: e.target.value})}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
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
                <div className={`mt-8 p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                      <span className="text-white text-sm">📝</span>
                    </div>
                    <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Additional Information</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Planned Actions</label>
                      <textarea 
                        value={newReport.plannedActions} 
                        onChange={(e) => setNewReport({...newReport, plannedActions: e.target.value})}
                        placeholder="e.g., Apply growth booster, pest monitoring, harvest preparation..."
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Additional Notes</label>
                      <textarea 
                        value={newReport.notes} 
                        onChange={(e) => setNewReport({...newReport, notes: e.target.value})}
                        placeholder="Any other observations, treatments applied, or important notes..."
                        rows="4"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Tracking */}
                <div className={`mt-8 p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                      <span className="text-white text-sm">💰</span>
                    </div>
                    <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Monthly Costs (Optional)</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Seeds (₱)</label>
                      <input 
                        type="number" 
                        value={newReport.costs.seeds} 
                        onChange={(e) => setNewReport({...newReport, costs: {...newReport.costs, seeds: e.target.value}})}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fertilizer (₱)</label>
                      <input 
                        type="number" 
                        value={newReport.costs.fertilizer} 
                        onChange={(e) => setNewReport({...newReport, costs: {...newReport.costs, fertilizer: e.target.value}})}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pesticides (₱)</label>
                      <input 
                        type="number" 
                        value={newReport.costs.pesticides} 
                        onChange={(e) => setNewReport({...newReport, costs: {...newReport.costs, pesticides: e.target.value}})}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Labor (₱)</label>
                      <input 
                        type="number" 
                        value={newReport.costs.labor} 
                        onChange={(e) => setNewReport({...newReport, costs: {...newReport.costs, labor: e.target.value}})}
                        placeholder="0.00"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="flex items-center gap-1">
                      <span className="text-red-500">*</span>
                      Required fields. Weather data will be automatically included.
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                    <button 
                      onClick={() => setShowDetailedReportModal(false)}
                      className={`w-full sm:w-auto px-6 py-3 border rounded-lg transition-colors duration-200 font-medium ${
                        theme === 'dark' 
                          ? 'text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700' 
                          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                      }`}
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
            <div className={`rounded-xl shadow-2xl max-w-4xl w-full min-h-fit my-auto max-h-[calc(100vh-8rem)] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Modal Header */}
              <div className={`px-4 sm:px-6 py-3 border-b ${theme === 'dark' ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 border-gray-600' : 'bg-gradient-to-r from-green-50 to-green-100 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg shadow-sm">
                      <span className="text-white text-sm">
                        {cropGuidelinesData.cropCategories[selectedCrop.category]?.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {selectedCrop.name} - Complete Growing Guide
                      </h3>
                      <p className={`text-xs sm:text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Comprehensive farming guide and best practices
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCropDetail(false)}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:shadow-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'}`}
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
                      <h4 className={`font-semibold mb-2 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>📋 Basic Information</h4>
                      <div className={`p-3 rounded-lg space-y-2 text-xs sm:text-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="grid grid-cols-2 gap-2">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Category:</span>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{cropGuidelinesData.cropCategories[selectedCrop.category]?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Growing Period:</span>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedCrop.growingPeriod}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Expected Yield:</span>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{selectedCrop.expectedYield}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Difficulty:</span>
                          <span className={`font-semibold ${
                            selectedCrop.difficulty === 'Easy' ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') :
                            selectedCrop.difficulty === 'Moderate' ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600') : 
                            (theme === 'dark' ? 'text-red-400' : 'text-red-600')
                          }`}>{selectedCrop.difficulty}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Market Price:</span>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>{selectedCrop.marketPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🌱 Varieties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrop.varieties.map((variety, idx) => (
                          <span key={idx} className={`px-3 py-1 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'}`}>
                            {variety}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🌿 Growing Requirements</h4>
                      <div className={`p-4 rounded-lg space-y-2 text-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}><strong>Soil Type:</strong> {selectedCrop.soilType}</div>
                        <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}><strong>Climate:</strong> {selectedCrop.climate}</div>
                        <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}><strong>Spacing:</strong> {selectedCrop.spacing}</div>
                        <div className={`relative ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                          <strong>Water Requirements:</strong> 
                          <span 
                            className="ml-1 cursor-help"
                            title={selectedCrop.waterRequirements}
                          >
                            {selectedCrop.waterRequirements.length > 50 ? 
                              `${selectedCrop.waterRequirements.substring(0, 50)}...` : 
                              selectedCrop.waterRequirements
                            }
                          </span>
                        </div>
                        <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}><strong>Fertilizer:</strong> {selectedCrop.fertilizer}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>💡 Key Growing Tips</h4>
                      <ul className="space-y-2">
                        {selectedCrop.keyTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className={theme === 'dark' ? 'text-green-400 mt-1' : 'text-green-600 mt-1'}>•</span>
                            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🐛 Common Pests</h4>
                      <div className="space-y-2">
                        {selectedCrop.commonPests.map((pest, idx) => (
                          <div key={idx} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                            <div className={`font-semibold mb-1 ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>
                              {typeof pest === 'string' ? pest : pest.name}
                            </div>
                            {typeof pest === 'object' && pest.control && (
                              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-medium">Control: </span>{pest.control}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🦠 Common Diseases</h4>
                      <div className="space-y-2">
                        {selectedCrop.diseases.map((disease, idx) => (
                          <div key={idx} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-orange-900/30 border border-orange-800' : 'bg-orange-50 border border-orange-200'}`}>
                            <div className={`font-semibold mb-1 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-800'}`}>
                              {typeof disease === 'string' ? disease : disease.name}
                            </div>
                            {typeof disease === 'object' && disease.symptoms && (
                              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-medium">Symptoms: </span>{disease.symptoms}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>📅 Planting Seasons</h4>
                      <div className="space-y-1">
                        {selectedCrop.plantingSeasons.map((season, idx) => (
                          <div key={idx} className={`px-3 py-2 rounded text-sm font-semibold ${theme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                            {season}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Stages */}
                <div>
                  <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>🔄 Growth Stages & Timeline</h4>
                  <div className="overflow-x-auto">
                    <table className={`min-w-full text-sm border rounded-lg ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                      <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Stage</th>
                          <th className={`px-4 py-3 text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Duration</th>
                          <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Description</th>
                          <th className={`px-4 py-3 text-left font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Key Activities</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCrop.stages.map((stage, idx) => (
                          <tr key={idx} className={`border-t ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <td className={`px-4 py-3 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                              {stage.stageName || stage.stage || 'N/A'}
                            </td>
                            <td className={`px-4 py-3 text-center font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                              {stage.duration || 'N/A'}
                            </td>
                            <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {stage.description || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <ul className="space-y-1">
                                {(stage.activities && stage.activities.length > 0) ? (
                                  stage.activities.map((activity, actIdx) => (
                                    <li key={actIdx} className="flex items-start gap-2 text-sm">
                                      <span className={theme === 'dark' ? 'text-green-400 mt-1' : 'text-green-600 mt-1'}>•</span>
                                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{activity}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className={`text-sm italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    No activities listed
                                  </li>
                                )}
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
                  <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-50'}`}>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{selectedCrop.profitability}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Profitability Rating</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-50'}`}>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>{selectedCrop.marketPrice}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Current Market Price</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-50'}`}>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>{selectedCrop.expectedYield}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Expected Yield</div>
                  </div>
                </div>
              </div>

              <div className={`px-6 py-4 border-t flex justify-between ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  💡 Tip: Consider your local climate and soil conditions when following these guidelines
                </div>
                <button onClick={() => setShowCropDetail(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage Comment Modal */}
        {showStageCommentModal && selectedCropForComment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b ${
                theme === 'dark' ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 border-gray-600' : 'bg-gradient-to-r from-green-50 to-green-100 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      💬 Message with Admin
                    </h3>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedCropForComment.cropType} - {selectedCropForComment.variety} • Stage: {selectedCropForComment.currentStageName}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowStageCommentModal(false);
                      setStageCommentText('');
                    }}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                      theme === 'dark' ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-white/80'
                    }`}
                  >
                    <span className="text-xl font-light">&times;</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Comments Thread */}
                <div>
                  {stageComments.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {stageComments.map((comment, idx) => (
                        <div key={idx} className={`p-3 rounded-lg ${
                          comment.isAdmin 
                            ? theme === 'dark' ? 'bg-green-900/30 border-l-4 border-green-500' : 'bg-green-50 border-l-4 border-green-500'
                            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold">
                              {comment.isAdmin ? '👨‍💼 Admin' : '👤 You'}
                            </span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-6 text-center rounded-lg border-2 border-dashed ${
                      theme === 'dark' ? 'bg-gray-700/50 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-500'
                    }`}>
                      <span className="text-3xl block mb-2">💭</span>
                      <p className="text-sm">No comments yet. Start the conversation!</p>
                    </div>
                  )}
                </div>

                {/* New Message Form */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Your Message
                  </label>
                  <textarea
                    value={stageCommentText}
                    onChange={(e) => setStageCommentText(e.target.value)}
                    placeholder="Type your message to the admin here..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
                    } focus:outline-none focus:ring-2 focus:ring-green-500/50`}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t flex justify-end gap-3 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    setShowStageCommentModal(false);
                    setStageCommentText('');
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={submitMessage}
                  disabled={!stageCommentText.trim()}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    stageCommentText.trim()
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  📤 Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      )}

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
