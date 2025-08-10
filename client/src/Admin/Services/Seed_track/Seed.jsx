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
      totalReports: 3,
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
      totalReports: 2,
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
      totalReports: 2,
      status: 'Active'
    },
    {
      id: 4,
      farmerId: 4,
      name: 'Rosa Fernandez',
      email: 'rosa.fernandez@email.com',
      phone: '+63 945 678 9012',
      location: 'Bataan, Philippines',
      joinDate: '2024-03-01',
      cropTypes: ['Rice', 'Corn'],
      totalReports: 8,
      status: 'Active'
    },
    {
      id: 5,
      farmerId: 5,
      name: 'Carlos Reyes',
      email: 'carlos.reyes@email.com',
      phone: '+63 956 789 0123',
      location: 'Pampanga, Philippines',
      joinDate: '2024-04-15',
      cropTypes: ['Vegetables', 'Corn'],
      totalReports: 7,
      status: 'Active'
    },
    {
      id: 6,
      farmerId: 6,
      name: 'Ana Gutierrez',
      email: 'ana.gutierrez@email.com',
      phone: '+63 967 890 1234',
      location: 'Tarlac, Philippines',
      joinDate: '2024-05-01',
      cropTypes: ['Rice'],
      totalReports: 4,
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
    },

    // Rosa Fernandez (farmerId: 4) - Rice with COMPLETE up-to-date reports
    {
      id: 8,
      farmerId: 4,
      crop: 'Rice',
      variety: 'PSB Rc82',
      plantingDate: '2024-03-01',
      expectedHarvest: '2024-07-01',
      area: 2.0,
      reportDate: '2024-03-15',
      growthStage: 'Germination',
      plantHeight: 10,
      healthStatus: 'Healthy',
      estimatedYield: 2000,
      pestsAndDiseases: 'None',
      weatherImpact: 'Optimal',
      notes: 'Perfect germination conditions'
    },
    {
      id: 9,
      farmerId: 4,
      crop: 'Rice',
      variety: 'PSB Rc82',
      plantingDate: '2024-03-01',
      expectedHarvest: '2024-07-01',
      area: 2.0,
      reportDate: '2024-04-01',
      growthStage: 'Seedling',
      plantHeight: 20,
      healthStatus: 'Healthy',
      estimatedYield: 2200,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good rainfall',
      notes: 'Strong seedling development'
    },
    {
      id: 10,
      farmerId: 4,
      crop: 'Rice',
      variety: 'PSB Rc82',
      plantingDate: '2024-03-01',
      expectedHarvest: '2024-07-01',
      area: 2.0,
      reportDate: '2024-05-01',
      growthStage: 'Tillering',
      plantHeight: 35,
      healthStatus: 'Healthy',
      estimatedYield: 2400,
      pestsAndDiseases: 'None',
      weatherImpact: 'Favorable',
      notes: 'Excellent tillering stage'
    },
    {
      id: 11,
      farmerId: 4,
      crop: 'Rice',
      variety: 'PSB Rc82',
      plantingDate: '2024-03-01',
      expectedHarvest: '2024-07-01',
      area: 2.0,
      reportDate: '2024-06-01',
      growthStage: 'Booting',
      plantHeight: 65,
      healthStatus: 'Healthy',
      estimatedYield: 2600,
      pestsAndDiseases: 'Minor aphids',
      weatherImpact: 'Good',
      notes: 'Entering reproductive stage'
    },
    {
      id: 12,
      farmerId: 4,
      crop: 'Rice',
      variety: 'PSB Rc82',
      plantingDate: '2024-03-01',
      expectedHarvest: '2024-07-01',
      area: 2.0,
      reportDate: '2024-07-01',
      growthStage: 'Heading',
      plantHeight: 85,
      healthStatus: 'Healthy',
      estimatedYield: 2800,
      pestsAndDiseases: 'None',
      weatherImpact: 'Perfect',
      notes: 'Ready for harvest next month'
    },

    // Rosa Fernandez (farmerId: 4) - Corn ongoing (planted recently)
    {
      id: 13,
      farmerId: 4,
      crop: 'Corn',
      variety: 'Pioneer 3155',
      plantingDate: '2025-06-01',
      expectedHarvest: '2025-10-01',
      area: 1.5,
      reportDate: '2025-06-15',
      growthStage: 'Germination',
      plantHeight: 8,
      healthStatus: 'Healthy',
      estimatedYield: 1800,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Recently planted, good emergence'
    },
    {
      id: 14,
      farmerId: 4,
      crop: 'Corn',
      variety: 'Pioneer 3155',
      plantingDate: '2025-06-01',
      expectedHarvest: '2025-10-01',
      area: 1.5,
      reportDate: '2025-07-01',
      growthStage: 'Seedling',
      plantHeight: 18,
      healthStatus: 'Healthy',
      estimatedYield: 2000,
      pestsAndDiseases: 'None',
      weatherImpact: 'Favorable',
      notes: 'Strong early growth'
    },
    {
      id: 15,
      farmerId: 4,
      crop: 'Corn',
      variety: 'Pioneer 3155',
      plantingDate: '2025-06-01',
      expectedHarvest: '2025-10-01',
      area: 1.5,
      reportDate: '2025-08-01',
      growthStage: 'Leaf development',
      plantHeight: 45,
      healthStatus: 'Healthy',
      estimatedYield: 2200,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Developing well, 6 leaves visible'
    },

    // Carlos Reyes (farmerId: 5) - Vegetables ongoing with up-to-date reports
    {
      id: 16,
      farmerId: 5,
      crop: 'Vegetables',
      variety: 'Tomato Cherokee Purple',
      plantingDate: '2025-05-15',
      expectedHarvest: '2025-09-15',
      area: 0.8,
      reportDate: '2025-06-01',
      growthStage: 'Transplanting',
      plantHeight: 12,
      healthStatus: 'Healthy',
      estimatedYield: 800,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Seedlings successfully transplanted'
    },
    {
      id: 17,
      farmerId: 5,
      crop: 'Vegetables',
      variety: 'Tomato Cherokee Purple',
      plantingDate: '2025-05-15',
      expectedHarvest: '2025-09-15',
      area: 0.8,
      reportDate: '2025-07-01',
      growthStage: 'Vegetative',
      plantHeight: 35,
      healthStatus: 'Healthy',
      estimatedYield: 900,
      pestsAndDiseases: 'None',
      weatherImpact: 'Optimal',
      notes: 'Strong vegetative growth, first flowers appearing'
    },
    {
      id: 18,
      farmerId: 5,
      crop: 'Vegetables',
      variety: 'Tomato Cherokee Purple',
      plantingDate: '2025-05-15',
      expectedHarvest: '2025-09-15',
      area: 0.8,
      reportDate: '2025-08-01',
      growthStage: 'Flowering',
      plantHeight: 55,
      healthStatus: 'Healthy',
      estimatedYield: 1000,
      pestsAndDiseases: 'Minor whiteflies',
      weatherImpact: 'Good',
      notes: 'First fruit clusters forming'
    },

    // Carlos Reyes (farmerId: 5) - Corn ongoing
    {
      id: 19,
      farmerId: 5,
      crop: 'Corn',
      variety: 'Sweet Corn Golden Bantam',
      plantingDate: '2025-04-01',
      expectedHarvest: '2025-08-01',
      area: 1.2,
      reportDate: '2025-04-15',
      growthStage: 'Germination',
      plantHeight: 6,
      healthStatus: 'Healthy',
      estimatedYield: 1500,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Good germination rate'
    },
    {
      id: 20,
      farmerId: 5,
      crop: 'Corn',
      variety: 'Sweet Corn Golden Bantam',
      plantingDate: '2025-04-01',
      expectedHarvest: '2025-08-01',
      area: 1.2,
      reportDate: '2025-05-01',
      growthStage: 'Seedling',
      plantHeight: 25,
      healthStatus: 'Healthy',
      estimatedYield: 1600,
      pestsAndDiseases: 'None',
      weatherImpact: 'Favorable',
      notes: 'Rapid early growth'
    },
    {
      id: 21,
      farmerId: 5,
      crop: 'Corn',
      variety: 'Sweet Corn Golden Bantam',
      plantingDate: '2025-04-01',
      expectedHarvest: '2025-08-01',
      area: 1.2,
      reportDate: '2025-06-01',
      growthStage: 'Leaf development',
      plantHeight: 60,
      healthStatus: 'Healthy',
      estimatedYield: 1700,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Strong leaf development, 8 leaves'
    },
    {
      id: 22,
      farmerId: 5,
      crop: 'Corn',
      variety: 'Sweet Corn Golden Bantam',
      plantingDate: '2025-04-01',
      expectedHarvest: '2025-08-01',
      area: 1.2,
      reportDate: '2025-07-01',
      growthStage: 'Stem elongation',
      plantHeight: 120,
      healthStatus: 'Healthy',
      estimatedYield: 1800,
      pestsAndDiseases: 'Minor corn borer',
      weatherImpact: 'Adequate',
      notes: 'Rapid stem elongation, tassels beginning to form'
    },
    {
      id: 23,
      farmerId: 5,
      crop: 'Corn',
      variety: 'Sweet Corn Golden Bantam',
      plantingDate: '2025-04-01',
      expectedHarvest: '2025-08-01',
      area: 1.2,
      reportDate: '2025-08-01',
      growthStage: 'Tasseling',
      plantHeight: 180,
      healthStatus: 'Healthy',
      estimatedYield: 1900,
      pestsAndDiseases: 'None',
      weatherImpact: 'Perfect',
      notes: 'Tassels fully emerged, silks appearing'
    },

    // Ana Gutierrez (farmerId: 6) - Recently planted Rice, very up-to-date
    {
      id: 24,
      farmerId: 6,
      crop: 'Rice',
      variety: 'NSIC Rc240',
      plantingDate: '2025-05-01',
      expectedHarvest: '2025-09-01',
      area: 3.5,
      reportDate: '2025-05-15',
      growthStage: 'Germination',
      plantHeight: 8,
      healthStatus: 'Healthy',
      estimatedYield: 3500,
      pestsAndDiseases: 'None',
      weatherImpact: 'Optimal',
      notes: 'Excellent germination conditions with proper water management'
    },
    {
      id: 25,
      farmerId: 6,
      crop: 'Rice',
      variety: 'NSIC Rc240',
      plantingDate: '2025-05-01',
      expectedHarvest: '2025-09-01',
      area: 3.5,
      reportDate: '2025-06-01',
      growthStage: 'Seedling',
      plantHeight: 18,
      healthStatus: 'Healthy',
      estimatedYield: 3600,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Strong seedling establishment, uniform growth'
    },
    {
      id: 26,
      farmerId: 6,
      crop: 'Rice',
      variety: 'NSIC Rc240',
      plantingDate: '2025-05-01',
      expectedHarvest: '2025-09-01',
      area: 3.5,
      reportDate: '2025-07-01',
      growthStage: 'Tillering',
      plantHeight: 32,
      healthStatus: 'Healthy',
      estimatedYield: 3800,
      pestsAndDiseases: 'None',
      weatherImpact: 'Favorable',
      notes: 'Active tillering stage, 4-5 tillers per plant'
    },
    {
      id: 27,
      farmerId: 6,
      crop: 'Rice',
      variety: 'NSIC Rc240',
      plantingDate: '2025-05-01',
      expectedHarvest: '2025-09-01',
      area: 3.5,
      reportDate: '2025-08-01',
      growthStage: 'Stem elongation',
      plantHeight: 58,
      healthStatus: 'Healthy',
      estimatedYield: 4000,
      pestsAndDiseases: 'None',
      weatherImpact: 'Good',
      notes: 'Stem elongation progressing well, preparing for reproductive stage'
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
    <div className="mt-[5%] min-h-screen bg-gray-50">
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
                    <option value="bulacan">Bulacan</option>
                    <option value="bataan">Bataan</option>
                    <option value="pampanga">Pampanga</option>
                    <option value="tarlac">Tarlac</option>
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
                                  <div className="mt-2">
                                    <button
                                      onClick={() => {
                                        setSelectedCrop({
                                          ...crop,
                                          expectedMonths,
                                          farmerId: currentFarmer.id
                                        });
                                        setShowCropReportsModal(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                      View All Reports →
                                    </button>
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

                            {/* Expected Report Timeline */}
                            <div className="px-6 py-4 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-3">
                                <h6 className="font-semibold text-gray-800">📅 Report Timeline</h6>
                                <span className="text-sm text-gray-500">
                                  {crop.reports.length} of {expectedMonths.length} reports submitted
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {expectedMonths.map((month, monthIndex) => {
                                  const hasReport = crop.reports.some(report => 
                                    report.reportDate.startsWith(month)
                                  );
                                  const isCurrentMonth = month === new Date().toISOString().slice(0, 7);
                                  const isPastMonth = month < new Date().toISOString().slice(0, 7);
                                  
                                  return (
                                    <div 
                                      key={month} 
                                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                        hasReport 
                                          ? 'bg-green-100 border-green-400 text-green-800' 
                                          : isCurrentMonth
                                            ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                                            : isPastMonth
                                              ? 'bg-red-100 border-red-400 text-red-800'
                                              : 'bg-gray-100 border-gray-300 text-gray-600'
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

                    {/* Growth Charts Section */}
                    {getFarmerCrops(currentFarmer.id).length > 0 && (
                      <div className="space-y-6">
                        {getFarmerCrops(currentFarmer.id).map((crop, cropIndex) => {
                          if (crop.reports.length === 0) return null;
                          
                          // Growth data for charts
                          const chartData = {
                            labels: crop.reports.map(r => r.reportDate),
                            datasets: [{
                              label: 'Plant Height (cm)',
                              data: crop.reports.map(r => r.plantHeight),
                              borderColor: '#10B981',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              tension: 0.4,
                              fill: true
                            }]
                          };

                          const yieldChartData = {
                            labels: crop.reports.map(r => r.reportDate),
                            datasets: [{
                              label: 'Estimated Yield (kg)',
                              data: crop.reports.map(r => r.estimatedYield),
                              borderColor: '#F59E0B',
                              backgroundColor: 'rgba(245, 158, 11, 0.1)',
                              tension: 0.4,
                              fill: true
                            }]
                          };

                          const heightOptions = {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { 
                                display: false 
                              },
                              title: {
                                display: true,
                                text: `${crop.cropType} - Growth Progress`,
                                font: { size: 14, weight: 'bold' }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: 'Height (cm)'
                                }
                              },
                              x: {
                                title: {
                                  display: true,
                                  text: 'Report Date'
                                }
                              }
                            }
                          };

                          const yieldOptions = {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { 
                                display: false 
                              },
                              title: {
                                display: true,
                                text: `${crop.cropType} - Yield Estimation`,
                                font: { size: 14, weight: 'bold' }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: 'Yield (kg)'
                                }
                              },
                              x: {
                                title: {
                                  display: true,
                                  text: 'Report Date'
                                }
                              }
                            }
                          };

                          return (
                            <div key={cropIndex} className="bg-white border border-gray-200 rounded-lg p-6">
                              <div className="mb-4">
                                <h6 className="font-semibold text-gray-800">{crop.cropType} - Growth Analytics</h6>
                                <p className="text-sm text-gray-600">
                                  Planted: {crop.plantingDate} • Area: {crop.area} hectares • Reports: {crop.reports.length}
                                </p>
                              </div>
                              
                              {/* Charts Grid */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div style={{ height: '250px' }}>
                                  <Line data={chartData} options={heightOptions} />
                                </div>
                                <div style={{ height: '250px' }}>
                                  <Line data={yieldChartData} options={yieldOptions} />
                                </div>
                              </div>
                              
                              {/* Recent Reports Timeline */}
                              <div className="border-t pt-4">
                                <h6 className="font-medium text-gray-800 mb-3">📈 Recent Reports Timeline</h6>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                  {crop.reports.slice(-5).reverse().map((report, reportIndex) => (
                                    <div key={reportIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                          report.healthStatus === 'Healthy' ? 'bg-green-500' :
                                          report.healthStatus === 'Warning' ? 'bg-yellow-500' :
                                          report.healthStatus === 'Critical' ? 'bg-red-500' :
                                          'bg-gray-500'
                                        }`}></div>
                                        <div>
                                          <div className="text-sm font-medium text-gray-800">{report.reportDate}</div>
                                          <div className="text-xs text-gray-600">Stage: {report.growthStage}</div>
                                        </div>
                                      </div>
                                      <div className="text-right text-sm">
                                        <div className="font-medium">{report.plantHeight}cm</div>
                                        <div className="text-gray-600">{report.estimatedYield}kg</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Crop Reports Modal */}
        {showCropReportsModal && selectedCrop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCrop.cropType} - {selectedCrop.variety}</h2>
                    <p className="text-green-100 mt-1">
                      Planted: {selectedCrop.plantingDate} • Expected Harvest: {selectedCrop.expectedHarvest} • Area: {selectedCrop.area} hectares
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCropReportsModal(false)}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                {/* Expected Harvest Timeline */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    📅 Expected Monthly Reports Timeline
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {selectedCrop.expectedMonths.map((month, index) => {
                        const hasReport = selectedCrop.reports?.some(report => 
                          report.reportDate.startsWith(month)
                        );
                        const isCurrentMonth = month === new Date().toISOString().slice(0, 7);
                        const isPastMonth = month < new Date().toISOString().slice(0, 7);
                        
                        return (
                          <div 
                            key={month} 
                            className={`p-3 rounded-lg text-center border-2 transition-all ${
                              hasReport 
                                ? 'bg-green-100 border-green-400 text-green-800' 
                                : isCurrentMonth
                                  ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                                  : isPastMonth
                                    ? 'bg-red-100 border-red-400 text-red-800'
                                    : 'bg-gray-100 border-gray-300 text-gray-600'
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {new Date(month + '-01').toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="text-xs mt-1">
                              {hasReport ? '✓ Reported' : 
                               isCurrentMonth ? '📍 Current' :
                               isPastMonth ? '⚠ Missing' : '⏳ Pending'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded mr-2"></div>
                        <span className="text-gray-700">Report Submitted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded mr-2"></div>
                        <span className="text-gray-700">Current Month</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded mr-2"></div>
                        <span className="text-gray-700">Missing Report</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div>
                        <span className="text-gray-700">Future Report</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Reports List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    📋 Monthly Reports ({selectedCrop.reports?.length || 0} reports)
                  </h3>
                  
                  {selectedCrop.reports && selectedCrop.reports.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCrop.reports
                        .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
                        .map((report, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          {/* Report Header */}
                          <div className={`px-6 py-4 border-l-4 ${
                            report.healthStatus === 'Healthy' ? 'bg-green-50 border-green-500' :
                            report.healthStatus === 'Warning' ? 'bg-yellow-50 border-yellow-500' :
                            report.healthStatus === 'Critical' ? 'bg-red-50 border-red-500' :
                            'bg-gray-50 border-gray-500'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800">
                                Report #{selectedCrop.reports.length - index} - {report.reportDate}
                              </h4>
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  report.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                                  report.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                  report.healthStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {report.healthStatus}
                                </span>
                                <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                                  {report.growthStage}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">📏 Height:</span>
                                <span className="font-medium">{report.plantHeight}cm</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">🌾 Est. Yield:</span>
                                <span className="font-medium">{report.estimatedYield}kg</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">🐛 Pests:</span>
                                <span className="font-medium">{report.pestsAndDiseases || 'None'}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">🌤 Weather:</span>
                                <span className="font-medium">{report.weatherImpact || 'Normal'}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Report Details */}
                          {report.notes && (
                            <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                              <p className="text-blue-800 font-semibold text-sm">📝 Additional Notes:</p>
                              <p className="text-blue-700 text-sm mt-1">{report.notes}</p>
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
    </div>
  );
}

export default Seed_Track;
