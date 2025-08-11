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

  const analytics = getFarmerAnalytics();

  return (
    <>
      <Navbar />
      <div className="mt-[5%] min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">🌾</span>
                Farmer Crop Report Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {farmerProfile.name}! Track your crops and submit monthly reports.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Farm Location</div>
              <div className="font-semibold text-gray-800">{farmerProfile.location}</div>
              <div className="text-sm text-gray-600">Farm Size: {farmerProfile.farmSize} hectares</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('crops')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'crops'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🌱 My Crops
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'reports'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Monthly Reports
              </button>
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'guidelines'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 Crop Guidelines
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    🌱
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{analytics.activeCrops}</h3>
                    <p className="text-sm text-gray-600">Active Crops</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    📋
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{analytics.totalReports}</h3>
                    <p className="text-sm text-gray-600">Total Reports</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    🌾
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{analytics.totalExpectedYield.toLocaleString()}</h3>
                    <p className="text-sm text-gray-600">Expected Yield (kg)</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    📍
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{analytics.totalArea}</h3>
                    <p className="text-sm text-gray-600">Total Area (ha)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Reports Alert */}
            {registeredCrops.some(crop => CropService.isReportDue(crop)) && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-400">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Monthly Reports Due:</strong> You have crops that need monthly reports. 
                      Click on "Monthly Reports" tab to submit your updates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Crop Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Crop Activity</h3>
              <div className="space-y-4">
                {registeredCrops.slice(0, 3).map(crop => {
                  const latestReport = crop.reports[crop.reports.length - 1];
                  return (
                    <div key={crop.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{crop.cropType} - {crop.variety}</h4>
                          <p className="text-sm text-gray-600">
                            Planted: {crop.plantingDate} • Area: {crop.area} ha • Current Stage: {crop.currentStage}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            latestReport?.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                            latestReport?.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {latestReport?.healthStatus || 'No Report'}
                          </span>
                          {CropService.isReportDue(crop) && (
                            <div className="mt-1">
                              <span className="text-xs text-yellow-600 font-medium">Report Due</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crops' && (
          <div>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">My Registered Crops</h3>
              <button
                onClick={() => setShowCropRegistrationModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <span className="mr-2">+</span> Register New Crop
              </button>
            </div>

            {/* Crops Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {registeredCrops.map(crop => {
                const expectedMonths = getExpectedReportMonths(crop.plantingDate, crop.expectedHarvest);
                const latestReport = crop.reports[crop.reports.length - 1];
                
                return (
                  <div key={crop.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Crop Header */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">{crop.cropType}</h4>
                          <p className="text-gray-600">Variety: {crop.variety}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span>🌱 Planted: {crop.plantingDate}</span>
                            <span>🌾 Expected Harvest: {crop.expectedHarvest}</span>
                            <span>📍 Area: {crop.area} ha</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            crop.status === 'Active' ? 'bg-green-100 text-green-800' :
                            crop.status === 'Harvested' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {crop.status}
                          </span>
                          <div className="mt-2 text-sm text-gray-600">
                            Current: {crop.currentStage}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Latest Report */}
                    {latestReport && (
                      <div className="px-6 py-4 bg-gray-50 border-b">
                        <h5 className="font-semibold text-gray-800 mb-2">Latest Report</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <span className="ml-2 font-medium">{latestReport.reportDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Height:</span>
                            <span className="ml-2 font-medium">{latestReport.plantHeight}cm</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Health:</span>
                            <span className={`ml-2 font-medium ${
                              latestReport.healthStatus === 'Healthy' ? 'text-green-600' :
                              latestReport.healthStatus === 'Warning' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {latestReport.healthStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expected Yield & Report Timeline */}
                    <div className="px-6 py-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-gray-600">Expected Yield:</span>
                          <span className="ml-2 font-bold text-green-600">{crop.expectedYield.toLocaleString()} kg</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reports:</span>
                          <span className="ml-2 font-medium">{crop.reports.length} of {expectedMonths.length}</span>
                        </div>
                      </div>

                      {/* Report Timeline */}
                      <div className="mb-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Report Timeline</h6>
                        <div className="flex flex-wrap gap-1">
                          {expectedMonths.map((month, index) => {
                            const hasReport = crop.reports.some(report => 
                              report.reportDate.startsWith(month)
                            );
                            const isCurrentMonth = month === new Date().toISOString().slice(0, 7);
                            const isPastMonth = month < new Date().toISOString().slice(0, 7);
                            
                            return (
                              <div 
                                key={month} 
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  hasReport 
                                    ? 'bg-green-100 text-green-800' 
                                    : isCurrentMonth
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : isPastMonth
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-600'
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
                          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          📋 Submit Detailed Crop Report
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {registeredCrops.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <span className="text-6xl">🌱</span>
                  <p className="mt-4 text-xl">No crops registered yet</p>
                  <p className="text-sm">Register your first crop to start tracking your progress</p>
                  <button
                    onClick={() => setShowCropRegistrationModal(true)}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Register Your First Crop
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Monthly Report Submissions</h3>
            
            {/* Pending Reports */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Pending Reports</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredCrops.filter(crop => CropService.isReportDue(crop)).map(crop => (
                  <div key={crop.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-gray-800">{crop.cropType} - {crop.variety}</h5>
                        <p className="text-sm text-gray-600">Area: {crop.area} ha</p>
                      </div>
                      <span className="text-yellow-600 text-2xl">⏰</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCropForReport(crop);
                        setShowMonthlyReportModal(true);
                      }}
                      className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      📋 Submit Detailed Report
                    </button>
                  </div>
                ))}
                
                {registeredCrops.filter(crop => CropService.isReportDue(crop)).length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <span className="text-4xl">✅</span>
                    <p className="mt-2">All reports are up to date!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reports */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Report History</h4>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {registeredCrops.flatMap(crop => 
                    crop.reports.map(report => ({...report, crop}))
                  ).sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate)).slice(0, 10).map((report, index) => (
                    <div key={index} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-800">{report.crop.cropType} - {report.crop.variety}</h5>
                          <p className="text-sm text-gray-600">
                            {report.reportDate} • Stage: {report.growthStage} • Height: {report.plantHeight}cm
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                          report.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {report.healthStatus}
                        </span>
                      </div>
                      {report.notes && (
                        <p className="mt-2 text-sm text-gray-700">{report.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Philippines Crop Growing Guidelines</h3>
              <div className="mt-4 md:mt-0 text-sm text-gray-600">
                {getFilteredCropData().length} varieties available
              </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search crops, varieties, or descriptions..."
                    value={guidelinesSearch}
                    onChange={(e) => setGuidelinesSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
                <select
                  value={guidelinesFilter}
                  onChange={(e) => setGuidelinesFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Crop Types</option>
                  {CropService.getAllCropTypes().map(cropType => (
                    <option key={cropType} value={cropType}>{cropType}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guidelines Category Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {['overview', 'planting', 'growing'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setGuidelinesCategory(category)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      guidelinesCategory === category
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {category === 'overview' && '🌾 Crop Overview'}
                    {category === 'planting' && '🌱 Planting Guide'}
                    {category === 'growing' && '📈 Growth Stages'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tabular Guidelines Content */}
            <div className="overflow-x-auto">
              {guidelinesCategory === 'overview' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop & Variety</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maturity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimal Season</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredCropData().map((item) => (
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.maturityDays} days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {CropService.formatYield(item.avgYield)}/ha
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {item.optimalSeasons.map(season => (
                                <span key={season} className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  {season}
                                </span>
                              ))}
                            </div>
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-2">Variety Details</h4>
                                  <p className="text-sm text-gray-600 mb-3">{item.variety.description}</p>
                                  <div className="space-y-2">
                                    <div className="text-sm">
                                      <span className="font-medium text-gray-700">Resistance:</span>
                                      <span className="ml-2 text-gray-600">{item.variety.resistance || 'Standard'}</span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="font-medium text-gray-700">Special Features:</span>
                                      <span className="ml-2 text-gray-600">{item.variety.features || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-2">Seasonal Information</h4>
                                  <div className="space-y-2">
                                    {Object.entries(item.seasons).map(([season, info]) => (
                                      <div key={season} className={`p-2 rounded border ${info.optimal ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="text-sm font-medium">
                                          {season} Season {info.optimal && <span className="text-green-600">(Optimal)</span>}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          {info.start} - {info.end}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{info.conditions}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}

              {guidelinesCategory === 'planting' && (
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
                    {getFilteredCropData().map((item) => {
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
                    })}
                  </tbody>
                </table>
              )}

              {guidelinesCategory === 'growing' && (
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
                    {CropService.getAllCropTypes()
                      .filter(cropType => 
                        guidelinesFilter === 'all' || guidelinesFilter === cropType
                      )
                      .filter(cropType =>
                        !guidelinesSearch || cropType.toLowerCase().includes(guidelinesSearch.toLowerCase())
                      )
                      .map((cropType) => {
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
                                  <div className="relative">
                                    {/* Timeline */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                                    
                                    <div className="space-y-6">
                                      {stages.map((stage, index) => (
                                        <div key={index} className="relative flex items-start">
                                          {/* Stage indicator */}
                                          <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-4 border-blue-200 rounded-full">
                                            <span className="text-xs font-bold text-blue-600">{stage.code}</span>
                                          </div>
                                          
                                          {/* Stage content */}
                                          <div className="ml-6 flex-1">
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                              <h5 className="font-semibold text-gray-800">{stage.stage}</h5>
                                              <div className="text-sm text-gray-600 mt-1">
                                                <span className="font-medium">Duration:</span> {stage.days} days
                                              </div>
                                              <div className="text-sm text-gray-700 mt-2">{stage.description}</div>
                                              {stage.tips && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                  <div className="text-xs font-medium text-blue-800 mb-1">💡 Tips:</div>
                                                  <div className="text-xs text-blue-700">{stage.tips}</div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
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
