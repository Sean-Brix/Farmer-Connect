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
  const [openFarmerTabs, setOpenFarmerTabs] = useState([]);
  const [activeFarmerId, setActiveFarmerId] = useState(null);
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

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    location: 'all'
  });

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Crop Guidelines state
  const [cropGuidelines, setCropGuidelines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuidelineModal, setShowGuidelineModal] = useState(false);
  const [selectedGuideline, setSelectedGuideline] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [guidelineToDelete, setGuidelineToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState(null);
  const [newGuideline, setNewGuideline] = useState({
    name: '',
    category: 'cereals',
    varieties: [''],
    plantingSeasons: [''],
    growingPeriod: '',
    waterRequirements: '',
    expectedYield: '',
    soilType: '',
    climate: '',
    spacing: '',
    fertilizer: '',
    plantingTips: [''],
    careInstructions: [''],
    harvestingTips: [''],
    keyTips: [''],
    commonPests: [''],
    diseases: [''],
    fertilizers: [''],
    stages: [{ stage: '', duration: '', description: '', activities: [''] }],
    marketPrice: '',
    profitability: 'Moderate',
    difficulty: 'Easy'
  });

  // Load crop guidelines data on component mount
  useEffect(() => {
    // Sample crop guidelines data
    setCropGuidelines([
      {
        id: 1,
        name: 'Rice (Palay)',
        category: 'cereals',
        varieties: ['IR64', 'PSB Rc82', 'NSIC Rc222'],
        plantingSeasons: ['Wet Season (Jun-Oct)', 'Dry Season (Nov-May)'],
        growingPeriod: '120-150 days',
        waterRequirements: 'High (flooded fields)',
        expectedYield: '4-6 tons/hectare',
        soilType: 'Clay loam, well-drained',
        climate: 'Tropical, warm and humid',
        spacing: '20cm x 20cm',
        fertilizer: 'NPK 14-14-14 at planting, Urea for topdressing',
        keyTips: [
          'Maintain 2-5cm water level during vegetative stage',
          'Transplant seedlings at 21-25 days old',
          'Apply fertilizer in split applications'
        ],
        commonPests: ['Rice bug', 'Stem borer', 'Brown planthopper'],
        diseases: ['Rice blast', 'Bacterial leaf blight', 'Sheath blight'],
        stages: [
          { stage: 'Land Preparation', duration: '2-3 weeks', description: 'Plow and harrow fields', activities: ['Plowing', 'Harrowing'] },
          { stage: 'Seedling', duration: '21-25 days', description: 'Prepare seedbed', activities: ['Seed selection', 'Nursery care'] }
        ],
        marketPrice: '₱20-25 per kg',
        profitability: 'High',
        difficulty: 'Moderate',
        createdAt: '2024-01-15',
        updatedAt: '2024-02-01'
      },
      {
        id: 2,
        name: 'Corn',
        category: 'cereals',
        varieties: ['Pioneer 30G95', 'Dekalb 9108', 'NK 6410'],
        plantingSeasons: ['Dry Season (Nov-Feb)', 'Wet Season (May-Aug)'],
        growingPeriod: '90-120 days',
        waterRequirements: 'Medium (600-800mm total)',
        expectedYield: '3-5 tons/hectare',
        soilType: 'Well-drained loam, pH 6.0-7.0',
        climate: 'Warm, adequate rainfall or irrigation',
        spacing: '75cm x 25cm',
        fertilizer: 'Complete fertilizer 14-14-14, side-dress with Urea',
        keyTips: [
          'Plant 2-3 seeds per hill, thin to strongest seedling',
          'Hill up soil around plants at 30-45 days',
          'Side-dress with nitrogen at knee-high stage'
        ],
        commonPests: ['Corn borer', 'Fall armyworm', 'Corn rootworm'],
        diseases: ['Corn rust', 'Leaf blight', 'Ear rot'],
        stages: [
          { stage: 'Land Preparation', duration: '1-2 weeks', description: 'Prepare well-drained fields', activities: ['Deep plowing', 'Harrowing'] },
          { stage: 'Planting', duration: '1 week', description: 'Direct seeding', activities: ['Seed treatment', 'Planting'] }
        ],
        marketPrice: '₱15-20 per kg',
        profitability: 'High',
        difficulty: 'Easy',
        createdAt: '2024-01-20',
        updatedAt: '2024-02-05'
      },
      {
        id: 3,
        name: 'Tomato',
        category: 'vegetables',
        varieties: ['Cherokee Purple', 'Determinate hybrids', 'Cherry tomatoes'],
        plantingSeasons: ['Cool Season (Oct-Mar)', 'Highland areas year-round'],
        growingPeriod: '90-120 days',
        waterRequirements: 'Medium-High (consistent moisture)',
        expectedYield: '15-25 tons/hectare',
        soilType: 'Well-drained, fertile loam, pH 6.0-6.8',
        climate: 'Cool to warm, avoid extreme heat',
        spacing: '60cm x 40cm',
        fertilizer: 'High phosphorus at planting, regular NPK applications',
        keyTips: [
          'Start from healthy seedlings in nursery',
          'Provide sturdy support systems',
          'Prune suckers regularly for better fruit quality'
        ],
        commonPests: ['Fruit borer', 'Whitefly', 'Aphids'],
        diseases: ['Early blight', 'Late blight', 'Bacterial wilt'],
        stages: [
          { stage: 'Nursery', duration: '25-30 days', description: 'Seedling production', activities: ['Seed sowing', 'Seedling care'] },
          { stage: 'Transplanting', duration: '1 week', description: 'Moving to field', activities: ['Land preparation', 'Transplanting'] }
        ],
        marketPrice: '₱40-80 per kg',
        profitability: 'Very High',
        difficulty: 'Moderate-High',
        createdAt: '2024-02-01',
        updatedAt: '2024-02-10'
      }
    ]);
  }, []);

  // Export overview data function
  const exportOverviewData = () => {
    try {
      const stats = getOverviewStatistics();
      const exportData = {
        exportInfo: {
          title: 'Seed Track Overview Export',
          exportDate: new Date().toISOString(),
          exportedBy: 'Admin'
        },
        overviewStatistics: {
          totalFarmers: stats.totalFarmers,
          totalReports: stats.totalReports,
          recentReports: stats.recentReports,
          activeCrops: stats.activeCrops,
          cropDistribution: stats.cropDistribution,
          healthDistribution: stats.healthDistribution
        },
        farmersData: farmers.map(farmer => ({
          id: farmer.id,
          name: farmer.name,
          email: farmer.email,
          location: farmer.location,
          farmSize: parseFloat(farmer.area || 0),
          joinDate: farmer.joinDate,
          cropTypes: farmer.cropTypes,
          totalReports: farmer.totalReports,
          status: farmer.status
        })),
        reportsData: sampleSeedTrackingData.map(report => ({
          farmerId: report.farmerId,
          crop: report.crop,
          variety: report.variety,
          plantingDate: report.plantingDate,
          reportDate: report.reportDate,
          growthStage: report.growthStage,
          plantHeight: report.plantHeight,
          healthStatus: report.healthStatus,
          estimatedYield: report.estimatedYield,
          area: report.area
        })),
        summary: {
          generatedAt: new Date().toISOString(),
          totalRecords: farmers.length + sampleSeedTrackingData.length,
          dataIntegrity: 'Complete'
        }
      };

      // Convert to JSON and download
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `seed_track_overview_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showAlert('Overview data exported successfully!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showAlert('Error exporting data. Please try again.', 'error');
    }
  };

  // Crop Guidelines functions
  const categoryOptions = [
    { value: 'cereals', label: 'Cereals & Grains', icon: '🌾' },
    { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'fruits', label: 'Fruits', icon: '🍎' },
    { value: 'legumes', label: 'Legumes', icon: '🫘' },
    { value: 'root_crops', label: 'Root Crops', icon: '🥔' },
    { value: 'herbs_spices', label: 'Herbs & Spices', icon: '🌿' }
  ];

  const filteredGuidelines = cropGuidelines.filter(guideline => {
    const matchesCategory = selectedCategory === 'all' || guideline.category === selectedCategory;
    const matchesSearch = guideline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.varieties.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddGuideline = () => {
    if (!newGuideline.name || !newGuideline.expectedYield) {
      alert('Please fill in all required fields');
      return;
    }

    const guideline = {
      id: Date.now(),
      ...newGuideline,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setCropGuidelines(prev => [guideline, ...prev]);
    resetGuidelineForm();
    setShowCreateModal(false);
    showAlert('Crop guideline added successfully!', 'success');
  };

  const handleEditGuideline = (guideline) => {
    setNewGuideline({
      name: guideline.name,
      category: guideline.category,
      varieties: [...guideline.varieties],
      plantingSeasons: [...guideline.plantingSeasons],
      growingPeriod: guideline.growingPeriod,
      waterRequirements: guideline.waterRequirements,
      expectedYield: guideline.expectedYield,
      soilType: guideline.soilType,
      climate: guideline.climate,
      spacing: guideline.spacing,
      fertilizer: guideline.fertilizer,
      plantingTips: guideline.plantingTips ? [...guideline.plantingTips] : [''],
      careInstructions: guideline.careInstructions ? [...guideline.careInstructions] : [''],
      harvestingTips: guideline.harvestingTips ? [...guideline.harvestingTips] : [''],
      keyTips: guideline.keyTips ? [...guideline.keyTips] : [''],
      commonPests: guideline.commonPests ? [...guideline.commonPests] : [''],
      diseases: guideline.diseases ? [...guideline.diseases] : [''],
      fertilizers: guideline.fertilizers ? [...guideline.fertilizers] : [''],
      stages: (guideline.stages || []).map(stage => ({
        ...stage,
        activities: [...(stage.activities || [])]
      })),
      marketPrice: guideline.marketPrice,
      profitability: guideline.profitability,
      difficulty: guideline.difficulty
    });
    setEditingGuideline(guideline);
    setShowCreateModal(true);
  };

  const handleUpdateGuideline = () => {
    if (!newGuideline.name || !newGuideline.expectedYield) {
      alert('Please fill in all required fields');
      return;
    }

    setCropGuidelines(prev => prev.map(g => 
      g.id === editingGuideline.id 
        ? { ...g, ...newGuideline, updatedAt: new Date().toISOString().split('T')[0] }
        : g
    ));

    resetGuidelineForm();
    setShowCreateModal(false);
    setEditingGuideline(null);
    showAlert('Crop guideline updated successfully!', 'success');
  };

  const handleDeleteGuideline = (id) => {
    setCropGuidelines(prev => prev.filter(g => g.id !== id));
    setShowDeleteModal(false);
    setGuidelineToDelete(null);
    showAlert('Crop guideline deleted successfully!', 'success');
  };

  const resetGuidelineForm = () => {
    setNewGuideline({
      name: '',
      category: 'cereals',
      varieties: [''],
      plantingSeasons: [''],
      growingPeriod: '',
      waterRequirements: '',
      expectedYield: '',
      soilType: '',
      climate: '',
      spacing: '',
      fertilizer: '',
      plantingTips: [''],
      careInstructions: [''],
      harvestingTips: [''],
      keyTips: [''],
      commonPests: [''],
      diseases: [''],
      fertilizers: [''],
      stages: [{ stage: '', duration: '', description: '', activities: [''] }],
      marketPrice: '',
      profitability: 'Moderate',
      difficulty: 'Easy'
    });
  };

  const addArrayField = (field, value = '') => {
    setNewGuideline(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };

  const updateArrayField = (field, index, value) => {
    setNewGuideline(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field, index) => {
    setNewGuideline(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addStage = () => {
    setNewGuideline(prev => ({
      ...prev,
      stages: [...prev.stages, { stage: '', duration: '', description: '', activities: [''] }]
    }));
  };

  const updateStage = (index, field, value) => {
    setNewGuideline(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === index ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const removeStage = (index) => {
    setNewGuideline(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const addStageActivity = (stageIndex) => {
    setNewGuideline(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === stageIndex ? { ...stage, activities: [...stage.activities, ''] } : stage
      )
    }));
  };

  const updateStageActivity = (stageIndex, activityIndex, value) => {
    setNewGuideline(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === stageIndex ? {
          ...stage,
          activities: stage.activities.map((activity, j) => 
            j === activityIndex ? value : activity
          )
        } : stage
      )
    }));
  };

  const removeStageActivity = (stageIndex, activityIndex) => {
    setNewGuideline(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === stageIndex ? {
          ...stage,
          activities: stage.activities.filter((_, j) => j !== activityIndex)
        } : stage
      )
    }));
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        {alert && alert.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 max-w-sm ${
            alert.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-gray-50 border-gray-500 text-gray-800'
          }`}>
            <span className="font-medium text-sm">{alert.message}</span>
          </div>
        )}

        {/* Professional Title Section */}
        <div className="text-center mb-8 sm:mt-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl border border-green-200">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Seed Tracking System
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor and track farmer seed planting progress with comprehensive crop reports
          </p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 lg:p-8">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors duration-200 ${
                    activeTab === 'overview'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Overview
                </button>

                <button
                  onClick={() => setActiveTab('guidelines')}
                  className={`py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors duration-200 ${
                    activeTab === 'guidelines'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="hidden sm:inline">Crop Guidelines</span>
                  <span className="sm:hidden">Guidelines</span>
                </button>
                
                {/* Dynamic Farmer Tabs */}
                {openFarmerTabs.map((farmer) => (
                  <div
                    key={farmer.farmerId}
                    className={`flex items-center border-b-2 ${
                      activeFarmerId === farmer.farmerId && activeTab === 'farmer'
                        ? 'border-green-600'
                        : 'border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveFarmerId(farmer.farmerId);
                        setActiveTab('farmer');
                      }}
                      className={`py-3 px-1 text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-colors duration-200 ${
                        activeFarmerId === farmer.farmerId && activeTab === 'farmer'
                          ? 'text-green-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="hidden sm:inline">{farmer.name}</span>
                      <span className="sm:hidden">{farmer.name.split(' ')[0]}</span>
                    </button>
                    <button
                      onClick={(e) => closeFarmerTab(farmer.farmerId, e)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Overview Statistics - Clean Professional Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {(() => {
                const stats = getOverviewStatistics();
                return (
                  <>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-black">{stats.totalFarmers}</h3>
                          <p className="text-sm text-gray-600 font-medium">Total Farmers</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-black">{stats.totalReports}</h3>
                          <p className="text-sm text-gray-600 font-medium">Total Reports</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-black">{stats.activeCrops}</h3>
                          <p className="text-sm text-gray-600 font-medium">Active Crops</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-black">{stats.recentReports}</h3>
                          <p className="text-sm text-gray-600 font-medium">Recent Reports</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Analytics Charts - Modern Design with 3 charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {(() => {
                const stats = getOverviewStatistics();
                
                // Modern Crop Distribution Chart Data with gradient-inspired colors
                const cropChartData = {
                  labels: Object.keys(stats.cropDistribution),
                  datasets: [{
                    data: Object.values(stats.cropDistribution),
                    backgroundColor: [
                      '#10B981', // Emerald 500
                      '#059669', // Emerald 600  
                      '#047857', // Emerald 700
                      '#065F46', // Emerald 800
                      '#6B7280', // Gray 500
                      '#4B5563'  // Gray 600
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff',
                    hoverOffset: 8
                  }]
                };

                // Modern Health Status Chart Data with enhanced styling
                const healthChartData = {
                  labels: Object.keys(stats.healthDistribution),
                  datasets: [{
                    label: 'Reports',
                    data: Object.values(stats.healthDistribution),
                    backgroundColor: [
                      '#10B981', // Healthy - Emerald
                      '#6B7280', // Warning - Gray  
                      '#374151', // Critical - Dark Gray
                      '#9CA3AF'  // Unknown - Light Gray
                    ],
                    borderWidth: 0,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 40,
                    maxBarThickness: 50
                  }]
                };

                // Monthly Reports Trend Chart Data
                const monthlyTrendData = {
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  datasets: [{
                    label: 'Reports Submitted',
                    data: [12, 19, 15, 25, 22, 30, 28, 35],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10B981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                  }]
                };

                // Modern chart options with enhanced styling
                const modernChartOptions = {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 24,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: '#374151',
                        font: {
                          size: 13,
                          weight: '500',
                          family: 'Inter, system-ui, sans-serif'
                        },
                        generateLabels: function(chart) {
                          const data = chart.data;
                          if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                              const meta = chart.getDatasetMeta(0);
                              const style = meta.controller.getStyle(i);
                              return {
                                text: label,
                                fillStyle: style.backgroundColor,
                                strokeStyle: style.borderColor,
                                lineWidth: style.borderWidth,
                                pointStyle: 'circle',
                                hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
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
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      borderColor: '#10B981',
                      borderWidth: 1,
                      cornerRadius: 8,
                      padding: 12,
                      titleFont: {
                        size: 14,
                        weight: '600'
                      },
                      bodyFont: {
                        size: 13,
                        weight: '400'
                      }
                    }
                  }
                };

                const modernBarOptions = {
                  ...modernChartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      border: {
                        display: false
                      },
                      grid: {
                        color: '#F3F4F6',
                        drawBorder: false
                      },
                      ticks: {
                        stepSize: 1,
                        color: '#6B7280',
                        font: {
                          size: 12,
                          weight: '500'
                        },
                        padding: 8
                      }
                    },
                    x: {
                      border: {
                        display: false
                      },
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 12,
                          weight: '500'
                        },
                        padding: 8
                      }
                    }
                  }
                };

                const modernLineOptions = {
                  ...modernChartOptions,
                  plugins: {
                    ...modernChartOptions.plugins,
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      border: {
                        display: false
                      },
                      grid: {
                        color: '#F3F4F6',
                        drawBorder: false
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 12,
                          weight: '500'
                        },
                        padding: 8
                      }
                    },
                    x: {
                      border: {
                        display: false
                      },
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#6B7280',
                        font: {
                          size: 12,
                          weight: '500'
                        },
                        padding: 8
                      }
                    }
                  }
                };

                return (
                  <>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          Crop Distribution
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {Object.values(stats.cropDistribution).reduce((a, b) => a + b, 0)} total crops
                        </span>
                      </div>
                      <div className="relative" style={{ height: '280px' }}>
                        <Doughnut data={cropChartData} options={{
                          ...modernChartOptions,
                          cutout: '65%',
                          plugins: {
                            ...modernChartOptions.plugins,
                            legend: {
                              ...modernChartOptions.plugins.legend,
                              position: 'bottom'
                            }
                          }
                        }} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-black">
                              {Object.keys(stats.cropDistribution).length}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                              Types
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          Health Status
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {Object.values(stats.healthDistribution).reduce((a, b) => a + b, 0)} reports
                        </span>
                      </div>
                      <div style={{ height: '280px' }}>
                        <Bar data={healthChartData} options={modernBarOptions} />
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          Monthly Trend
                        </h3>
                        <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                           +12% growth
                        </span>
                      </div>
                      <div style={{ height: '280px' }}>
                        <Line data={monthlyTrendData} options={modernLineOptions} />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Filters Section - Clean Professional Design */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Search & Filter
                </h3>
              </div>

              {/* Search Bar and Filters in horizontal layout */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Search Bar - positioned on the left */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search farmers by name or email..."
                      value={filters.search || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Farmers Table - Clean Professional Design */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Farmers Directory
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={exportOverviewData}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      <span>📤</span>
                      Export Overview
                    </button>
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredFarmers().length)} of {getFilteredFarmers().length} farmers
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Farmer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Crops</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reports</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {getPaginatedFarmers().map((farmer) => (
                      <tr key={farmer.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <div className="ml-0">
                              <div className="text-sm font-semibold text-black">{farmer.name}</div>
                              <div className="text-xs text-gray-500">ID: {farmer.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-sm text-black">{farmer.email}</div>
                          <div className="text-sm text-gray-600">{farmer.phone}</div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-sm text-black">{farmer.location}</div>
                          <div className="text-xs text-gray-500">Joined: {farmer.joinDate}</div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {farmer.cropTypes.map((crop, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          <div className="text-sm font-semibold text-black">{farmer.totalReports}</div>
                          <div className="text-xs text-gray-500">reports</div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            farmer.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {farmer.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right">
                          <button
                            onClick={() => openFarmerTab({ farmerId: farmer.id, name: farmer.name, ...farmer })}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-lg transition-colors duration-200"
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

              {/* Pagination - Clean Design */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 font-medium">
                    Page {currentPage} of {getTotalPages()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                              currentPage === pageNum
                                ? 'bg-green-600 text-white border border-green-600'
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
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crop Guidelines Tab */}
        {activeTab === 'guidelines' && (
          <div>
            {/* Guidelines Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Crop Guidelines Management
                </h2>
                <p className="text-sm text-gray-600 mt-1">Manage crop growing guidelines for farmers</p>
              </div>
              <button
                onClick={() => {
                  resetGuidelineForm();
                  setEditingGuideline(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <span>+</span>
                Add New Guideline
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Guidelines</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by crop name or variety..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  >
                    <option value="all">All Categories</option>
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Guidelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuidelines.map((guideline) => (
                <div key={guideline.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full min-h-[500px]">
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <span className="text-lg">
                            {categoryOptions.find(cat => cat.value === guideline.category)?.icon || '🌱'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{guideline.name}</h3>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            {categoryOptions.find(cat => cat.value === guideline.category)?.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditGuideline(guideline)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit guideline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setGuidelineToDelete(guideline);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete guideline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Key Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Growing Period:</span>
                        <div className="font-medium text-gray-800">{guideline.growingPeriod}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Expected Yield:</span>
                        <div className="font-medium text-gray-800">{guideline.expectedYield}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1">
                    {/* Varieties */}
                    <div className="mb-4">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Varieties</label>
                      <div className="flex flex-wrap gap-1 mt-1 min-h-[32px] content-start">
                        {guideline.varieties.slice(0, 3).map((variety, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {variety}
                          </span>
                        ))}
                        {guideline.varieties.length > 3 && (
                          <span className="text-xs text-gray-500">+{guideline.varieties.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Market Price:</span>
                        <div className="font-medium text-green-700">{guideline.marketPrice}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Difficulty:</span>
                        <div className={`font-medium ${
                          guideline.difficulty === 'Easy' ? 'text-green-600' :
                          guideline.difficulty === 'Moderate' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {guideline.difficulty}
                        </div>
                      </div>
                    </div>

                    {/* Key Tips Preview */}
                    <div className="mt-4">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Key Tips</label>
                      <div className="mt-1 text-sm text-gray-700 min-h-[60px]">
                        {guideline.keyTips.slice(0, 2).map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2 mb-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span className="text-xs">{tip}</span>
                          </div>
                        ))}
                        {guideline.keyTips.length > 2 && (
                          <div className="text-xs text-gray-500">+{guideline.keyTips.length - 2} more tips</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Updated: {guideline.updatedAt}</span>
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        guideline.profitability === 'Very High' ? 'bg-green-100 text-green-700' :
                        guideline.profitability === 'High' ? 'bg-green-100 text-green-600' :
                        guideline.profitability === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {guideline.profitability} Profitability
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredGuidelines.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4 opacity-30">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No guidelines found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'No guidelines match your current search and filters' 
                    : 'Start by adding your first crop guideline'}
                </p>
                <button
                  onClick={() => {
                    if (searchTerm || selectedCategory !== 'all') {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    } else {
                      resetGuidelineForm();
                      setEditingGuideline(null);
                      setShowCreateModal(true);
                    }
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  {searchTerm || selectedCategory !== 'all' ? 'Clear Filters' : 'Add First Guideline'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Farmer Detail Tab - 60-30-10 color scheme */}
        {activeTab === 'farmer' && activeFarmerId && (() => {
          const currentFarmer = getCurrentFarmer();
          if (!currentFarmer) return null;
          
          return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* Enhanced Farmer Header */}
              <div className="border-b border-gray-100 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="ml-0">
                      <h2 className="text-xl font-bold text-gray-900">{currentFarmer.name}</h2>
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
                            <div className="bg-white px-6 py-4 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-xl font-bold text-gray-800">{crop.cropType}</h5>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                    <span>Planted: {crop.plantingDate}</span>
                                    <span>Expected Harvest: {crop.expectedHarvest}</span>
                                    <span>Area: {crop.area} hectares</span>
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
                    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-4">📊 Quick Overview</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(() => {
                          const analytics = getFarmerAnalytics(currentFarmer.id);
                          return (
                            <>
                              <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-gray-900">{analytics.totalReports}</div>
                                <div className="text-xs text-gray-600">Total Reports</div>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-gray-900">{analytics.activeCrops}</div>
                                <div className="text-xs text-gray-600">Active Crops</div>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-gray-900">{analytics.avgPlantHeight}cm</div>
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

        {/* Professional Crop Reports Modal */}
        {showCropReportsModal && selectedCrop && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-xl border border-gray-300">
              {/* Modal Header */}
              <div className="bg-green-600 text-white p-4 border-b border-green-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedCrop.cropType} - {selectedCrop.variety}</h2>
                      <p className="text-green-100 mt-1 text-sm">
                        Planted: {selectedCrop.plantingDate} • Expected Harvest: {selectedCrop.expectedHarvest} • Area: {selectedCrop.area} hectares
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCropReportsModal(false)}
                    className="text-white hover:text-gray-200 text-xl w-8 h-8 rounded flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 max-h-[calc(90vh-120px)] overflow-y-auto bg-gray-50">
                {/* Expected Harvest Timeline */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b border-gray-200 pb-2">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Expected Monthly Reports Timeline
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {selectedCrop.expectedMonths.map((month, index) => {
                        const hasReport = selectedCrop.reports?.some(report => 
                          report.reportDate.startsWith(month)
                        );
                        const isCurrentMonth = month === new Date().toISOString().slice(0, 7);
                        const isPastMonth = month < new Date().toISOString().slice(0, 7);
                        
                        return (
                          <div 
                            key={month} 
                            className={`p-3 rounded-lg text-center border ${
                              hasReport 
                                ? 'bg-green-50 border-green-300 text-green-700' 
                                : isCurrentMonth
                                  ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                                  : isPastMonth
                                    ? 'bg-red-50 border-red-300 text-red-700'
                                    : 'bg-gray-50 border-gray-300 text-gray-600'
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {new Date(month + '-01').toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="text-xs mt-1">
                              {hasReport ? 'Reported' : 
                               isCurrentMonth ? 'Current' :
                               isPastMonth ? 'Missing' : 'Pending'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                        <span className="text-gray-700">Report Submitted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                        <span className="text-gray-700">Current Month</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                        <span className="text-gray-700">Missing Report</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                        <span className="text-gray-700">Future Report</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Reports List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b border-gray-200 pb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Monthly Reports ({selectedCrop.reports?.length || 0} reports)
                  </h3>
                  
                  {selectedCrop.reports && selectedCrop.reports.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCrop.reports
                        .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
                        .map((report, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                          {/* Report Header */}
                          <div className={`px-4 py-3 border-l-4 ${
                            report.healthStatus === 'Healthy' ? 'bg-green-50 border-green-500' :
                            report.healthStatus === 'Warning' ? 'bg-gray-50 border-gray-500' :
                            report.healthStatus === 'Critical' ? 'bg-gray-100 border-gray-600' :
                            'bg-white border-gray-400'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-base font-semibold text-gray-800 flex items-center">
                                <span className="w-6 h-6 bg-white rounded flex items-center justify-center mr-2 text-xs font-medium text-gray-600">
                                  #{selectedCrop.reports.length - index}
                                </span>
                                Report - {report.reportDate}
                              </h4>
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  report.healthStatus === 'Healthy' ? 'bg-green-600 text-white' :
                                  report.healthStatus === 'Warning' ? 'bg-gray-600 text-white' :
                                  report.healthStatus === 'Critical' ? 'bg-black text-white' :
                                  'bg-gray-500 text-white'
                                }`}>
                                  {report.healthStatus}
                                </span>
                                <span className="text-sm text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                                  {report.growthStage}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
                              <div className="flex items-center bg-white rounded p-2 border border-gray-100">
                                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M7 21l3-9 9-3-3 9-9 3z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                  <span className="text-gray-600 block text-xs">Height</span>
                                  <span className="font-medium text-gray-800">{report.plantHeight}cm</span>
                                </div>
                              </div>
                              <div className="flex items-center bg-white rounded p-2 border border-gray-100">
                                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                  <span className="text-gray-600 block text-xs">Est. Yield</span>
                                  <span className="font-medium text-gray-800">{report.estimatedYield}kg</span>
                                </div>
                              </div>
                              <div className="flex items-center bg-white rounded p-2 border border-gray-100">
                                <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                  <span className="text-gray-600 block text-xs">Pests</span>
                                  <span className="font-medium text-gray-800">{report.pestsAndDiseases || 'None'}</span>
                                </div>
                              </div>
                              <div className="flex items-center bg-white rounded p-2 border border-gray-100">
                                <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                  <span className="text-gray-600 block text-xs">Weather</span>
                                  <span className="font-medium text-gray-800">{report.weatherImpact || 'Normal'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Report Notes */}
                          {report.notes && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                              <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-gray-600 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div>
                                  <p className="text-gray-800 font-medium text-sm mb-1">Additional Notes:</p>
                                  <p className="text-gray-700 text-sm">{report.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg font-medium text-gray-700 mb-2">No reports submitted yet</p>
                      <p className="text-gray-500">Reports will appear here as the farmer submits monthly updates</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
        
        {/* Crop Guidelines Modal */}
    {showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {editingGuideline ? 'Edit Crop Guideline' : 'Add New Crop Guideline'}
            </h3>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setEditingGuideline(null);
                setNewGuideline({
                  id: '',
                  cropName: '',
                  category: '',
                  description: '',
                  plantingTips: [''],
                  careInstructions: [''],
                  harvestingTips: [''],
                  commonPests: [''],
                  diseases: [''],
                  seasonality: '',
                  soilRequirements: '',
                  waterRequirements: '',
                  fertilizers: ['']
                });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            editingGuideline ? handleUpdateGuideline() : handleAddGuideline();
          }} className="space-y-4">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
              <input
                type="text"
                required
                value={newGuideline.cropName}
                onChange={(e) => setNewGuideline({...newGuideline, cropName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter crop name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={newGuideline.category}
                onChange={(e) => setNewGuideline({...newGuideline, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Legumes">Legumes</option>
                <option value="Herbs">Herbs</option>
                <option value="Root Crops">Root Crops</option>
                <option value="Leafy Greens">Leafy Greens</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newGuideline.description}
                onChange={(e) => setNewGuideline({...newGuideline, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Brief description of the crop"
              />
            </div>

            {/* Planting Tips */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planting Tips</label>
              {(newGuideline.plantingTips || []).map((tip, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => updateArrayField('plantingTips', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter planting tip"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('plantingTips', index)}
                    className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('plantingTips')}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Planting Tip
              </button>
            </div>

            {/* Care Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
              {(newGuideline.careInstructions || []).map((instruction, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => updateArrayField('careInstructions', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter care instruction"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('careInstructions', index)}
                    className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('careInstructions')}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Care Instruction
              </button>
            </div>

            {/* Harvesting Tips */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harvesting Tips</label>
              {(newGuideline.harvestingTips || []).map((tip, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => updateArrayField('harvestingTips', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter harvesting tip"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('harvestingTips', index)}
                    className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('harvestingTips')}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Harvesting Tip
              </button>
            </div>

            {/* Common Pests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Common Pests</label>
              {(newGuideline.commonPests || []).map((pest, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={pest}
                    onChange={(e) => updateArrayField('commonPests', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter common pest"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('commonPests', index)}
                    className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('commonPests')}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Common Pest
              </button>
            </div>

            {/* Diseases */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Common Diseases</label>
              {(newGuideline.diseases || []).map((disease, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={disease}
                    onChange={(e) => updateArrayField('diseases', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter common disease"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('diseases', index)}
                    className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('diseases')}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Common Disease
              </button>
            </div>

            {/* Environmental Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seasonality</label>
              <input
                type="text"
                value={newGuideline.seasonality}
                onChange={(e) => setNewGuideline({...newGuideline, seasonality: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Best planting season (e.g., Spring, Summer)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soil Requirements</label>
              <input
                type="text"
                value={newGuideline.soilRequirements}
                onChange={(e) => setNewGuideline({...newGuideline, soilRequirements: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Soil type and pH requirements"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Requirements</label>
              <input
                type="text"
                value={newGuideline.waterRequirements}
                onChange={(e) => setNewGuideline({...newGuideline, waterRequirements: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Watering frequency and amount"
              />
            </div>

            {/* Fertilizers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Fertilizers</label>
              {(newGuideline.fertilizers || []).map((fertilizer, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={fertilizer}
                    onChange={(e) => updateArrayField('fertilizers', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter fertilizer recommendation"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('fertilizers', index)}
                    className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('fertilizers')}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                + Add Fertilizer
              </button>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingGuideline(null);
                  setNewGuideline({
                    id: '',
                    cropName: '',
                    category: '',
                    description: '',
                    plantingTips: [''],
                    careInstructions: [''],
                    harvestingTips: [''],
                    commonPests: [''],
                    diseases: [''],
                    seasonality: '',
                    soilRequirements: '',
                    waterRequirements: '',
                    fertilizers: ['']
                  });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingGuideline ? 'Update Guideline' : 'Add Guideline'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Delete Crop Guideline</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the guideline for "{guidelineToDelete?.cropName}"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setGuidelineToDelete(null);
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteGuideline}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Seed_Track;