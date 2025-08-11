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

// Professional modal animation styles
const modalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = modalStyles;
  if (!document.head.querySelector('style[data-seed-track]')) {
    styleSheet.setAttribute('data-seed-track', 'true');
    document.head.appendChild(styleSheet);
  }
}

// Add fadeIn animation styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Helper to show alert
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

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

  // Filter function for farmers with search
  const getFilteredFarmers = () => {
    return farmers.filter(farmer => {
      if (filters.status !== 'all' && farmer.status.toLowerCase() !== filters.status) {
        return false;
      }
      if (filters.location !== 'all' && !farmer.location.toLowerCase().includes(filters.location)) {
        return false;
      }
      if (filters.search && !farmer.name.toLowerCase().includes(filters.search.toLowerCase()) && 
          !farmer.email.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  // Pagination logic
  const getPaginatedFarmers = () => {
    const filtered = getFilteredFarmers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredFarmers().length / itemsPerPage);
  };

  return (
    <div className="mt-[5%] min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Alert */}
        {alert && alert.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
            alert.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        {/* EIC-style Title Section - matching Inventory format */}
        <div className="relative mb-6 mt-2 sm:mt-8 p-3 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
          <span className="inline-flex items-center justify-center gap-3 w-full">
            <span className="rounded-full bg-green-100 p-2">
              <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
              Seed Tracking
            </span>
          </span>
          <span className="block text-base md:text-lg text-gray-500 font-medium mt-1">
            Monitor and track farmer seed planting progress and crop reports.
          </span>
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center min-h-[91vh] w-full bg-white rounded-xl shadow mt-2 transition-all">
          <div className="w-full p-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{farmers.length}</div>
                <p className="text-xs sm:text-sm text-gray-600">Total Farmers</p>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{sampleSeedTrackingData.length}</div>
                <p className="text-xs sm:text-sm text-gray-600">Total Reports</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-700">{getOverviewStatistics().activeCrops}</div>
                <p className="text-xs sm:text-sm text-green-600">Active Crops</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-700">{getOverviewStatistics().recentReports}</div>
                <p className="text-xs sm:text-sm text-green-600">Recent Reports</p>
              </div>
            </div>

            {/* Enhanced Navigation Tabs - 60-30-10 color scheme */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-100">
            <nav className="-mb-px flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-4 sm:px-6 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-gray-900 bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">Overview</span>
              </button>
              
              {/* Dynamic Farmer Tabs */}
              {openFarmerTabs.map((farmer) => (
                <div
                  key={farmer.farmerId}
                  className={`flex items-center border-b-2 transition-all duration-200 ${
                    activeTab === 'farmer' && activeFarmerId === farmer.farmerId
                      ? 'border-green-500 text-gray-900 bg-gray-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveTab('farmer');
                      setActiveFarmerId(farmer.farmerId);
                    }}
                    className="py-4 px-3 sm:px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="hidden sm:inline">{farmer.name}</span>
                    <span className="sm:hidden">{farmer.name.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={(e) => closeFarmerTab(farmer.farmerId, e)}
                    className="px-2 py-4 text-gray-400 hover:text-red-500 transition-colors"
                    title="Close tab"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Overview Statistics - Enhanced 60-30-10 color scheme */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {(() => {
                const stats = getOverviewStatistics();
                return (
                  <>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalFarmers}</h3>
                          <p className="text-sm text-gray-600">Total Farmers</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalReports}</h3>
                          <p className="text-sm text-gray-600">Total Reports</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-4 sm:p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-green-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-green-700">{stats.activeCrops}</h3>
                          <p className="text-sm text-green-600">Active Crops</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-4 sm:p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-green-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-green-700">{stats.recentReports}</h3>
                          <p className="text-sm text-green-600">Recent Reports</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Analytics Charts - Enhanced 60-30-10 color scheme */}
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
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Crop Distribution
                      </h3>
                      <div style={{ height: '300px' }}>
                        <Doughnut data={cropChartData} options={chartOptions} />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Health Status Distribution
                      </h3>
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

            {/* Enhanced Filters - 60-30-10 color scheme */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search farmers by name or email..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Farmers Table - 60-30-10 color scheme */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Farmers Directory
                  </h3>
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredFarmers().length)} of {getFilteredFarmers().length} farmers
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crops</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedFarmers().map((farmer) => (
                      <tr key={farmer.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-green-700 font-bold text-sm border border-green-200">
                              {farmer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{farmer.name}</div>
                              <div className="text-xs text-gray-500">ID: {farmer.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{farmer.email}</div>
                          <div className="text-sm text-gray-500">{farmer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{farmer.location}</div>
                          <div className="text-xs text-gray-500">Joined: {farmer.joinDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {farmer.cropTypes.map((crop, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-medium text-gray-900">{farmer.totalReports}</div>
                          <div className="text-xs text-gray-500">reports</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            farmer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {farmer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openFarmerTab({ farmerId: farmer.id, name: farmer.name, ...farmer })}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {getTotalPages()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, getTotalPages()) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                              currentPage === pageNum
                                ? 'bg-green-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                      disabled={currentPage === getTotalPages()}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Farmer Detail Tab - 60-30-10 color scheme */}
        {activeTab === 'farmer' && activeFarmerId && (() => {
          const currentFarmer = getCurrentFarmer();
          if (!currentFarmer) return null;
          
          return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* Enhanced Farmer Header */}
              <div className="border-b border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center text-green-700 font-bold text-xl border border-green-200">
                      {currentFarmer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-900">{currentFarmer.name}</h2>
                      <p className="text-gray-600">{currentFarmer.email}</p>
                      <p className="text-gray-600">{currentFarmer.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      currentFarmer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {currentFarmer.status}
                    </span>
                  </div>
                </div>

                {/* Enhanced Sub Navigation */}
                <div className="mt-6">
                  <nav className="flex flex-wrap gap-2 sm:gap-8">
                    <button
                      onClick={() => setSelectedFarmerTab('reports')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        selectedFarmerTab === 'reports'
                          ? 'border-green-500 text-gray-900'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="hidden sm:inline">Reports & Crops</span>
                      <span className="sm:hidden">Reports</span>
                    </button>
                    <button
                      onClick={() => setSelectedFarmerTab('analytics')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        selectedFarmerTab === 'analytics'
                          ? 'border-green-500 text-gray-900'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="hidden sm:inline">Analytics</span>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Enhanced Tab Content */}
              <div className="p-4 sm:p-6">
                {/* Reports Tab */}
                {selectedFarmerTab === 'reports' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Farmer's Crops & Reports
                      </h4>
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
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

        {/* Professional Crop Reports Modal with Enhanced Styling */}
        {showCropReportsModal && selectedCrop && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 transform transition-all duration-300 ease-out scale-100">
              {/* Professional Modal Header */}
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white p-6 border-b-4 border-green-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{selectedCrop.cropType} - {selectedCrop.variety}</h2>
                      <p className="text-green-100 mt-1 font-medium">
                        🌱 Planted: {selectedCrop.plantingDate} • 🌾 Expected Harvest: {selectedCrop.expectedHarvest} • 📏 Area: {selectedCrop.area} hectares
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCropReportsModal(false)}
                    className="text-white hover:text-red-200 hover:bg-white hover:bg-opacity-20 text-2xl font-bold w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Professional Modal Body with Enhanced Styling */}
              <div className="p-6 max-h-[calc(90vh-160px)] overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
                {/* Expected Harvest Timeline with Professional Styling */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center border-b border-gray-200 pb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      📅
                    </div>
                    Expected Monthly Reports Timeline
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
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
                            className={`p-4 rounded-xl text-center border-2 transition-all duration-200 transform hover:scale-105 shadow-sm ${
                              hasReport 
                                ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-800 shadow-green-100' 
                                : isCurrentMonth
                                  ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 text-yellow-800 shadow-yellow-100'
                                  : isPastMonth
                                    ? 'bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-800 shadow-red-100'
                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-600 shadow-gray-100'
                            }`}
                          >
                            <div className="text-sm font-bold">
                              {new Date(month + '-01').toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="text-xs mt-2 font-medium">
                              {hasReport ? '✅ Reported' : 
                               isCurrentMonth ? '📍 Current' :
                               isPastMonth ? '⚠️ Missing' : '⏳ Pending'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-6 text-sm bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded-lg mr-3 shadow-sm"></div>
                        <span className="text-gray-700 font-medium">Report Submitted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-lg mr-3 shadow-sm"></div>
                        <span className="text-gray-700 font-medium">Current Month</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-lg mr-3 shadow-sm"></div>
                        <span className="text-gray-700 font-medium">Missing Report</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-lg mr-3 shadow-sm"></div>
                        <span className="text-gray-700 font-medium">Future Report</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Detailed Reports List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center border-b border-gray-200 pb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      📋
                    </div>
                    Monthly Reports ({selectedCrop.reports?.length || 0} reports)
                  </h3>
                  
                  {selectedCrop.reports && selectedCrop.reports.length > 0 ? (
                    <div className="space-y-6">
                      {selectedCrop.reports
                        .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
                        .map((report, index) => (
                        <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                          {/* Professional Report Header */}
                          <div className={`px-6 py-5 border-l-8 ${
                            report.healthStatus === 'Healthy' ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-500' :
                            report.healthStatus === 'Warning' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-500' :
                            report.healthStatus === 'Critical' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-500' :
                            'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-500'
                          }`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm text-sm font-bold text-gray-600">
                                  #{selectedCrop.reports.length - index}
                                </span>
                                Report - {report.reportDate}
                              </h4>
                              <div className="flex items-center space-x-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                                  report.healthStatus === 'Healthy' ? 'bg-green-500 text-white' :
                                  report.healthStatus === 'Warning' ? 'bg-yellow-500 text-white' :
                                  report.healthStatus === 'Critical' ? 'bg-red-500 text-white' :
                                  'bg-gray-500 text-white'
                                }`}>
                                  {report.healthStatus}
                                </span>
                                <span className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg font-medium shadow-sm border border-gray-200">
                                  {report.growthStage}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <span className="text-blue-600 mr-2 text-lg">📏</span>
                                <div>
                                  <span className="text-gray-600 block text-xs">Height</span>
                                  <span className="font-bold text-gray-800">{report.plantHeight}cm</span>
                                </div>
                              </div>
                              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <span className="text-green-600 mr-2 text-lg">🌾</span>
                                <div>
                                  <span className="text-gray-600 block text-xs">Est. Yield</span>
                                  <span className="font-bold text-gray-800">{report.estimatedYield}kg</span>
                                </div>
                              </div>
                              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <span className="text-orange-600 mr-2 text-lg">🐛</span>
                                <div>
                                  <span className="text-gray-600 block text-xs">Pests</span>
                                  <span className="font-bold text-gray-800">{report.pestsAndDiseases || 'None'}</span>
                                </div>
                              </div>
                              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <span className="text-sky-600 mr-2 text-lg">🌤</span>
                                <div>
                                  <span className="text-gray-600 block text-xs">Weather</span>
                                  <span className="font-bold text-gray-800">{report.weatherImpact || 'Normal'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Professional Report Notes */}
                          {report.notes && (
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold mt-1">
                                  📝
                                </div>
                                <div>
                                  <p className="text-blue-800 font-bold text-sm mb-1">Additional Notes:</p>
                                  <p className="text-blue-700 text-sm leading-relaxed">{report.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📋</span>
                      </div>
                      <p className="text-xl font-bold text-gray-700 mb-2">No reports submitted yet</p>
                      <p className="text-gray-500">Reports will appear here as the farmer submits monthly updates</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
        </div>
      </div>
    </div>
  );
}

export default Seed_Track;
