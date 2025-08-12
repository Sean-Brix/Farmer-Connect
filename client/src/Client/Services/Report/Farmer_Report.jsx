import React, { useState, useEffect } from 'react';
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
import CropService from '../CropService';
import CropRegistration from '../../Components/CropRegistration';
import DetailedCropReportModal from '../../Components/DetailedCropReportModal.jsx';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [guidelinesCategory, setGuidelinesCategory] = useState('overview');
  const [guidelinesSearch, setGuidelinesSearch] = useState('');
  const [guidelinesFilter, setGuidelinesFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCropRegistrationModal, setShowCropRegistrationModal] = useState(false);
  const [showMonthlyReportModal, setShowMonthlyReportModal] = useState(false);
  const [selectedCropForReport, setSelectedCropForReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample farmer data (this would come from authentication)
  const [farmerProfile] = useState({
    id: 1,
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '+63 912 345 6789',
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
      actualYield: null,
      reports: [
        {
          id: 1,
          reportDate: '2024-01-30',
          growthStage: 'Germination',
          plantHeight: 15,
          healthStatus: 'Healthy',
          estimatedYield: 6500,
          pestsAndDiseases: 'None',
          weatherImpact: 'Favorable',
          notes: 'Seeds germinating well, uniform growth'
        },
        {
          id: 2,
          reportDate: '2024-02-28',
          growthStage: 'Tillering',
          plantHeight: 35,
          healthStatus: 'Healthy',
          estimatedYield: 6750,
          pestsAndDiseases: 'Minor leaf spot',
          weatherImpact: 'Good rainfall',
          notes: 'Good tillering progress, applied fertilizer'
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
      actualYield: null,
      reports: [
        {
          id: 3,
          reportDate: '2024-02-15',
          growthStage: 'Transplanting',
          plantHeight: 12,
          healthStatus: 'Healthy',
          estimatedYield: 12000,
          pestsAndDiseases: 'None',
          weatherImpact: 'Good',
          notes: 'Seedlings successfully transplanted'
        }
      ]
    }
  ]);

  // Handle new crop registration
  const handleCropRegistration = (cropData) => {
    const newCrop = {
      ...cropData,
      id: Date.now(),
      plantingDate: cropData.plantingDate,
      expectedHarvest: cropData.expectedHarvestDate,
      expectedYield: cropData.expectedYield,
      status: 'Active',
      currentStage: 'Seedling',
      reports: [],
      lastReportDate: null
    };

    setRegisteredCrops(prev => [...prev, newCrop]);
    alert('Crop registered successfully!');
  };

  // Handle monthly report submission
  const handleMonthlyReportSubmission = (reportData) => {
    setRegisteredCrops(prev => prev.map(crop => {
      if (crop.id === selectedCropForReport.id) {
        return {
          ...crop,
          reports: [...crop.reports, { ...reportData, id: Date.now() }],
          currentStage: reportData.growthStage,
          lastReportDate: reportData.reportDate
        };
      }
      return crop;
    }));

    setSelectedCropForReport(null);
    setShowMonthlyReportModal(false);
    alert('Monthly report submitted successfully!');
  };

  // Get expected report months for a crop
  const getExpectedReportMonths = (plantingDate, harvestDate) => {
    const months = [];
    const start = new Date(plantingDate);
    const end = new Date(harvestDate);
    
    const current = new Date(start);
    current.setDate(1); // First day of month
    
    while (current <= end) {
      months.push(current.toISOString().slice(0, 7));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  // Get farmer analytics
  const getFarmerAnalytics = () => {
    const totalCrops = registeredCrops.length;
    const activeCrops = registeredCrops.filter(crop => crop.status === 'Active').length;
    const totalReports = registeredCrops.reduce((sum, crop) => sum + crop.reports.length, 0);
    const totalExpectedYield = registeredCrops.reduce((sum, crop) => sum + crop.expectedYield, 0);
    const totalArea = registeredCrops.reduce((sum, crop) => sum + crop.area, 0);
    
    const healthyReports = registeredCrops.reduce((sum, crop) => {
      return sum + crop.reports.filter(r => r.healthStatus === 'Healthy').length;
    }, 0);
    
    const warningReports = registeredCrops.reduce((sum, crop) => {
      return sum + crop.reports.filter(r => r.healthStatus === 'Warning').length;
    }, 0);

    return {
      totalCrops,
      activeCrops,
      totalReports,
      totalExpectedYield,
      totalArea,
      healthyReports,
      warningReports,
      avgYieldPerHectare: totalArea > 0 ? Math.round(totalExpectedYield / totalArea) : 0
    };
  };

  // Helper functions for guidelines
  const toggleRowExpansion = (rowId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const getFilteredCropData = () => {
    let allCropData = [];
    
    CropService.getAllCropTypes().forEach(cropType => {
      const varieties = CropService.getCropVarieties(cropType);
      const seasons = CropService.getOptimalSeasons(cropType);
      const stages = CropService.getGrowthStages(cropType);
      
      varieties.forEach((variety, index) => {
        allCropData.push({
          id: `${cropType}-${index}`,
          cropType,
          variety,
          seasons,
          stages,
          optimalSeasons: Object.entries(seasons).filter(([_, info]) => info.optimal).map(([season, _]) => season),
          avgYield: variety.avgYield,
          maturityDays: variety.maturityDays
        });
      });
    });

    // Apply search filter
    if (guidelinesSearch) {
      allCropData = allCropData.filter(item => 
        item.cropType.toLowerCase().includes(guidelinesSearch.toLowerCase()) ||
        item.variety.name.toLowerCase().includes(guidelinesSearch.toLowerCase()) ||
        item.variety.description.toLowerCase().includes(guidelinesSearch.toLowerCase())
      );
    }

    // Apply category filter
    if (guidelinesFilter !== 'all') {
      allCropData = allCropData.filter(item => item.cropType === guidelinesFilter);
    }

    return allCropData;
  };

  // Pagination helpers
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength) => {
    return Math.ceil(dataLength / itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedRows(new Set()); // Reset expanded rows when changing pages
  };

  // Reset page when filters change
  const handleSearchChange = (value) => {
    setGuidelinesSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setGuidelinesFilter(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setGuidelinesCategory(category);
    setCurrentPage(1);
  };

  const analytics = getFarmerAnalytics();

  // Pagination Component
  const PaginationComponent = ({ totalItems, currentPage, onPageChange }) => {
    const totalPages = getTotalPages(totalItems);
    
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 px-6 py-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 rounded-b-xl">
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          <span className="font-medium">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-300 shadow-sm hover:shadow-md'
            }`}
          >
            ← Previous
          </button>
          
          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              {page}
            </button>
          ))}
          
          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-300 shadow-sm hover:shadow-md'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 lg:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                    <span className="text-2xl text-white">🌾</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      Farmer Dashboard
                    </h1>
                    <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-1"></div>
                  </div>
                </div>
                <p className="text-gray-600 text-lg">
                  Welcome back, <span className="font-semibold text-gray-800">{farmerProfile.name}</span>! 
                  Track your crops and submit monthly reports.
                </p>
              </div>
              <div className="lg:text-right">
                <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Farm Location</div>
                  <div className="font-bold text-gray-900 text-lg">{farmerProfile.location}</div>
                  <div className="text-sm text-gray-600 mt-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Farm Size: {farmerProfile.farmSize} hectares
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <nav className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-shrink-0 py-4 px-6 text-sm font-semibold border-b-3 transition-all duration-300 ${
                  activeTab === 'dashboard'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">📊</span>
                  <span>Dashboard</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('crops')}
                className={`flex-shrink-0 py-4 px-6 text-sm font-semibold border-b-3 transition-all duration-300 ${
                  activeTab === 'crops'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">🌱</span>
                  <span>My Crops</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex-shrink-0 py-4 px-6 text-sm font-semibold border-b-3 transition-all duration-300 ${
                  activeTab === 'reports'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">📋</span>
                  <span className="hidden sm:inline">Monthly</span>
                  <span>Reports</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`flex-shrink-0 py-4 px-6 text-sm font-semibold border-b-3 transition-all duration-300 ${
                  activeTab === 'guidelines'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">📚</span>
                  <span className="hidden sm:inline">Crop</span>
                  <span>Guidelines</span>
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                      <span className="text-2xl text-white">🌱</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{analytics.activeCrops}</h3>
                      <p className="text-sm text-gray-600 font-medium">Active Crops</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                      <span className="text-2xl text-white">📋</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{analytics.totalReports}</h3>
                      <p className="text-sm text-gray-600 font-medium">Total Reports</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                      <span className="text-2xl text-white">🌾</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{analytics.totalExpectedYield.toLocaleString()}</h3>
                      <p className="text-sm text-gray-600 font-medium">Expected Yield (kg)</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                      <span className="text-2xl text-white">📍</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{analytics.totalArea}</h3>
                      <p className="text-sm text-gray-600 font-medium">Total Area (ha)</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
              </div>
            </div>

            {/* Pending Reports Alert */}
            {registeredCrops.some(crop => CropService.isReportDue(crop)) && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl p-6 shadow-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <span className="text-2xl text-yellow-600">⚠️</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Monthly Reports Due</h3>
                    <p className="text-yellow-700 leading-relaxed">
                      You have crops that need monthly reports. Click on the "Monthly Reports" tab to submit your updates and keep your crop tracking current.
                    </p>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="mt-3 inline-flex items-center px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors duration-200 shadow-sm"
                    >
                      Go to Reports →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Crop Activity */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 lg:px-8 py-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3 text-2xl">🌿</span>
                  Recent Crop Activity
                </h3>
                <p className="text-gray-600 mt-1">Latest updates from your registered crops</p>
              </div>
              <div className="p-6 lg:p-8">
                <div className="space-y-6">
                  {registeredCrops.slice(0, 3).map(crop => {
                    const latestReport = crop.reports[crop.reports.length - 1];
                    return (
                      <div key={crop.id} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{crop.cropType} - {crop.variety}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Planted: {crop.plantingDate}
                              </div>
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Area: {crop.area} ha
                              </div>
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                Stage: {crop.currentStage}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end space-y-2">
                            <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                              latestReport?.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800 border border-green-200' :
                              latestReport?.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {latestReport?.healthStatus || 'No Report'}
                            </span>
                            {CropService.isReportDue(crop) && (
                              <span className="inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-medium">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                                Report Due
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {registeredCrops.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl text-gray-400">🌱</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No crops registered yet</h3>
                    <p className="text-gray-600 mb-6">Start tracking your crops by registering your first one</p>
                    <button
                      onClick={() => setActiveTab('crops')}
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                    >
                      Register First Crop →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="space-y-8">
            {/* Action Bar */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">My Registered Crops</h3>
                  <p className="text-gray-600">Manage and track your crop registration and progress</p>
                </div>
                <button
                  onClick={() => setShowCropRegistrationModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="mr-2 text-lg">+</span> 
                  Register New Crop
                </button>
              </div>
            </div>

            {/* Crops Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {registeredCrops.map(crop => {
                const expectedMonths = getExpectedReportMonths(crop.plantingDate, crop.expectedHarvest);
                const latestReport = crop.reports[crop.reports.length - 1];
                
                return (
                  <div key={crop.id} className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Crop Header */}
                    <div className="bg-gradient-to-r from-green-50 via-blue-50 to-green-50 px-6 lg:px-8 py-6 border-b border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-green-600 rounded-lg shadow-md">
                              <span className="text-xl text-white">🌾</span>
                            </div>
                            <div>
                              <h4 className="text-xl lg:text-2xl font-bold text-gray-900">{crop.cropType}</h4>
                              <p className="text-gray-600 font-medium">Variety: {crop.variety}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center text-gray-600">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Planted: {crop.plantingDate}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              Harvest: {crop.expectedHarvest}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              Area: {crop.area} ha
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start lg:items-end space-y-3">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                            crop.status === 'Active' ? 'bg-green-100 text-green-800 border border-green-200' :
                            crop.status === 'Harvested' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {crop.status}
                          </span>
                          <div className="text-sm">
                            <span className="text-gray-500 font-medium">Current Stage:</span>
                            <span className="ml-2 text-gray-800 font-semibold">{crop.currentStage}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Latest Report */}
                    {latestReport && (
                      <div className="px-6 lg:px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center">
                          <span className="mr-2 text-lg">📊</span>
                          Latest Report
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</div>
                            <div className="text-sm font-bold text-gray-900">{latestReport.reportDate}</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Height</div>
                            <div className="text-sm font-bold text-gray-900">{latestReport.plantHeight}cm</div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Health</div>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                              latestReport.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800 border border-green-200' :
                              latestReport.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {latestReport.healthStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expected Yield & Report Timeline */}
                    <div className="px-6 lg:px-8 py-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg px-4 py-3 border border-green-200">
                          <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Expected Yield</div>
                          <div className="text-xl font-bold text-green-800">{crop.expectedYield.toLocaleString()} kg</div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-4 py-3 border border-blue-200">
                          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Progress</div>
                          <div className="text-lg font-bold text-blue-800">{crop.reports.length} of {expectedMonths.length} reports</div>
                        </div>
                      </div>

                      {/* Report Timeline */}
                      <div className="mb-6">
                        <h6 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                          <span className="mr-2">📅</span>
                          Report Timeline
                        </h6>
                        <div className="flex flex-wrap gap-2">
                          {expectedMonths.map((month, index) => {
                            const hasReport = crop.reports.some(report => 
                              report.reportDate.startsWith(month)
                            );
                            const isCurrentMonth = month === new Date().toISOString().slice(0, 7);
                            const isPastMonth = month < new Date().toISOString().slice(0, 7);
                            
                            return (
                              <div 
                                key={month} 
                                className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all duration-200 ${
                                  hasReport 
                                    ? 'bg-green-100 text-green-800 border-green-300 shadow-sm' 
                                    : isCurrentMonth
                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm animate-pulse'
                                      : isPastMonth
                                        ? 'bg-red-100 text-red-800 border-red-300 shadow-sm'
                                        : 'bg-gray-100 text-gray-600 border-gray-300'
                                }`}
                                title={`${new Date(month + '-01').toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  year: 'numeric' 
                                })} - ${hasReport ? 'Report submitted' : 
                                       isCurrentMonth ? 'Current month' :
                                       isPastMonth ? 'Missing report' : 'Future report'}`}
                              >
                                {new Date(month + '-01').toLocaleDateString('en-US', { 
                                  month: 'short' 
                                })}
                                {hasReport ? ' ✓' : 
                                 isCurrentMonth ? ' 📍' :
                                 isPastMonth ? ' ⚠' : ' ⏳'}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Button */}
                      {CropService.isReportDue(crop) && (
                        <button
                          onClick={() => {
                            setSelectedCropForReport(crop);
                            setShowMonthlyReportModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-4 px-6 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                        >
                          <span className="mr-2 text-lg">📋</span>
                          Submit Detailed Crop Report
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {registeredCrops.length === 0 && (
                <div className="col-span-full">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 text-center py-16 px-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-100 to-green-100 rounded-full flex items-center justify-center mb-6">
                      <span className="text-4xl">🌱</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No crops registered yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                      Start your farming journey by registering your first crop. Track growth, submit reports, and monitor your harvest progress.
                    </p>
                    <button
                      onClick={() => setShowCropRegistrationModal(true)}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <span className="mr-2 text-lg">🌱</span>
                      Register Your First Crop
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <span className="text-2xl text-white">📋</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Monthly Report Submissions</h3>
                  <p className="text-gray-600">Track and submit your crop reports</p>
                </div>
              </div>
            
            {/* Pending Reports */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2 text-2xl">⏰</span>
                Pending Reports
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {registeredCrops.filter(crop => CropService.isReportDue(crop)).map(crop => (
                  <div key={crop.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-gray-900 mb-1">{crop.cropType} - {crop.variety}</h5>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          Area: {crop.area} ha
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <span className="text-2xl text-yellow-600">⏰</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCropForReport(crop);
                        setShowMonthlyReportModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                    >
                      <span className="mr-2 text-lg">📋</span>
                      Submit Detailed Report
                    </button>
                  </div>
                ))}
                
                {registeredCrops.filter(crop => CropService.isReportDue(crop)).length === 0 && (
                  <div className="col-span-full">
                    <div className="bg-white border-2 border-green-200 rounded-xl p-12 text-center shadow-lg">
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl text-green-600">✅</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">All reports are up to date!</h3>
                      <p className="text-gray-600">Great job keeping your crop reports current.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reports */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2 text-2xl">📊</span>
                Recent Report History
              </h4>
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {registeredCrops.flatMap(crop => 
                    crop.reports.map(report => ({...report, crop}))
                  ).sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)).slice(0, 10).map((report, index) => (
                    <div key={index} className="border-b border-gray-200 p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-gray-900 mb-2">{report.crop.cropType} - {report.crop.variety}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {report.reportDate}
                            </div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Stage: {report.growthStage}
                            </div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              Height: {report.plantHeight}cm
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border-2 ${
                          report.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800 border-green-200' :
                          report.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {report.healthStatus}
                        </span>
                      </div>
                      {report.notes && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed">{report.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 via-blue-50 to-green-50 px-6 lg:px-8 py-8 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                    <span className="text-2xl text-white">📚</span>
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Philippines Crop Growing Guidelines</h3>
                    <p className="text-gray-600 mt-1">Comprehensive farming guide for optimal crop production</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Available Varieties</div>
                  <div className="text-2xl font-bold text-green-600">{getFilteredCropData().length}</div>
                </div>
              </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="p-6 lg:p-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search Crops</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search crops, varieties, or descriptions..."
                      value={guidelinesSearch}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                    />
                    <svg
                      className="absolute left-4 top-4 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Type</label>
                  <select
                    value={guidelinesFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="all">All Crop Types</option>
                    {CropService.getAllCropTypes().map(cropType => (
                      <option key={cropType} value={cropType}>{cropType}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Guidelines Category Tabs */}
            <div className="px-6 lg:px-8 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200">
              <nav className="flex overflow-x-auto scrollbar-hide">
                {['overview', 'planting', 'growing'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`flex-shrink-0 py-4 px-6 border-b-3 font-semibold text-sm transition-all duration-300 ${
                      guidelinesCategory === category
                        ? 'border-green-500 text-green-600 bg-green-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {category === 'overview' && <><span className="text-lg">🌾</span><span>Crop Overview</span></>}
                      {category === 'planting' && <><span className="text-lg">🌱</span><span>Planting Guide</span></>}
                      {category === 'growing' && <><span className="text-lg">📈</span><span>Growth Stages</span></>}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tabular Guidelines Content */}
            <div className="overflow-x-auto">{/* Rest of guidelines content remains the same */}
              {guidelinesCategory === 'overview' && (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Crop & Variety</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Maturity</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Yield</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Optimal Season</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {(() => {
                          const filteredData = getFilteredCropData();
                          const paginatedData = getPaginatedData(filteredData);
                          
                          return paginatedData.map((item, index) => (
                            <React.Fragment key={item.id}>
                              <tr className={`hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                                      <span className="text-lg">🌾</span>
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-gray-900">{item.variety.name}</div>
                                      <div className="text-sm text-gray-600 font-medium">{item.cropType}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    {item.maturityDays} days
                                  </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <span className="text-sm font-bold text-gray-900">
                                    {CropService.formatYield(item.avgYield)}/ha
                                  </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                  <div className="flex flex-wrap gap-1">
                                    {item.optimalSeasons.map(season => (
                                      <span key={season} className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full border border-green-200">
                                        {season}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => toggleRowExpansion(item.id)}
                                    className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                      expandedRows.has(item.id)
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                                    }`}
                                  >
                                    {expandedRows.has(item.id) ? (
                                      <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                        Hide Details
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        View Details
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                              {expandedRows.has(item.id) && (
                                <tr>
                                  <td colSpan="5" className="px-6 py-6 bg-gradient-to-r from-gray-50 to-green-50 border border-gray-200">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                          <span className="mr-2 text-lg">📋</span>
                                          Variety Details
                                        </h4>
                                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{item.variety.description}</p>
                                        <div className="space-y-3">
                                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <span className="font-semibold text-gray-800">Resistance:</span>
                                            <span className="ml-2 text-gray-700">{item.variety.resistance || 'Standard'}</span>
                                          </div>
                                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <span className="font-semibold text-gray-800">Special Features:</span>
                                            <span className="ml-2 text-gray-700">{item.variety.features || 'N/A'}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                          <span className="mr-2 text-lg">🗓️</span>
                                          Seasonal Information
                                        </h4>
                                        <div className="space-y-3">
                                          {Object.entries(item.seasons).map(([season, info]) => (
                                            <div key={season} className={`p-4 rounded-lg border-2 ${info.optimal ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                              <div className="flex items-center justify-between mb-2">
                                                <div className={`font-bold ${info.optimal ? 'text-green-800' : 'text-gray-700'}`}>
                                                  {season} Season
                                                </div>
                                                {info.optimal && <span className="px-2 py-1 text-xs font-bold bg-green-200 text-green-800 rounded-full">OPTIMAL</span>}
                                              </div>
                                              <div className="text-sm space-y-1">
                                                <div className="text-gray-600">
                                                  <span className="font-medium">Period:</span> {info.start} - {info.end}
                                                </div>
                                                <div className="text-gray-600">{info.conditions}</div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination for Overview */}
                  <PaginationComponent
                    totalItems={getFilteredCropData().length}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}

              {guidelinesCategory === 'planting' && (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop & Variety</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Planting Season</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planting Window</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Harvest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const filteredData = getFilteredCropData();
                        const paginatedData = getPaginatedData(filteredData);
                        
                        return paginatedData.map((item) => {
                          const optimalSeason = Object.entries(item.seasons).find(([_, info]) => info.optimal);
                          return (
                            <React.Fragment key={item.id}>
                              <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{item.variety.name}</div>
                                      <div className="text-sm text-gray-500">{item.cropType}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {optimalSeason ? (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                      {optimalSeason[0]}
                                    </span>
                                  ) : (
                                    <span className="text-sm text-gray-500">Variable</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {optimalSeason ? `${optimalSeason[1].start} - ${optimalSeason[1].end}` : 'Year-round'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.maturityDays} days
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => toggleRowExpansion(item.id)}
                                    className="text-green-600 hover:text-green-900 flex items-center"
                                  >
                                    {expandedRows.has(item.id) ? (
                                      <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                        Hide
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        Details
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                              {expandedRows.has(item.id) && (
                                <tr>
                                  <td colSpan="5" className="px-6 py-4 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      {Object.entries(item.seasons).map(([season, info]) => (
                                        <div key={season} className={`p-4 rounded-lg border-2 ${info.optimal ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                          <h4 className={`font-semibold mb-2 ${info.optimal ? 'text-green-800' : 'text-gray-600'}`}>
                                            {season} Season
                                            {info.optimal && <span className="ml-2 text-xs px-2 py-1 bg-green-200 text-green-800 rounded">OPTIMAL</span>}
                                          </h4>
                                          <div className="text-sm space-y-1">
                                            <div><span className="font-medium">Planting:</span> {info.start}</div>
                                            <div><span className="font-medium">Harvest:</span> {info.end}</div>
                                            <div className="text-xs text-gray-600 mt-2">{info.conditions}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                  
                  {/* Pagination for Planting */}
                  <PaginationComponent
                    totalItems={getFilteredCropData().length}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}

              {guidelinesCategory === 'growing' && (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Growth Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Stages</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const filteredCropTypes = CropService.getAllCropTypes()
                          .filter(cropType => 
                            guidelinesFilter === 'all' || guidelinesFilter === cropType
                          )
                          .filter(cropType =>
                            !guidelinesSearch || cropType.toLowerCase().includes(guidelinesSearch.toLowerCase())
                          );
                        
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedCropTypes = filteredCropTypes.slice(startIndex, endIndex);
                        
                        return paginatedCropTypes.map((cropType) => {
                          const stages = CropService.getGrowthStages(cropType);
                          const totalDays = stages.reduce((sum, stage) => sum + stage.days, 0);
                          return (
                            <React.Fragment key={cropType}>
                              <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{cropType}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {totalDays} days
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-wrap gap-1">
                                    {stages.slice(0, 3).map((stage, index) => (
                                      <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {stage.stage}
                                      </span>
                                    ))}
                                    {stages.length > 3 && (
                                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                        +{stages.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => toggleRowExpansion(cropType)}
                                    className="text-green-600 hover:text-green-900 flex items-center"
                                  >
                                    {expandedRows.has(cropType) ? (
                                      <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                        Hide
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        Stages
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                              {expandedRows.has(cropType) && (
                                <tr>
                                  <td colSpan="4" className="px-6 py-4 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {stages.map((stage, index) => (
                                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                          <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-800">{stage.stage}</h4>
                                            <span className="text-sm text-gray-600">{stage.days} days</span>
                                          </div>
                                          <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                                          <div className="space-y-2">
                                            <div>
                                              <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Key Activities:</span>
                                              <ul className="mt-1 text-sm text-gray-600">
                                                {stage.activities.map((activity, actIndex) => (
                                                  <li key={actIndex} className="flex items-start">
                                                    <span className="text-green-500 mr-1">•</span>
                                                    {activity}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                            {stage.careInstructions && (
                                              <div>
                                                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Care Instructions:</span>
                                                <p className="mt-1 text-sm text-gray-600">{stage.careInstructions}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                  
                  {/* Pagination for Growing */}
                  <PaginationComponent
                    totalItems={CropService.getAllCropTypes()
                      .filter(cropType => 
                        guidelinesFilter === 'all' || guidelinesFilter === cropType
                      )
                      .filter(cropType =>
                        !guidelinesSearch || cropType.toLowerCase().includes(guidelinesSearch.toLowerCase())
                      ).length}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>

            {/* No results message */}
            {getFilteredCropData().length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.643-6.364-1.764"/>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No crops found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Crop Registration Modal */}
        <CropRegistration
          isOpen={showCropRegistrationModal}
          onClose={() => setShowCropRegistrationModal(false)}
          onCropRegistered={handleCropRegistration}
        />

        {/* Detailed Crop Report Modal */}
        <DetailedCropReportModal
          isOpen={showMonthlyReportModal}
          onClose={() => {
            setShowMonthlyReportModal(false);
            setSelectedCropForReport(null);
          }}
          crop={selectedCropForReport}
          onReportSubmitted={handleMonthlyReportSubmission}
        />
      </div>
    </div>
    </>
  );
}
