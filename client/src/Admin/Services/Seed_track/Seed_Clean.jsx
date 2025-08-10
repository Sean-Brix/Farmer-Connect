import React, { useState, useEffect, useRef } from 'react';
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

function Seed_Track() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedFarmerTab, setSelectedFarmerTab] = useState('reports');
  const [showCropReportsModal, setShowCropReportsModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    details: false,
    timeline: false,
    issues: false
  });

  // Sample data with fixed date structure
  const [farmers, setFarmers] = useState([
    {
      id: 1,
      name: 'Juan Martinez',
      email: 'juan.martinez@email.com',
      phone: '+63 912 345 6789',
      location: 'Laguna, Philippines',
      joinDate: '2024-01-15',
      cropTypes: ['Rice', 'Corn'],
      totalReports: 12,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 923 456 7890',
      location: 'Nueva Ecija, Philippines',
      joinDate: '2024-02-20',
      cropTypes: ['Rice', 'Vegetables'],
      totalReports: 8,
      status: 'Active'
    }
  ]);

  const [farmerReports, setFarmerReports] = useState({
    1: [
      // Rice Batch 2024-A (Complete cycle with proper dates)
      {
        id: 1,
        surveyId: 1,
        cropType: 'Rice',
        batchName: 'Rice Batch 2024-A',
        plantingDate: '2024-01-15',
        expectedHarvest: '2024-07-15',
        reportMonth: 'January 2024',
        reportDate: '2024-01-30',
        status: 'submitted',
        growthStage: 'Germination',
        growthStageCode: '05',
        healthStatus: 'Good',
        pestDiseaseIssues: 'None',
        weatherImpact: 'Favorable',
        estimatedYield: '4.0 tons/hectare',
        irrigationStatus: 'Adequate',
        notes: 'Seeds germinating well. Good weather conditions.'
      },
      {
        id: 2,
        surveyId: 1,
        cropType: 'Rice',
        batchName: 'Rice Batch 2024-A',
        plantingDate: '2024-01-15',
        expectedHarvest: '2024-07-15',
        reportMonth: 'February 2024',
        reportDate: '2024-02-28',
        status: 'submitted',
        growthStage: 'Tillering',
        growthStageCode: '13',
        healthStatus: 'Excellent',
        pestDiseaseIssues: 'None',
        weatherImpact: 'Good rainfall',
        estimatedYield: '4.2 tons/hectare',
        irrigationStatus: 'Good',
        notes: 'Plants showing strong tillering. Applied fertilizer.'
      },
      {
        id: 3,
        surveyId: 1,
        cropType: 'Rice',
        batchName: 'Rice Batch 2024-A',
        plantingDate: '2024-01-15',
        expectedHarvest: '2024-07-15',
        reportMonth: 'March 2024',
        reportDate: '2024-03-30',
        status: 'submitted',
        growthStage: 'Stem Elongation',
        growthStageCode: '30',
        healthStatus: 'Good',
        pestDiseaseIssues: 'Minor stem borer detected',
        weatherImpact: 'Adequate',
        estimatedYield: '4.3 tons/hectare',
        irrigationStatus: 'Good',
        notes: 'Good vegetative growth. Applied pest control.'
      }
    ],
    2: [
      {
        id: 4,
        surveyId: 1,
        cropType: 'Vegetables',
        batchName: 'Vegetables Batch 2024-D',
        plantingDate: '2024-04-01',
        expectedHarvest: '2024-08-01',
        reportMonth: 'April 2024',
        reportDate: '2024-04-30',
        status: 'submitted',
        growthStage: 'Seedling Development',
        growthStageCode: '12',
        healthStatus: 'Excellent',
        pestDiseaseIssues: 'None',
        weatherImpact: 'Good',
        estimatedYield: '3.5 tons/hectare',
        irrigationStatus: 'Adequate',
        notes: 'Healthy seedling growth observed.'
      }
    ]
  });

  // Utility functions
  const getFarmerCrops = (farmerId) => {
    const reports = farmerReports[farmerId] || [];
    const cropMap = new Map();
    
    reports.forEach(report => {
      const key = `${report.batchName}-${report.plantingDate}`;
      if (!cropMap.has(key)) {
        cropMap.set(key, {
          batchName: report.batchName,
          cropType: report.cropType,
          plantingDate: report.plantingDate,
          expectedHarvest: report.expectedHarvest,
          reports: []
        });
      }
      cropMap.get(key).reports.push(report);
    });
    
    return Array.from(cropMap.values());
  };

  const getExpectedReportMonths = (plantingDate, expectedHarvest) => {
    const months = [];
    const start = new Date(plantingDate);
    const end = new Date(expectedHarvest);
    
    const current = new Date(start);
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const getFarmerAnalytics = (farmerId) => {
    const reports = farmerReports[farmerId] || [];
    const totalReports = reports.length;
    const submittedReports = reports.filter(r => r.status === 'submitted').length;
    const avgYield = reports.length > 0 
      ? (reports.reduce((sum, r) => sum + parseFloat(r.estimatedYield || 0), 0) / reports.length).toFixed(1)
      : '0.0';
    const submissionRate = totalReports > 0 ? Math.round((submittedReports / totalReports) * 100) : 0;
    
    return {
      totalReports,
      submittedReports,
      avgYield,
      submissionRate
    };
  };

  const [filters, setFilters] = useState({
    status: 'all',
    cropType: 'all',
    location: 'all',
    month: 'all'
  });

  const getFilteredFarmers = () => {
    return farmers.filter(farmer => {
      if (filters.status !== 'all' && farmer.status.toLowerCase() !== filters.status) return false;
      if (filters.location !== 'all' && !farmer.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">🌱</span>
                Seed Tracking System
              </h1>
              <p className="text-gray-600 mt-2">Monitor and track farmer seed planting progress and crop reports</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{farmers.length}</p>
                <p className="text-sm text-gray-600">Active Farmers</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {Object.values(farmerReports).flat().length}
                </p>
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Overview
              </button>
              {selectedFarmer && (
                <button
                  onClick={() => setActiveTab('farmer-detail')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'farmer-detail'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  👨‍🌾 {selectedFarmer.name}
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Locations</option>
                    <option value="laguna">Laguna</option>
                    <option value="nueva ecija">Nueva Ecija</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Farmers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredFarmers().map(farmer => (
                <div key={farmer.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {farmer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-800">{farmer.name}</h3>
                        <p className="text-sm text-gray-600">{farmer.location}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      farmer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {farmer.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{farmer.totalReports}</p>
                      <p className="text-xs text-gray-600">Reports</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{getFarmerCrops(farmer.id).length}</p>
                      <p className="text-xs text-gray-600">Crops</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Crop Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {farmer.cropTypes.map((crop, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {crop === 'Rice' ? '🌾' : crop === 'Corn' ? '🌽' : '🥬'} {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFarmer(farmer);
                      setActiveTab('farmer-detail');
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Farmer Detail Tab */}
        {activeTab === 'farmer-detail' && selectedFarmer && (
          <div className="bg-white rounded-lg shadow-lg">
            {/* Farmer Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="mr-4 text-gray-400 hover:text-gray-600"
                  >
                    ← Back
                  </button>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedFarmer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedFarmer.name}</h2>
                    <p className="text-gray-600">{selectedFarmer.email}</p>
                    <p className="text-gray-600">{selectedFarmer.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedFarmer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedFarmer.status}
                  </span>
                </div>
              </div>

              {/* Sub Navigation */}
              <div className="mt-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setSelectedFarmerTab('reports')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      selectedFarmerTab === 'reports'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    📋 Reports & Crops
                  </button>
                  <button
                    onClick={() => setSelectedFarmerTab('analytics')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      selectedFarmerTab === 'analytics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    📊 Analytics
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Reports Tab with Crop-based Layout */}
              {selectedFarmerTab === 'reports' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-800">Farmer's Crops & Reports</h4>
                    <span className="text-sm text-gray-600">
                      {getFarmerCrops(selectedFarmer.id).length} active crops
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {getFarmerCrops(selectedFarmer.id).map((crop, index) => {
                      const expectedMonths = getExpectedReportMonths(crop.plantingDate, crop.expectedHarvest);
                      const latestReport = crop.reports[crop.reports.length - 1];
                      
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Crop Header */}
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-3xl">
                                  {crop.cropType === 'Rice' ? '🌾' : 
                                   crop.cropType === 'Corn' ? '🌽' : '🥬'}
                                </div>
                                <div>
                                  <h5 className="font-bold text-gray-800 text-lg">{crop.batchName}</h5>
                                  <p className="text-gray-600 text-sm">{crop.cropType} • Planted: {new Date(crop.plantingDate).toLocaleDateString()}</p>
                                  <p className="text-gray-600 text-sm">Expected harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm text-gray-600">Latest Stage:</span>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    latestReport?.growthStageCode >= '85' ? 'bg-purple-100 text-purple-800' :
                                    latestReport?.growthStageCode >= '60' ? 'bg-blue-100 text-blue-800' :
                                    latestReport?.growthStageCode >= '30' ? 'bg-green-100 text-green-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {latestReport?.growthStage || 'Not reported'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Reports:</span>
                                  <span className="text-sm font-bold text-gray-800">
                                    {crop.reports.length}/{expectedMonths.length}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Crop Details Button */}
                          <div className="p-6">
                            <button
                              onClick={() => {
                                setSelectedCrop({
                                  ...crop,
                                  expectedMonths,
                                  farmerId: selectedFarmer.id
                                });
                                setShowCropReportsModal(true);
                              }}
                              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              📊 View All Reports ({crop.reports.length} submitted)
                            </button>
                            
                            {/* Quick Summary */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-sm">Latest Yield Est.</p>
                                <p className="text-lg font-bold text-gray-800">
                                  {latestReport?.estimatedYield || 'N/A'}
                                </p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-sm">Health Status</p>
                                <p className={`text-lg font-bold ${
                                  latestReport?.healthStatus === 'Excellent' ? 'text-green-600' :
                                  latestReport?.healthStatus === 'Good' ? 'text-blue-600' :
                                  latestReport?.healthStatus === 'Fair' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {latestReport?.healthStatus || 'Unknown'}
                                </p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-sm">Days Since Plant</p>
                                <p className="text-lg font-bold text-gray-800">
                                  {Math.floor((new Date() - new Date(crop.plantingDate)) / (1000 * 60 * 60 * 24))} days
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {getFarmerCrops(selectedFarmer.id).length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <span className="text-6xl">🌱</span>
                        <p className="mt-4 text-xl">No crops planted yet</p>
                        <p className="text-sm">Reports will appear here when farmer starts planting and submitting monthly reports</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Analytics Tab with Simplified UI */}
              {selectedFarmerTab === 'analytics' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-800">Analytics Dashboard</h4>
                    <span className="text-sm text-gray-600">
                      {selectedFarmer.name} • {getFarmerCrops(selectedFarmer.id).length} crops
                    </span>
                  </div>
                  
                  {/* Quick Overview Section - Always Visible */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                    <h5 className="font-semibold text-gray-800 mb-4">📊 Quick Overview</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(() => {
                        const analytics = getFarmerAnalytics(selectedFarmer.id);
                        return (
                          <>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl mb-1">📋</div>
                              <p className="text-lg font-bold text-blue-600">{analytics.totalReports}</p>
                              <p className="text-xs text-gray-600">Total Reports</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl mb-1">✅</div>
                              <p className="text-lg font-bold text-green-600">{analytics.submissionRate}%</p>
                              <p className="text-xs text-gray-600">Success Rate</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl mb-1">🌾</div>
                              <p className="text-lg font-bold text-purple-600">{analytics.avgYield}</p>
                              <p className="text-xs text-gray-600">Avg. Yield (t/ha)</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl mb-1">🌱</div>
                              <p className="text-lg font-bold text-orange-600">{getFarmerCrops(selectedFarmer.id).length}</p>
                              <p className="text-xs text-gray-600">Active Crops</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Expandable Sections */}
                  <div className="space-y-4">
                    
                    {/* Yield Trends Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedSections(prev => ({ ...prev, timeline: !prev.timeline }))}
                        className="w-full bg-gray-50 hover:bg-gray-100 px-6 py-4 text-left flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📈</span>
                          <span className="font-semibold text-gray-800">Yield Trends & Performance</span>
                        </div>
                        <span className={`transform transition-transform ${expandedSections.timeline ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      
                      {expandedSections.timeline && (
                        <div className="p-6 bg-white">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Simple Bar Chart */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h6 className="font-medium text-gray-800 mb-4">Monthly Yield Progress</h6>
                              <div className="h-32 flex items-end justify-between gap-2">
                                {[4.2, 4.8, 4.5, 4.7, 5.1].map((yieldValue, index) => (
                                  <div key={index} className="flex flex-col items-center flex-1">
                                    <div 
                                      className="w-full bg-blue-500 rounded-t-md transition-all duration-500 min-h-[4px]"
                                      style={{ height: `${(yieldValue / 6) * 100}%` }}
                                      title={`${yieldValue} tons/ha`}
                                    ></div>
                                    <span className="text-xs text-gray-600 mt-2">
                                      {['Jan', 'Feb', 'Mar', 'Apr', 'May'][index]}
                                    </span>
                                    <span className="text-xs font-medium text-blue-600">{yieldValue}t</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Health Status Distribution */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h6 className="font-medium text-gray-800 mb-4">Health Status Distribution</h6>
                              <div className="space-y-2">
                                {[
                                  { status: 'Excellent', count: 2, color: 'bg-green-500' },
                                  { status: 'Good', count: 1, color: 'bg-blue-500' },
                                  { status: 'Fair', count: 0, color: 'bg-yellow-500' },
                                  { status: 'Poor', count: 0, color: 'bg-red-500' }
                                ].map((item, index) => (
                                  <div key={index} className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                                    <span className="text-sm text-gray-700 flex-1">{item.status}</span>
                                    <span className="text-sm font-medium text-gray-800">{item.count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Crop Details Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedSections(prev => ({ ...prev, details: !prev.details }))}
                        className="w-full bg-gray-50 hover:bg-gray-100 px-6 py-4 text-left flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🌾</span>
                          <span className="font-semibold text-gray-800">Crop Details & Growth Stages</span>
                        </div>
                        <span className={`transform transition-transform ${expandedSections.details ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      
                      {expandedSections.details && (
                        <div className="p-6 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getFarmerCrops(selectedFarmer.id).map((crop, index) => {
                              const latestReport = crop.reports[crop.reports.length - 1];
                              return (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">
                                      {crop.cropType === 'Rice' ? '🌾' : 
                                       crop.cropType === 'Corn' ? '🌽' : '🥬'}
                                    </span>
                                    <div>
                                      <h6 className="font-semibold text-gray-800">{crop.batchName}</h6>
                                      <p className="text-xs text-gray-600">{crop.cropType}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Reports:</span>
                                      <span className="font-medium">{crop.reports.length}/7</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Latest Stage:</span>
                                      <span className="font-medium text-blue-600">
                                        {latestReport?.growthStage || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Health:</span>
                                      <span className={`font-medium ${
                                        latestReport?.healthStatus === 'Excellent' ? 'text-green-600' :
                                        latestReport?.healthStatus === 'Good' ? 'text-blue-600' :
                                        latestReport?.healthStatus === 'Fair' ? 'text-yellow-600' :
                                        'text-red-600'
                                      }`}>
                                        {latestReport?.healthStatus || 'Unknown'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Crop Reports Modal with Simplified Structure */}
      {showCropReportsModal && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {selectedCrop.cropType === 'Rice' ? '🌾' : 
                     selectedCrop.cropType === 'Corn' ? '🌽' : '🥬'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedCrop.batchName}</h3>
                    <p className="text-gray-600">
                      {selectedCrop.cropType} • Planted: {new Date(selectedCrop.plantingDate).toLocaleDateString()} 
                      • Expected Harvest: {new Date(selectedCrop.expectedHarvest).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCropReportsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Progress Timeline */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Reporting Progress</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {selectedCrop.expectedMonths.map((month, index) => {
                    const hasReport = selectedCrop.reports.some(report => 
                      new Date(report.reportDate).getMonth() === new Date(month).getMonth() &&
                      new Date(report.reportDate).getFullYear() === new Date(month).getFullYear()
                    );
                    const currentMonth = new Date();
                    const isPastDue = new Date(month) < currentMonth && !hasReport;
                    const isFuture = new Date(month) > currentMonth;
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          hasReport ? 'border-green-200 bg-green-50' :
                          isPastDue ? 'border-red-200 bg-red-50' :
                          isFuture ? 'border-gray-200 bg-gray-50' :
                          'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">
                            {hasReport ? '✅' : isPastDue ? '❌' : isFuture ? '⏳' : '📝'}
                          </div>
                          <p className="font-semibold text-gray-800">
                            {new Date(month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                          <p className={`text-sm mt-1 ${
                            hasReport ? 'text-green-600' :
                            isPastDue ? 'text-red-600' :
                            isFuture ? 'text-gray-500' :
                            'text-yellow-600'
                          }`}>
                            {hasReport ? 'Submitted' :
                             isPastDue ? 'Past Due' :
                             isFuture ? 'Upcoming' :
                             'Due Now'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800">
                  Submitted Reports ({selectedCrop.reports.length})
                </h4>
                
                {selectedCrop.reports.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCrop.reports
                      .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
                      .map((report, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">📋</div>
                            <div>
                              <h5 className="text-lg font-semibold text-gray-800">
                                {new Date(report.reportDate).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  year: 'numeric' 
                                })} Report
                              </h5>
                              <p className="text-gray-600 text-sm">
                                Submitted: {new Date(report.reportDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              report.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
                              report.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                              report.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {report.healthStatus}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              report.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-600 text-sm">Growth Stage</p>
                            <p className="font-semibold text-gray-800">{report.growthStage}</p>
                            <p className="text-xs text-gray-500">BBCH {report.growthStageCode}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-600 text-sm">Estimated Yield</p>
                            <p className="font-semibold text-gray-800">{report.estimatedYield}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-600 text-sm">Weather Impact</p>
                            <p className="font-semibold text-gray-800">{report.weatherImpact}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-600 text-sm">Irrigation</p>
                            <p className="font-semibold text-gray-800">{report.irrigationStatus}</p>
                          </div>
                        </div>

                        {(report.pestDiseaseIssues && report.pestDiseaseIssues !== 'None') && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-red-800 font-semibold text-sm">🐛 Pest/Disease Issues:</p>
                            <p className="text-red-700 text-sm">{report.pestDiseaseIssues}</p>
                          </div>
                        )}

                        {report.notes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-blue-800 font-semibold text-sm">📝 Additional Notes:</p>
                            <p className="text-blue-700 text-sm">{report.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-6xl">📋</span>
                    <p className="mt-4 text-xl">No reports submitted yet</p>
                    <p className="text-sm">Reports will appear here as the farmer submits monthly updates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Seed_Track;
