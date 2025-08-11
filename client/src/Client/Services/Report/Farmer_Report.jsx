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
import MonthlyReportForm from '../../Components/MonthlyReportForm';

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
      reports: []
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
          currentStage: reportData.growthStage
        };
      }
      return crop;
    }));

    alert('Monthly report submitted successfully!');
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

  const analytics = getFarmerAnalytics();

  return (
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
                          Submit Monthly Report
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
                      Submit Report
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
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Philippines Crop Growing Guidelines</h3>
            
            <div className="space-y-6">
              {Object.entries(philippinesCrops).map(([cropType, info]) => (
                <div key={cropType} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">{cropType}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Recommended Varieties</h5>
                      <div className="space-y-2">
                        {info.varieties.map((variety, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <div className="font-medium text-gray-800">{variety.name}</div>
                            <div className="text-sm text-gray-600">
                              Growth: {variety.growthPeriod} days • Yield: {variety.yieldPerHectare.toLocaleString()} kg/ha
                            </div>
                            <div className="text-sm text-gray-700">{variety.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Growing Information</h5>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Seasonality:</span>
                          <p className="text-sm text-gray-600">{info.seasonality}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Ideal Climate:</span>
                          <p className="text-sm text-gray-600">{info.idealClimate}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Growth Stages:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {info.growthStages.map((stage, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {stage}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crop Registration Modal */}
        {showCropRegistrationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Register New Crop</h2>
                  <button
                    onClick={() => setShowCropRegistrationModal(false)}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type *</label>
                    <select
                      value={newCropForm.cropType}
                      onChange={(e) => setNewCropForm(prev => ({ ...prev, cropType: e.target.value, variety: '' }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select Crop Type</option>
                      {Object.keys(philippinesCrops).map(crop => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>

                  {newCropForm.cropType && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variety *</label>
                      <select
                        value={newCropForm.variety}
                        onChange={(e) => setNewCropForm(prev => ({ ...prev, variety: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Select Variety</option>
                        {philippinesCrops[newCropForm.cropType].varieties.map(variety => (
                          <option key={variety.name} value={variety.name}>
                            {variety.name} - {variety.growthPeriod} days, {variety.yieldPerHectare.toLocaleString()} kg/ha
                          </option>
                        ))}
                      </select>
                      
                      {newCropForm.variety && (
                        <div className="mt-2 p-3 bg-blue-50 rounded">
                          <p className="text-sm text-blue-800">
                            {philippinesCrops[newCropForm.cropType].varieties.find(v => v.name === newCropForm.variety)?.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Planting Date *</label>
                    <input
                      type="date"
                      value={newCropForm.plantingDate}
                      onChange={(e) => setNewCropForm(prev => ({ ...prev, plantingDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area (hectares) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={newCropForm.area}
                      onChange={(e) => setNewCropForm(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 1.5"
                      required
                    />
                  </div>

                  {newCropForm.cropType && newCropForm.variety && newCropForm.plantingDate && newCropForm.area && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Expected Information</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>Expected Harvest: {calculateExpectedHarvest(newCropForm.plantingDate, newCropForm.cropType, newCropForm.variety)}</p>
                        <p>Expected Yield: {calculateExpectedYield(newCropForm.area, newCropForm.cropType, newCropForm.variety).toLocaleString()} kg</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={newCropForm.notes}
                      onChange={(e) => setNewCropForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                      placeholder="Additional notes about this crop..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowCropRegistrationModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropRegistration}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Register Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Report Modal */}
        {showMonthlyReportModal && selectedCropForReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Monthly Report</h2>
                    <p className="text-green-100">{selectedCropForReport.cropType} - {selectedCropForReport.variety}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowMonthlyReportModal(false);
                      setSelectedCropForReport(null);
                    }}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Growth Stage *</label>
                    <select
                      value={monthlyReportForm.growthStage}
                      onChange={(e) => setMonthlyReportForm(prev => ({ ...prev, growthStage: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select Current Growth Stage</option>
                      {philippinesCrops[selectedCropForReport.cropType]?.growthStages.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plant Height (cm) *</label>
                    <input
                      type="number"
                      min="1"
                      value={monthlyReportForm.plantHeight}
                      onChange={(e) => setMonthlyReportForm(prev => ({ ...prev, plantHeight: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 45"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health Status *</label>
                    <select
                      value={monthlyReportForm.healthStatus}
                      onChange={(e) => setMonthlyReportForm(prev => ({ ...prev, healthStatus: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="Healthy">Healthy</option>
                      <option value="Warning">Warning</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Yield (kg)</label>
                    <input
                      type="number"
                      min="0"
                      value={monthlyReportForm.estimatedYield}
                      onChange={(e) => setMonthlyReportForm(prev => ({ ...prev, estimatedYield: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Expected: ${selectedCropForReport.expectedYield.toLocaleString()} kg`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pests and Diseases</label>
                    <input
                      type="text"
                      value={monthlyReportForm.pestsAndDiseases}
                      onChange={(e) => setMonthlyReportForm(prev => ({ ...prev, pestsAndDiseases: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Minor leaf spot, None"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weather Impact</label>
                    <input
                      type="text"
                      value={monthlyReportForm.weatherImpact}
                      onChange={(e) => setMonthlyReportForm(prev => ({ ...prev, weatherImpact: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Good rainfall, Drought stress"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      value={monthlyReportForm.notes}
                      onChange={(e) => setMonthlyReportForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                      placeholder="Any additional observations or actions taken..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setShowMonthlyReportModal(false);
                      setSelectedCropForReport(null);
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMonthlyReportSubmission}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
