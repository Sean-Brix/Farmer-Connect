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
  const [openFarmerTabs, setOpenFarmerTabs] = useState([]); // Array of farmer objects for multiple tabs
  const [activeFarmerId, setActiveFarmerId] = useState(null); // Currently active farmer tab
  const [selectedFarmerTab, setSelectedFarmerTab] = useState('reports');
  const [showCropReportsModal, setShowCropReportsModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    details: false,
    timeline: false,
    issues: false
  });

  // Tab management functions
  const openFarmerTab = (farmer) => {
    // Check if farmer tab is already open
    const existingTab = openFarmerTabs.find(tab => tab.farmerId === farmer.farmerId);
    if (existingTab) {
      setActiveFarmerId(farmer.farmerId);
      setActiveTab('farmer');
      return;
    }

    // Add new farmer tab
    setOpenFarmerTabs(prev => [...prev, farmer]);
    setActiveFarmerId(farmer.farmerId);
    setActiveTab('farmer');
  };

  const closeFarmerTab = (farmerId, event) => {
    event.stopPropagation();
    const updatedTabs = openFarmerTabs.filter(tab => tab.farmerId !== farmerId);
    setOpenFarmerTabs(updatedTabs);
    
    // If closing active tab, switch to overview or first available tab
    if (activeFarmerId === farmerId) {
      if (updatedTabs.length > 0) {
        setActiveFarmerId(updatedTabs[0].farmerId);
      } else {
        setActiveTab('overview');
        setActiveFarmerId(null);
      }
    }
  };

  const getCurrentFarmer = () => {
    return openFarmerTabs.find(tab => tab.farmerId === activeFarmerId);
  };

  // Calculate overview statistics
  const getOverviewStatistics = () => {
    const totalFarmers = farmers.length;
    const totalReports = sampleSeedTrackingData.length;
    
    // Crop distribution
    const cropCounts = sampleSeedTrackingData.reduce((acc, report) => {
      acc[report.crop] = (acc[report.crop] || 0) + 1;
      return acc;
    }, {});
    
    // Health status distribution
    const healthCounts = sampleSeedTrackingData.reduce((acc, report) => {
      acc[report.healthStatus] = (acc[report.healthStatus] || 0) + 1;
      return acc;
    }, {});
    
    // Recent reports (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentReports = sampleSeedTrackingData.filter(report => {
      const reportDate = new Date(report.reportDate);
      return reportDate >= thirtyDaysAgo;
    });
    
    // Active crops count (unique crops per farmer)
    const activeCrops = new Set();
    sampleSeedTrackingData.forEach(report => {
      const key = `${report.farmerId}-${report.crop}`;
      activeCrops.add(key);
    });
    
    return {
      totalFarmers,
      totalReports,
      recentReports: recentReports.length,
      activeCrops: activeCrops.size,
      cropDistribution: cropCounts,
      healthDistribution: healthCounts
    };
  };

  // Sample data with fixed date structure
  const [farmers, setFarmers] = useState([
    {
      id: 1,
      farmerId: 1,
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
      farmerId: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 923 456 7890',
      location: 'Nueva Ecija, Philippines',
      joinDate: '2024-02-01',
      cropTypes: ['Rice', 'Vegetables'],
      totalReports: 8,
      status: 'Active'
    },
    {
      id: 3,
      farmerId: 3,
      name: 'Pedro Dela Cruz',
      email: 'pedro.delacruz@email.com',
      phone: '+63 934 567 8901',
      location: 'Bulacan, Philippines',
      joinDate: '2024-01-20',
      cropTypes: ['Corn', 'Vegetables'],
      totalReports: 15,
      status: 'Active'
    }
  ]);

  // Enhanced sample data with proper reportDate field and complete BBCH scale
  const [sampleSeedTrackingData, setSampleSeedTrackingData] = useState([
    // Juan Martinez (farmerId: 1) - Rice crops
    {
      id: 1,
      farmerId: 1,
      crop: 'Rice',
      variety: 'IR64',
      plantingDate: '2024-01-15',
      expectedHarvest: '2024-05-15',
      area: 2.5,
      reportDate: '2024-01-30',
      growthStage: 'Germination',
      plantHeight: 15,
      healthStatus: 'Healthy',
      estimatedYield: 2500,
      pestsAndDiseases: 'None',
      weatherImpact: 'Favorable',
      notes: 'Seeds germinating well'
    },
    {
      id: 2,
      farmerId: 1,
      crop: 'Rice',
      variety: 'IR64',
      plantingDate: '2024-01-15',
      expectedHarvest: '2024-05-15',
      area: 2.5,
      reportDate: '2024-02-15',
      growthStage: 'Tillering',
      plantHeight: 35,
      healthStatus: 'Healthy',
      estimatedYield: 3000,
      pestsAndDiseases: 'Minor leaf spot',
      weatherImpact: 'Good rainfall',
      notes: 'Good tillering progress'
    },
    {
      id: 3,
      farmerId: 1,
      crop: 'Rice',
      variety: 'IR64',
      plantingDate: '2024-01-15',
      expectedHarvest: '2024-05-15',
      area: 2.5,
      reportDate: '2024-03-01',
      growthStage: 'Panicle initiation',
      plantHeight: 55,
      healthStatus: 'Warning',
      estimatedYield: 2800,
      pestsAndDiseases: 'Brown planthopper',
      weatherImpact: 'Drought stress',
      notes: 'Applied pesticide treatment'
    },
    // Maria Santos (farmerId: 2) - Rice and Vegetables
    {
      id: 4,
      farmerId: 2,
      crop: 'Rice',
      variety: 'PSB Rc82',
      plantingDate: '2024-02-01',
      expectedHarvest: '2024-06-01',
      area: 1.8,
      reportDate: '2024-02-15',
      growthStage: 'Germination',
      plantHeight: 12,
      healthStatus: 'Healthy',
      estimatedYield: 1800,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Seeds planted successfully'
    },
    {
      id: 5,
      farmerId: 2,
      crop: 'Vegetables',
      variety: 'Tomato',
      plantingDate: '2024-02-10',
      expectedHarvest: '2024-05-10',
      area: 0.5,
      reportDate: '2024-02-25',
      growthStage: 'Seedling',
      plantHeight: 8,
      healthStatus: 'Healthy',
      estimatedYield: 500,
      pestsAndDiseases: 'None',
      weatherImpact: 'Favorable',
      notes: 'Seedlings transplanted'
    },
    // Pedro Dela Cruz (farmerId: 3) - Corn
    {
      id: 6,
      farmerId: 3,
      crop: 'Corn',
      variety: 'Pioneer 30G12',
      plantingDate: '2024-01-20',
      expectedHarvest: '2024-05-20',
      area: 3.0,
      reportDate: '2024-02-05',
      growthStage: 'Vegetative',
      plantHeight: 25,
      healthStatus: 'Healthy',
      estimatedYield: 3500,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Strong vegetative growth'
    },
    {
      id: 7,
      farmerId: 3,
      crop: 'Corn',
      variety: 'Pioneer 30G12',
      plantingDate: '2024-01-20',
      expectedHarvest: '2024-05-20',
      area: 3.0,
      reportDate: '2024-02-20',
      growthStage: 'Tasseling',
      plantHeight: 85,
      healthStatus: 'Healthy',
      estimatedYield: 4000,
      pestsAndDiseases: 'Corn borer',
      weatherImpact: 'Adequate rainfall',
      notes: 'Applied organic pesticide'
    }
  ]);

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
    cropType: 'all'
  });

  // BBCH Scale Mappings for different crops
  const getBBCHStages = (cropType) => {
    const stages = {
      'Rice': [
        'Germination', 'Seedling', 'Tillering', 'Stem elongation', 'Booting',
        'Heading', 'Flowering', 'Milk development', 'Dough development',
        'Ripening', 'Senescence', 'Dormancy', 'Harvest'
      ],
      'Corn': [
        'Germination', 'Seedling', 'Leaf development', 'Tillering', 'Stem elongation',
        'Inflorescence emergence', 'Flowering', 'Development of fruit', 'Ripening',
        'Senescence', 'Dormancy', 'Vegetative', 'Tasseling', 'Silking', 'Harvest'
      ],
      'Vegetables': [
        'Germination', 'Seedling', 'Leaf development', 'Formation of side shoots',
        'Inflorescence emergence', 'Flowering', 'Development of fruit', 'Ripening',
        'Senescence', 'Dormancy', 'Transplanting', 'Vegetative', 'Harvest'
      ]
    };
    return stages[cropType] || stages['Vegetables'];
  };

  // Helper function to get farmer's crops with reports
  const getFarmerCrops = (farmerId) => {
    const farmerReports = sampleSeedTrackingData.filter(report => report.farmerId === farmerId);
    
    // Group reports by crop and variety
    const cropsMap = {};
    farmerReports.forEach(report => {
      const key = `${report.crop}-${report.variety}`;
      if (!cropsMap[key]) {
        cropsMap[key] = {
          cropType: report.crop,
          variety: report.variety,
          plantingDate: report.plantingDate,
          expectedHarvest: report.expectedHarvest,
          area: report.area,
          reports: []
        };
      }
      cropsMap[key].reports.push(report);
    });
    
    return Object.values(cropsMap);
  };

  // Function to get expected report months
  const getExpectedReportMonths = (plantingDate, harvestDate) => {
    const start = new Date(plantingDate);
    const end = new Date(harvestDate);
    const months = [];
    
    const current = new Date(start);
    while (current <= end) {
      months.push(current.toISOString().slice(0, 7)); // YYYY-MM format
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  // Analytics function for individual farmers
  const getFarmerAnalytics = (farmerId) => {
    const reports = sampleSeedTrackingData.filter(r => r.farmerId === farmerId);
    const crops = getFarmerCrops(farmerId);
    
    return {
      totalReports: reports.length,
      activeCrops: crops.length,
      avgPlantHeight: reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.plantHeight, 0) / reports.length) : 0,
      totalEstimatedYield: reports.reduce((sum, r) => sum + r.estimatedYield, 0),
      healthyReports: reports.filter(r => r.healthStatus === 'Healthy').length,
      warningReports: reports.filter(r => r.healthStatus === 'Warning').length,
      criticalReports: reports.filter(r => r.healthStatus === 'Critical').length
    };
  };

  // Filter function for farmers
  const getFilteredFarmers = () => {
    return farmers.filter(farmer => {
      if (filters.status !== 'all' && farmer.status.toLowerCase() !== filters.status) {
        return false;
      }
      if (filters.location !== 'all' && !farmer.location.toLowerCase().includes(filters.location)) {
        return false;
      }
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
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{farmers.length}</div>
                <p className="text-sm text-gray-600">Total Farmers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sampleSeedTrackingData.length}</div>
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Overview
              </button>
              
              {/* Dynamic Farmer Tabs */}
              {openFarmerTabs.map((farmer) => (
                <div
                  key={farmer.farmerId}
                  className={`flex items-center border-b-2 transition-colors ${
                    activeTab === 'farmer' && activeFarmerId === farmer.farmerId
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveTab('farmer');
                      setActiveFarmerId(farmer.farmerId);
                    }}
                    className="py-4 px-4 text-sm font-medium whitespace-nowrap"
                  >
                    👨‍🌾 {farmer.name}
                  </button>
                  <button
                    onClick={(e) => closeFarmerTab(farmer.farmerId, e)}
                    className="px-2 py-4 text-gray-400 hover:text-red-500 transition-colors"
                    title="Close tab"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {(() => {
                const stats = getOverviewStatistics();
                return (
                  <>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                          👥
                        </div>
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-gray-800">{stats.totalFarmers}</h3>
                          <p className="text-sm text-gray-600">Total Farmers</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                          📄
                        </div>
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-gray-800">{stats.totalReports}</h3>
                          <p className="text-sm text-gray-600">Total Reports</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                          🌱
                        </div>
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-gray-800">{stats.activeCrops}</h3>
                          <p className="text-sm text-gray-600">Active Crops</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                          📈
                        </div>
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-gray-800">{stats.recentReports}</h3>
                          <p className="text-sm text-gray-600">Reports (30 days)</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {(() => {
                const stats = getOverviewStatistics();
                
                // Crop Distribution Chart Data
                const cropChartData = {
                  labels: Object.keys(stats.cropDistribution),
                  datasets: [{
                    data: Object.values(stats.cropDistribution),
                    backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                      '#FFCE56',
                      '#4BC0C0',
                      '#9966FF',
                      '#FF9F40'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                  }]
                };

                // Health Status Chart Data
                const healthChartData = {
                  labels: Object.keys(stats.healthDistribution),
                  datasets: [{
                    label: 'Number of Reports',
                    data: Object.values(stats.healthDistribution),
                    backgroundColor: [
                      '#10B981', // Healthy - Green
                      '#F59E0B', // Warning - Yellow
                      '#EF4444', // Critical - Red
                      '#6B7280'  // Unknown - Gray
                    ],
                    borderWidth: 1
                  }]
                };

                const chartOptions = {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true
                      }
                    }
                  }
                };

                return (
                  <>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Distribution</h3>
                      <div style={{ height: '300px' }}>
                        <Doughnut data={cropChartData} options={chartOptions} />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Status Distribution</h3>
                      <div style={{ height: '300px' }}>
                        <Bar data={healthChartData} options={{
                          ...chartOptions,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                stepSize: 1
                              }
                            }
                          }
                        }} />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

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

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-800">{farmer.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-800">{farmer.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Joined:</span>
                      <span className="text-gray-800">{farmer.joinDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Reports:</span>
                      <span className="text-gray-800">{farmer.totalReports}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Crop Types:</h4>
                    <div className="flex flex-wrap gap-2">
                      {farmer.cropTypes.map((crop, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openFarmerTab({ farmerId: farmer.id, name: farmer.name, ...farmer })}
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
        {activeTab === 'farmer' && activeFarmerId && (() => {
          const currentFarmer = getCurrentFarmer();
          if (!currentFarmer) return null;
          
          return (
            <div className="bg-white rounded-lg shadow-lg">
              {/* Farmer Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {currentFarmer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-800">{currentFarmer.name}</h2>
                      <p className="text-gray-600">{currentFarmer.email}</p>
                      <p className="text-gray-600">{currentFarmer.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      currentFarmer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {currentFarmer.status}
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
                {/* Reports Tab */}
                {selectedFarmerTab === 'reports' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-gray-800">Farmer's Crops & Reports</h4>
                      <span className="text-sm text-gray-600">
                        {getFarmerCrops(currentFarmer.id).length} active crops
                      </span>
                    </div>
                    
                    <div className="space-y-6">
                      {getFarmerCrops(currentFarmer.id).map((crop, index) => {
                        const expectedMonths = getExpectedReportMonths(crop.plantingDate, crop.expectedHarvest);
                        const latestReport = crop.reports[crop.reports.length - 1];
                        
                        return (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Crop Header */}
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-xl font-bold text-gray-800">{crop.cropType}</h5>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                    <span>🌱 Planted: {crop.plantingDate}</span>
                                    <span>🌾 Expected Harvest: {crop.expectedHarvest}</span>
                                    <span>📍 Area: {crop.area} hectares</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    latestReport?.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                                    latestReport?.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                    latestReport?.healthStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {latestReport?.healthStatus || 'No Status'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Latest Report Preview */}
                            {latestReport && (
                              <div className="px-6 py-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                  <h6 className="font-semibold text-gray-800">Latest Report</h6>
                                  <span className="text-sm text-gray-500">
                                    {latestReport.reportDate} • Growth Stage: {latestReport.growthStage}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Plant Height:</span>
                                    <span className="ml-2 font-medium">{latestReport.plantHeight}cm</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Estimated Yield:</span>
                                    <span className="ml-2 font-medium">{latestReport.estimatedYield}kg</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Pests/Diseases:</span>
                                    <span className="ml-2 font-medium">{latestReport.pestsAndDiseases || 'None reported'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Weather Impact:</span>
                                    <span className="ml-2 font-medium">{latestReport.weatherImpact || 'None'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {getFarmerCrops(currentFarmer.id).length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <span className="text-6xl">🌱</span>
                          <p className="mt-4 text-xl">No active crops</p>
                          <p className="text-sm">This farmer hasn't planted any crops yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Analytics Tab */}
                {selectedFarmerTab === 'analytics' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-gray-800">Analytics Dashboard</h4>
                      <span className="text-sm text-gray-600">
                        {currentFarmer.name} • {getFarmerCrops(currentFarmer.id).length} crops
                      </span>
                    </div>
                    
                    {/* Quick Overview Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                      <h5 className="font-semibold text-gray-800 mb-4">📊 Quick Overview</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(() => {
                          const analytics = getFarmerAnalytics(currentFarmer.id);
                          return (
                            <>
                              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-blue-600">{analytics.totalReports}</div>
                                <div className="text-xs text-gray-600">Total Reports</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-green-600">{analytics.activeCrops}</div>
                                <div className="text-xs text-gray-600">Active Crops</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-purple-600">{analytics.avgPlantHeight}cm</div>
                                <div className="text-xs text-gray-600">Avg Height</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-orange-600">{analytics.totalEstimatedYield}kg</div>
                                <div className="text-xs text-gray-600">Est. Yield</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}

export default Seed_Track;
