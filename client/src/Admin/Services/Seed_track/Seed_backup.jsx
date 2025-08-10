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
  const [activeTab, setActiveTab] = useState('overview'); // overview, farmer-detail
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedFarmerTab, setSelectedFarmerTab] = useState('reports'); // reports, messages, analytics, surveys
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showAssignSurveyModal, setShowAssignSurveyModal] = useState(false);
  const [showCropReportsModal, setShowCropReportsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    details: false,
    timeline: false,
    issues: false
  });
  const [newMessage, setNewMessage] = useState('');

  // Sample data
  const [farmers, setFarmers] = useState([]);
  const [farmerReports, setFarmerReports] = useState({}); // Organized by farmer ID
  const [farmerMessages, setFarmerMessages] = useState({}); // Organized by farmer ID
  const [surveyForms, setSurveyForms] = useState([]); // Available survey forms from Survey module
  const [assignedSurveys, setAssignedSurveys] = useState({}); // Surveys assigned to farmers
  const [filters, setFilters] = useState({
    status: 'all', // all, submitted, late, pending
    cropType: 'all',
    location: 'all',
    month: 'all'
  });

  // Crop growth stages based on BBCH scale and agricultural standards
  const cropGrowthStages = {
    Rice: [
      { code: '00', stage: 'Seed Treatment', description: 'Pre-planting seed preparation' },
      { code: '05', stage: 'Germination', description: 'Seed sprouting begins' },
      { code: '10', stage: 'Emergence', description: 'First leaves emerge from soil' },
      { code: '13', stage: 'Tillering', description: 'Formation of side shoots' },
      { code: '30', stage: 'Stem Elongation', description: 'Plant height increases rapidly' },
      { code: '45', stage: 'Booting', description: 'Flag leaf emergence' },
      { code: '55', stage: 'Heading', description: 'Panicle emergence begins' },
      { code: '65', stage: 'Flowering', description: 'Anthesis and pollination' },
      { code: '75', stage: 'Milk Stage', description: 'Grain filling begins' },
      { code: '85', stage: 'Dough Stage', description: 'Grain development continues' },
      { code: '92', stage: 'Maturity', description: 'Grains ready for harvest' },
      { code: '97', stage: 'Harvest', description: 'Crop harvesting' },
      { code: '99', stage: 'Post-Harvest', description: 'Processing and storage' }
    ],
    Corn: [
      { code: '00', stage: 'Seed Treatment', description: 'Pre-planting seed preparation' },
      { code: 'VE', stage: 'Emergence', description: 'Coleoptile emerges from soil' },
      { code: 'V1', stage: '1st Leaf', description: 'First true leaf with visible collar' },
      { code: 'V3', stage: '3rd Leaf', description: 'Third leaf stage' },
      { code: 'V6', stage: '6th Leaf', description: 'Sixth leaf stage, rapid growth' },
      { code: 'V12', stage: '12th Leaf', description: 'Twelfth leaf, tassel development' },
      { code: 'VT', stage: 'Tasseling', description: 'Tassel emergence and pollen shed' },
      { code: 'R1', stage: 'Silking', description: 'Silk emergence, pollination' },
      { code: 'R2', stage: 'Blister', description: 'Kernels white and blister-like' },
      { code: 'R3', stage: 'Milk', description: 'Kernels yellow, milky consistency' },
      { code: 'R4', stage: 'Dough', description: 'Kernels thick, doughy consistency' },
      { code: 'R5', stage: 'Dent', description: 'Kernels denting, moisture decreasing' },
      { code: 'R6', stage: 'Maturity', description: 'Black layer formed, ready for harvest' },
      { code: '97', stage: 'Harvest', description: 'Crop harvesting' },
      { code: '99', stage: 'Post-Harvest', description: 'Processing and storage' }
    ],
    Vegetables: [
      { code: '00', stage: 'Seed Treatment', description: 'Pre-planting preparation' },
      { code: '05', stage: 'Germination', description: 'Seed sprouting' },
      { code: '10', stage: 'Cotyledon', description: 'First seed leaves emerge' },
      { code: '12', stage: 'First True Leaf', description: 'True leaves appear' },
      { code: '15', stage: 'Leaf Development', description: 'Multiple leaves forming' },
      { code: '30', stage: 'Vegetative Growth', description: 'Active vegetative development' },
      { code: '50', stage: 'Flowering Initiation', description: 'Flower buds form' },
      { code: '60', stage: 'Flowering', description: 'Active flowering period' },
      { code: '70', stage: 'Fruit Development', description: 'Fruits/pods forming' },
      { code: '80', stage: 'Fruit Maturation', description: 'Fruits reaching maturity' },
      { code: '89', stage: 'Ready for Harvest', description: 'Optimal harvest timing' },
      { code: '97', stage: 'Harvest', description: 'Active harvesting' },
      { code: '99', stage: 'Post-Harvest', description: 'Processing and storage' }
    ]
  };

  // Initialize sample data
  useEffect(() => {
    const farmersData = [
      {
        id: 1,
        name: 'Juan Dela Cruz',
        email: 'juan@farmer.com',
        phone: '+63912345678',
        location: 'Quezon Province',
        farmSize: '2.5 hectares',
        cropTypes: ['Rice', 'Corn'],
        joinDate: '2024-01-15',
        status: 'active',
        lastReport: '2024-08-05',
        reportStatus: 'submitted',
        currentBatch: 'Rice Batch 2024-A',
        avatar: null
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@farmer.com',
        phone: '+63923456789',
        location: 'Nueva Ecija',
        farmSize: '3.2 hectares',
        cropTypes: ['Rice'],
        joinDate: '2024-02-20',
        status: 'active',
        lastReport: '2024-07-15',
        reportStatus: 'late',
        currentBatch: 'Rice Batch 2024-B',
        avatar: null
      },
      {
        id: 3,
        name: 'Pedro Garcia',
        email: 'pedro@farmer.com',
        phone: '+63934567890',
        location: 'Laguna',
        farmSize: '1.8 hectares',
        cropTypes: ['Vegetables', 'Corn'],
        joinDate: '2024-03-10',
        status: 'active',
        lastReport: '2024-08-01',
        reportStatus: 'submitted',
        currentBatch: 'Corn Batch 2024-C',
        avatar: null
      }
    ];
    setFarmers(farmersData);

    // Initialize available survey forms (would come from Survey module in real implementation)
    const surveyFormsData = [
      {
        id: 1,
        title: 'Monthly Crop Report',
        description: 'Standard monthly crop progress report',
        fields: [
          { type: 'select', label: 'Growth Stage', options: [] }, // Will be populated based on crop type
          { type: 'select', label: 'Health Status', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
          { type: 'text', label: 'Estimated Yield (tons/hectare)' },
          { type: 'textarea', label: 'Pest Issues' },
          { type: 'textarea', label: 'Disease Issues' },
          { type: 'select', label: 'Weather Impact', options: ['Favorable', 'Adequate', 'Challenging', 'Severe'] },
          { type: 'file', label: 'Field Photos' },
          { type: 'textarea', label: 'Additional Notes' }
        ],
        status: 'active',
        createdDate: '2024-07-01'
      },
      {
        id: 2,
        title: 'Pest & Disease Assessment',
        description: 'Detailed pest and disease monitoring form',
        fields: [
          { type: 'select', label: 'Pest Type', options: ['Brown Planthopper', 'Stem Borer', 'Aphids', 'Cutworm', 'None'] },
          { type: 'select', label: 'Pest Severity', options: ['None', 'Low', 'Medium', 'High', 'Severe'] },
          { type: 'select', label: 'Disease Type', options: ['Bacterial Leaf Blight', 'Rice Blast', 'Sheath Blight', 'Leaf Spot', 'None'] },
          { type: 'select', label: 'Disease Severity', options: ['None', 'Low', 'Medium', 'High', 'Severe'] },
          { type: 'textarea', label: 'Treatment Applied' },
          { type: 'file', label: 'Evidence Photos' }
        ],
        status: 'active',
        createdDate: '2024-07-15'
      },
      {
        id: 3,
        title: 'Harvest Report',
        description: 'Post-harvest yield and quality assessment',
        fields: [
          { type: 'text', label: 'Actual Yield (tons/hectare)' },
          { type: 'select', label: 'Grain Quality', options: ['Premium', 'Grade A', 'Grade B', 'Below Standard'] },
          { type: 'text', label: 'Moisture Content (%)' },
          { type: 'date', label: 'Harvest Date' },
          { type: 'textarea', label: 'Market Information' },
          { type: 'textarea', label: 'Lessons Learned' }
        ],
        status: 'active',
        createdDate: '2024-08-01'
      }
    ];
    setSurveyForms(surveyFormsData);

    // Initialize assigned surveys to farmers
    const assignedSurveysData = {
      1: [
        { surveyId: 1, assignedDate: '2024-08-01', dueDate: '2024-08-31', status: 'active' },
        { surveyId: 2, assignedDate: '2024-08-01', dueDate: '2024-08-15', status: 'completed' }
      ],
      2: [
        { surveyId: 1, assignedDate: '2024-07-01', dueDate: '2024-07-31', status: 'overdue' },
        { surveyId: 2, assignedDate: '2024-08-01', dueDate: '2024-08-15', status: 'active' }
      ],
      3: [
        { surveyId: 1, assignedDate: '2024-08-01', dueDate: '2024-08-31', status: 'completed' },
        { surveyId: 3, assignedDate: '2024-08-01', dueDate: '2024-08-10', status: 'active' }
      ]
    };
    setAssignedSurveys(assignedSurveysData);

    // Organize reports by farmer ID (these would be submitted via Survey forms in real implementation)
    const reportsData = {
      1: [
        // Rice Batch 2024-A - Planted January 2024
        {
          id: 1,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-A',
          plantingDate: '2024-01-15',
          expectedHarvest: '2024-07-15', // 6 months cycle
          reportMonth: 'January 2024',
          reportDate: '2024-01-30',
          status: 'submitted',
          growthStage: 'Germination',
          growthStageCode: '05',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Favorable conditions',
          estimatedYield: '4.0 tons/hectare',
          notes: 'Seeds germinating well. Good weather conditions.',
          images: ['rice1_jan.jpg']
        },
        {
          id: 2,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-A',
          plantingDate: '2024-01-15',
          expectedHarvest: '2024-07-15',
          reportMonth: 'February 2024',
          submissionDate: '2024-02-28',
          status: 'submitted',
          growthStage: 'Tillering',
          growthStageCode: '13',
          healthStatus: 'Excellent',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Good rainfall',
          estimatedYield: '4.2 tons/hectare',
          notes: 'Plants showing strong tillering. Applied fertilizer.',
          images: ['rice1_feb.jpg']
        },
        {
          id: 3,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-A',
          plantingDate: '2024-01-15',
          expectedHarvest: '2024-07-15',
          reportMonth: 'March 2024',
          submissionDate: '2024-03-30',
          status: 'submitted',
          growthStage: 'Stem Elongation',
          growthStageCode: '30',
          healthStatus: 'Good',
          pestIssues: 'Minor stem borer',
          diseaseIssues: 'None',
          weatherImpact: 'Adequate',
          estimatedYield: '4.3 tons/hectare',
          notes: 'Good vegetative growth. Minor pest control applied.',
          images: ['rice1_mar.jpg']
        },
        {
          id: 4,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-A',
          plantingDate: '2024-01-15',
          expectedHarvest: '2024-07-15',
          reportMonth: 'April 2024',
          submissionDate: '2024-04-30',
          status: 'submitted',
          growthStage: 'Booting',
          growthStageCode: '45',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'Minor leaf spot',
          weatherImpact: 'Good conditions',
          estimatedYield: '4.4 tons/hectare',
          notes: 'Flag leaf emerged. Preparing for heading stage.',
          images: ['rice1_apr.jpg']
        },
        {
          id: 5,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-A',
          plantingDate: '2024-01-15',
          expectedHarvest: '2024-07-15',
          reportMonth: 'May 2024',
          submissionDate: '2024-05-30',
          status: 'submitted',
          growthStage: 'Flowering',
          growthStageCode: '65',
          healthStatus: 'Excellent',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Perfect flowering weather',
          estimatedYield: '4.6 tons/hectare',
          notes: 'Excellent flowering. Weather has been perfect.',
          images: ['rice1_may.jpg']
        },
        {
          id: 6,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-A',
          plantingDate: '2024-01-15',
          expectedHarvest: '2024-07-15',
          reportMonth: 'June 2024',
          submissionDate: '2024-06-30',
          status: 'submitted',
          growthStage: 'Milk Stage',
          growthStageCode: '75',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Adequate',
          estimatedYield: '4.5 tons/hectare',
          notes: 'Grain filling progressing well.',
          images: ['rice1_jun.jpg']
        },
        {
          id: 7,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-A',
          plantingDate: '2024-01-15',
          expectedHarvest: '2024-07-15',
          reportMonth: 'July 2024',
          submissionDate: '2024-07-30',
          status: 'submitted',
          growthStage: 'Maturity',
          growthStageCode: '92',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Good for harvest',
          estimatedYield: '4.5 tons/hectare',
          actualYield: '4.7 tons/hectare',
          notes: 'Ready for harvest. Exceeded expectations!',
          images: ['rice1_jul.jpg']
        },
        // Corn Batch 2024-B - Planted March 2024
        {
          id: 8,
          surveyId: 1,
          cropType: 'Corn',
          batchName: 'Corn Batch 2024-B',
          plantingDate: '2024-03-01',
          expectedHarvest: '2024-09-01', // 6 months cycle
          reportMonth: 'March 2024',
          submissionDate: '2024-03-30',
          status: 'submitted',
          growthStage: 'Emergence',
          growthStageCode: 'VE',
          healthStatus: 'Excellent',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Perfect planting weather',
          estimatedYield: '6.0 tons/hectare',
          notes: 'Excellent emergence rate. New hybrid variety performing well.',
          images: ['corn1_mar.jpg']
        },
        {
          id: 9,
          surveyId: 1,
          cropType: 'Corn',
          batchName: 'Corn Batch 2024-B',
          plantingDate: '2024-03-01',
          expectedHarvest: '2024-09-01',
          reportMonth: 'April 2024',
          submissionDate: '2024-04-30',
          status: 'submitted',
          growthStage: '3rd Leaf',
          growthStageCode: 'V3',
          healthStatus: 'Excellent',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Good growing conditions',
          estimatedYield: '6.2 tons/hectare',
          notes: 'Strong early growth. Applied side-dress fertilizer.',
          images: ['corn1_apr.jpg']
        },
        {
          id: 10,
          surveyId: 1,
          cropType: 'Corn',
          batchName: 'Corn Batch 2024-B',
          plantingDate: '2024-03-01',
          expectedHarvest: '2024-09-01',
          reportMonth: 'May 2024',
          submissionDate: '2024-05-30',
          status: 'submitted',
          growthStage: '6th Leaf',
          growthStageCode: 'V6',
          healthStatus: 'Good',
          pestIssues: 'Minor cutworm',
          diseaseIssues: 'None',
          weatherImpact: 'Some drought stress',
          estimatedYield: '5.8 tons/hectare',
          notes: 'Some pest pressure and dry weather. Monitoring closely.',
          images: ['corn1_may.jpg']
        },
        {
          id: 11,
          surveyId: 1,
          cropType: 'Corn',
          batchName: 'Corn Batch 2024-B',
          plantingDate: '2024-03-01',
          expectedHarvest: '2024-09-01',
          reportMonth: 'June 2024',
          submissionDate: '2024-06-30',
          status: 'submitted',
          growthStage: '12th Leaf',
          growthStageCode: 'V12',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Improved rainfall',
          estimatedYield: '6.1 tons/hectare',
          notes: 'Recovery from drought stress. Tassel development visible.',
          images: ['corn1_jun.jpg']
        },
        {
          id: 12,
          surveyId: 1,
          cropType: 'Corn',
          batchName: 'Corn Batch 2024-B',
          plantingDate: '2024-03-01',
          expectedHarvest: '2024-09-01',
          reportMonth: 'July 2024',
          submissionDate: '2024-07-30',
          status: 'submitted',
          growthStage: 'Tasseling',
          growthStageCode: 'VT',
          healthStatus: 'Excellent',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Perfect pollination weather',
          estimatedYield: '6.3 tons/hectare',
          notes: 'Excellent tasseling and pollen shed. Great weather.',
          images: ['corn1_jul.jpg']
        },
        {
          id: 13,
          surveyId: 1,
          cropType: 'Corn',
          batchName: 'Corn Batch 2024-B',
          plantingDate: '2024-03-01',
          expectedHarvest: '2024-09-01',
          reportMonth: 'August 2024',
          submissionDate: '2024-08-05',
          status: 'submitted',
          growthStage: 'Silking',
          growthStageCode: 'R1',
          healthStatus: 'Excellent',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Ideal conditions',
          estimatedYield: '6.4 tons/hectare',
          notes: 'Silk emergence perfect. Pollination successful.',
          images: ['corn1_aug.jpg']
        }
      ],
      2: [
        // Rice Batch 2024-C - Planted February 2024 (Late planting)
        {
          id: 14,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-C',
          plantingDate: '2024-02-20',
          expectedHarvest: '2024-08-20',
          reportMonth: 'February 2024',
          submissionDate: '2024-02-28',
          status: 'submitted',
          growthStage: 'Germination',
          growthStageCode: '05',
          healthStatus: 'Fair',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Cold weather slowing germination',
          estimatedYield: '3.5 tons/hectare',
          notes: 'Late planting due to weather. Slower germination.',
          images: ['rice2_feb.jpg']
        },
        {
          id: 15,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-C',
          plantingDate: '2024-02-20',
          expectedHarvest: '2024-08-20',
          reportMonth: 'March 2024',
          submissionDate: '2024-03-30',
          status: 'submitted',
          growthStage: 'Emergence',
          growthStageCode: '10',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Improving conditions',
          estimatedYield: '3.8 tons/hectare',
          notes: 'Weather improving. Growth picking up.',
          images: ['rice2_mar.jpg']
        },
        {
          id: 16,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-C',
          plantingDate: '2024-02-20',
          expectedHarvest: '2024-08-20',
          reportMonth: 'April 2024',
          submissionDate: '2024-04-30',
          status: 'submitted',
          growthStage: 'Tillering',
          growthStageCode: '13',
          healthStatus: 'Good',
          pestIssues: 'Minor aphids',
          diseaseIssues: 'None',
          weatherImpact: 'Good conditions',
          estimatedYield: '4.0 tons/hectare',
          notes: 'Catching up in growth. Minor pest pressure managed.',
          images: ['rice2_apr.jpg']
        },
        {
          id: 17,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-C',
          plantingDate: '2024-02-20',
          expectedHarvest: '2024-08-20',
          reportMonth: 'May 2024',
          submissionDate: '2024-05-30',
          status: 'submitted',
          growthStage: 'Stem Elongation',
          growthStageCode: '30',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'Minor leaf spot',
          weatherImpact: 'Adequate rainfall',
          estimatedYield: '4.1 tons/hectare',
          notes: 'Good vegetative growth. Disease under control.',
          images: ['rice2_may.jpg']
        },
        {
          id: 18,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-C',
          plantingDate: '2024-02-20',
          expectedHarvest: '2024-08-20',
          reportMonth: 'June 2024',
          submissionDate: '2024-06-30',
          status: 'submitted',
          growthStage: 'Booting',
          growthStageCode: '45',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Good conditions',
          estimatedYield: '4.2 tons/hectare',
          notes: 'Flag leaf emergence. On track for harvest.',
          images: ['rice2_jun.jpg']
        },
        {
          id: 19,
          surveyId: 1,
          cropType: 'Rice',
          batchName: 'Rice Batch 2024-C',
          plantingDate: '2024-02-20',
          expectedHarvest: '2024-08-20',
          reportMonth: 'July 2024',
          submissionDate: '2024-07-15',
          status: 'late',
          growthStage: 'Heading',
          growthStageCode: '55',
          healthStatus: 'Fair',
          pestIssues: 'Brown planthopper',
          diseaseIssues: 'Bacterial leaf blight',
          weatherImpact: 'Excessive rainfall',
          estimatedYield: '3.8 tons/hectare',
          notes: 'Pest and disease pressure increasing. Need assistance.',
          images: ['rice2_jul.jpg']
        }
      ],
      3: [
        // Vegetables Batch 2024-D - Planted April 2024 (Short season crops)
        {
          id: 20,
          surveyId: 1,
          cropType: 'Vegetables',
          batchName: 'Vegetables Batch 2024-D',
          plantingDate: '2024-04-01',
          expectedHarvest: '2024-07-01', // 3 months cycle for vegetables
          reportMonth: 'April 2024',
          submissionDate: '2024-04-30',
          status: 'submitted',
          growthStage: 'Germination',
          growthStageCode: '05',
          healthStatus: 'Excellent',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Perfect planting weather',
          estimatedYield: '15.0 tons/hectare',
          notes: 'Excellent germination of mixed vegetables (tomatoes, peppers, eggplant).',
          images: ['veg1_apr.jpg']
        },
        {
          id: 21,
          surveyId: 1,
          cropType: 'Vegetables',
          batchName: 'Vegetables Batch 2024-D',
          plantingDate: '2024-04-01',
          expectedHarvest: '2024-07-01',
          reportMonth: 'May 2024',
          submissionDate: '2024-05-30',
          status: 'submitted',
          growthStage: 'Leaf Development',
          growthStageCode: '15',
          healthStatus: 'Excellent',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Good growing conditions',
          estimatedYield: '15.5 tons/hectare',
          notes: 'Strong vegetative growth. Applied organic fertilizer.',
          images: ['veg1_may.jpg']
        },
        {
          id: 22,
          surveyId: 1,
          cropType: 'Vegetables',
          batchName: 'Vegetables Batch 2024-D',
          plantingDate: '2024-04-01',
          expectedHarvest: '2024-07-01',
          reportMonth: 'June 2024',
          submissionDate: '2024-06-30',
          status: 'submitted',
          growthStage: 'Flowering',
          growthStageCode: '60',
          healthStatus: 'Good',
          pestIssues: 'Minor aphids',
          diseaseIssues: 'None',
          weatherImpact: 'Hot weather stress',
          estimatedYield: '14.8 tons/hectare',
          notes: 'Flowering started. Managing heat stress with shade nets.',
          images: ['veg1_jun.jpg']
        },
        {
          id: 23,
          surveyId: 1,
          cropType: 'Vegetables',
          batchName: 'Vegetables Batch 2024-D',
          plantingDate: '2024-04-01',
          expectedHarvest: '2024-07-01',
          reportMonth: 'July 2024',
          submissionDate: '2024-07-30',
          status: 'submitted',
          growthStage: 'Fruit Development',
          growthStageCode: '70',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'Minor fungal spots',
          weatherImpact: 'Adequate conditions',
          estimatedYield: '15.2 tons/hectare',
          actualYield: '15.4 tons/hectare',
          notes: 'Good fruit set. Started harvesting tomatoes.',
          images: ['veg1_jul.jpg']
        },
        {
          id: 24,
          surveyId: 1,
          cropType: 'Vegetables',
          batchName: 'Vegetables Batch 2024-D',
          plantingDate: '2024-04-01',
          expectedHarvest: '2024-07-01',
          reportMonth: 'August 2024',
          submissionDate: '2024-08-01',
          status: 'submitted',
          growthStage: 'Harvest',
          growthStageCode: '97',
          healthStatus: 'Good',
          pestIssues: 'None',
          diseaseIssues: 'None',
          weatherImpact: 'Good for harvest',
          estimatedYield: '15.2 tons/hectare',
          actualYield: '15.6 tons/hectare',
          notes: 'Successful harvest completed. Exceeded expectations.',
          images: ['veg1_aug.jpg']
        }
      ]
    };
    setFarmerReports(reportsData);

    // Organize messages by farmer ID
    const messagesData = {
      1: [
        {
          id: 1,
          sender: 'farmer',
          message: 'When should I apply the next round of fertilizer for my rice crop?',
          timestamp: '2024-08-03 09:15',
          read: true
        },
        {
          id: 2,
          sender: 'admin',
          message: 'Based on your current growth stage, I recommend applying fertilizer in the next 3-5 days. The flowering stage requires adequate nutrition.',
          timestamp: '2024-08-03 10:30',
          read: true
        },
        {
          id: 3,
          sender: 'farmer',
          message: 'Thank you for the advice. I will apply it this week.',
          timestamp: '2024-08-03 11:45',
          read: true
        }
      ],
      2: [
        {
          id: 4,
          sender: 'farmer',
          message: 'I need urgent help with brown planthopper control. My rice crop is being severely affected.',
          timestamp: '2024-08-05 14:30',
          read: false
        },
        {
          id: 5,
          sender: 'farmer',
          message: 'The infestation has spread to about 30% of my field. What should I do?',
          timestamp: '2024-08-05 14:35',
          read: false
        }
      ],
      3: [
        {
          id: 6,
          sender: 'farmer',
          message: 'My corn crop is doing well. The new hybrid variety is showing excellent results.',
          timestamp: '2024-08-01 16:20',
          read: true
        },
        {
          id: 7,
          sender: 'admin',
          message: 'That\'s great to hear! Keep monitoring and let us know if you need any assistance.',
          timestamp: '2024-08-01 17:15',
          read: true
        }
      ]
    };
    setFarmerMessages(messagesData);
  }, []);

  // Get filtered data
  const getFilteredFarmers = () => {
    let filteredFarmers = farmers;

    if (filters.status !== 'all') {
      filteredFarmers = filteredFarmers.filter(farmer => farmer.reportStatus === filters.status);
    }

    if (filters.location !== 'all') {
      filteredFarmers = filteredFarmers.filter(farmer => farmer.location === filters.location);
    }

    if (filters.cropType !== 'all') {
      filteredFarmers = filteredFarmers.filter(farmer => farmer.cropTypes.includes(filters.cropType));
    }

    return filteredFarmers;
  };

  // Get farmer analytics
  const getFarmerAnalytics = (farmerId) => {
    const reports = farmerReports[farmerId] || [];
    const messages = farmerMessages[farmerId] || [];
    
    const submittedReports = reports.filter(r => r.status === 'submitted').length;
    const lateReports = reports.filter(r => r.status === 'late').length;
    const totalReports = reports.length;
    
    const avgYield = reports.reduce((sum, report) => {
      const yieldValue = parseFloat(report.estimatedYield);
      return sum + (isNaN(yieldValue) ? 0 : yieldValue);
    }, 0) / reports.length || 0;

    const unreadMessages = messages.filter(m => m.sender === 'farmer' && !m.read).length;
    
    return {
      totalReports,
      submittedReports,
      lateReports,
      avgYield: avgYield.toFixed(1),
      submissionRate: totalReports > 0 ? ((submittedReports / totalReports) * 100).toFixed(1) : 0,
      unreadMessages,
      totalMessages: messages.length
    };
  };

  // Get overall analytics
  const getOverallAnalytics = () => {
    const filteredFarmers = getFilteredFarmers();
    const totalFarmers = filteredFarmers.length;
    
    let totalReports = 0;
    let submittedReports = 0;
    let lateReports = 0;
    let totalYield = 0;
    let reportCount = 0;
    
    filteredFarmers.forEach(farmer => {
      const reports = farmerReports[farmer.id] || [];
      totalReports += reports.length;
      submittedReports += reports.filter(r => r.status === 'submitted').length;
      lateReports += reports.filter(r => r.status === 'late').length;
      
      reports.forEach(report => {
        const yieldValue = parseFloat(report.estimatedYield);
        if (!isNaN(yieldValue)) {
          totalYield += yieldValue;
          reportCount++;
        }
      });
    });
    
    const pendingReports = totalFarmers - submittedReports - lateReports;
    const avgYield = reportCount > 0 ? (totalYield / reportCount).toFixed(1) : 0;
    const submissionRate = totalFarmers > 0 ? ((submittedReports / totalFarmers) * 100).toFixed(1) : 0;
    
    return {
      totalFarmers,
      totalReports,
      submittedReports,
      lateReports,
      pendingReports,
      avgYield,
      submissionRate
    };
  };

  // Send message function
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedFarmer) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'admin',
      message: newMessage,
      timestamp: new Date().toLocaleString(),
      read: true
    };
    
    setFarmerMessages(prev => ({
      ...prev,
      [selectedFarmer.id]: [...(prev[selectedFarmer.id] || []), newMsg]
    }));
    
    setNewMessage('');
  };

  // Get available growth stages for a crop type
  const getGrowthStagesForCrop = (cropType) => {
    return cropGrowthStages[cropType] || [];
  };

  // Assign survey to farmer
  const assignSurveyToFarmer = (farmerId, surveyId, dueDate) => {
    const newAssignment = {
      surveyId: parseInt(surveyId),
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      status: 'active'
    };

    setAssignedSurveys(prev => ({
      ...prev,
      [farmerId]: [...(prev[farmerId] || []), newAssignment]
    }));
  };

  // Get survey details by ID
  const getSurveyById = (surveyId) => {
    return surveyForms.find(survey => survey.id === surveyId);
  };

  // Get farmer's assigned surveys
  const getFarmerSurveys = (farmerId) => {
    const assignments = assignedSurveys[farmerId] || [];
    return assignments.map(assignment => ({
      ...assignment,
      survey: getSurveyById(assignment.surveyId)
    }));
  };

  // Update growth stage options based on crop type
  const updateSurveyGrowthStages = (survey, cropType) => {
    if (!survey || !survey.fields) return survey;
    
    const updatedFields = survey.fields.map(field => {
      if (field.label === 'Growth Stage') {
        const stages = getGrowthStagesForCrop(cropType);
        return {
          ...field,
          options: stages.map(stage => `${stage.stage} (${stage.code})`)
        };
      }
      return field;
    });

    return { ...survey, fields: updatedFields };
  };

  // Get farmer's crops with planting information
  const getFarmerCrops = (farmerId) => {
    const reports = farmerReports[farmerId] || [];
    const cropsMap = {};
    
    reports.forEach(report => {
      const key = `${report.cropType}-${report.batchName}`;
      if (!cropsMap[key]) {
        cropsMap[key] = {
          cropType: report.cropType,
          batchName: report.batchName,
          plantingDate: report.plantingDate,
          expectedHarvest: report.expectedHarvest,
          reports: []
        };
      }
      cropsMap[key].reports.push(report);
    });
    
    // Sort reports by date for each crop
    Object.values(cropsMap).forEach(crop => {
      crop.reports.sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
    });
    
    return Object.values(cropsMap);
  };

  // Get reports for a specific crop batch
  const getCropReports = (farmerId, cropType, batchName) => {
    const reports = farmerReports[farmerId] || [];
    return reports.filter(report => 
      report.cropType === cropType && report.batchName === batchName
    ).sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
  };

  // Generate months from planting to current for expected reports
  const getExpectedReportMonths = (plantingDate, expectedHarvest) => {
    const months = [];
    const start = new Date(plantingDate);
    const end = new Date(expectedHarvest);
    const current = new Date();
    
    // Use the earlier of harvest date or current date
    const endDate = end < current ? end : current;
    
    let currentMonth = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (currentMonth <= endDate) {
      months.push({
        month: currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        date: new Date(currentMonth)
      });
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    return months;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallAnalytics = getOverallAnalytics();
  const filteredFarmers = getFilteredFarmers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-8 sm:mt-20 px-2 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Seed Tracking System</h1>
              <p className="text-gray-600">Monitor individual farmer progress, reports, and communications</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setSelectedFarmer(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📊 Overview
              </button>
              {selectedFarmer && (
                <button
                  onClick={() => setActiveTab('farmer-detail')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'farmer-detail' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  👤 {selectedFarmer.name}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="late">Late</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <select
                value={filters.cropType}
                onChange={(e) => setFilters(prev => ({ ...prev, cropType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Crops</option>
                <option value="Rice">Rice</option>
                <option value="Corn">Corn</option>
                <option value="Vegetables">Vegetables</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Locations</option>
                <option value="Quezon Province">Quezon Province</option>
                <option value="Nueva Ecija">Nueva Ecija</option>
                <option value="Laguna">Laguna</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Months</option>
                <option value="August 2024">August 2024</option>
                <option value="July 2024">July 2024</option>
                <option value="June 2024">June 2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Tab - Farmer List */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Farmers</p>
                    <p className="text-3xl font-bold text-blue-600">{overallAnalytics.totalFarmers}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-3xl font-bold text-green-600">{overallAnalytics.totalReports}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Late Reports</p>
                    <p className="text-3xl font-bold text-red-600">{overallAnalytics.lateReports}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <span className="text-2xl">⚠️</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Yield</p>
                    <p className="text-3xl font-bold text-purple-600">{overallAnalytics.avgYield}</p>
                    <p className="text-xs text-gray-500">tons/hectare</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-2xl">🌾</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Farmers List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Farmers</h3>
              <div className="grid gap-4">
                {filteredFarmers.map(farmer => {
                  const analytics = getFarmerAnalytics(farmer.id);
                  const messages = farmerMessages[farmer.id] || [];
                  const unreadCount = messages.filter(m => m.sender === 'farmer' && !m.read).length;
                  
                  return (
                    <div 
                      key={farmer.id} 
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedFarmer(farmer);
                        setActiveTab('farmer-detail');
                        setSelectedFarmerTab('reports');
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-xl font-bold">{farmer.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-800">{farmer.name}</h4>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(farmer.reportStatus)}`}>
                                {farmer.reportStatus}
                              </span>
                              {unreadCount > 0 && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  {unreadCount} new messages
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">{farmer.email} • {farmer.phone}</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Location:</span>
                                <p className="font-medium">{farmer.location}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Current Batch:</span>
                                <p className="font-medium">{farmer.currentBatch}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Reports:</span>
                                <p className="font-medium">{analytics.totalReports} total</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Avg. Yield:</span>
                                <p className="font-medium">{analytics.avgYield} tons/ha</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Messages:</span>
                                <p className="font-medium">{analytics.totalMessages} total</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFarmer(farmer);
                              setShowMessageModal(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            💬 Quick Message
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Farmer Detail Tab */}
        {activeTab === 'farmer-detail' && selectedFarmer && (
          <div className="space-y-6">
            {/* Farmer Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-2xl font-bold">{selectedFarmer.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedFarmer.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedFarmer.reportStatus)}`}>
                      {selectedFarmer.reportStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{selectedFarmer.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium">{selectedFarmer.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-medium">{selectedFarmer.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Farm Size:</span>
                      <p className="font-medium">{selectedFarmer.farmSize}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Batch:</span>
                      <p className="font-medium">{selectedFarmer.currentBatch}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Join Date:</span>
                      <p className="font-medium">{selectedFarmer.joinDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    💬 Send Message
                  </button>
                </div>
              </div>
            </div>

            {/* Farmer Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {(() => {
                const analytics = getFarmerAnalytics(selectedFarmer.id);
                return (
                  <>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Reports</p>
                          <p className="text-3xl font-bold text-blue-600">{analytics.totalReports}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <span className="text-2xl">📋</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Submission Rate</p>
                          <p className="text-3xl font-bold text-green-600">{analytics.submissionRate}%</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <span className="text-2xl">✅</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Avg. Yield</p>
                          <p className="text-3xl font-bold text-purple-600">{analytics.avgYield}</p>
                          <p className="text-xs text-gray-500">tons/hectare</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <span className="text-2xl">🌾</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Messages</p>
                          <p className="text-3xl font-bold text-orange-600">{analytics.totalMessages}</p>
                          {analytics.unreadMessages > 0 && (
                            <p className="text-xs text-red-500">{analytics.unreadMessages} unread</p>
                          )}
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                          <span className="text-2xl">💬</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Farmer Sub-tabs */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {[
                    { id: 'reports', label: '📋 Reports', icon: '📋' },
                    { id: 'messages', label: '💬 Messages', icon: '💬' },
                    { id: 'surveys', label: '📋 Surveys', icon: '📋' },
                    { id: 'analytics', label: '📈 Analytics', icon: '📈' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedFarmerTab(tab.id)}
                      className={`px-6 py-4 font-medium transition-colors ${
                        selectedFarmerTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Reports Sub-tab */}
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
                            
                            {/* Crop Reports Button */}
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

                {/* Messages Sub-tab */}
                {selectedFarmerTab === 'messages' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">Conversation</h4>
                      <span className="text-sm text-gray-600">
                        {farmerMessages[selectedFarmer.id]?.length || 0} messages
                      </span>
                    </div>
                    
                    <div className="border rounded-lg">
                      {/* Messages List */}
                      <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                        {(farmerMessages[selectedFarmer.id] || []).map(message => (
                          <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender === 'admin' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-800'
                            }`}>
                              <p className="text-sm">{message.message}</p>
                              <p className={`text-xs mt-1 ${message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {(!farmerMessages[selectedFarmer.id] || farmerMessages[selectedFarmer.id].length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl">💬</span>
                            <p className="mt-2">No messages yet</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Message Input */}
                      <div className="border-t p-4">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          />
                          <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Surveys Sub-tab */}
                {selectedFarmerTab === 'surveys' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">Survey Management</h4>
                      <button
                        onClick={() => setShowAssignSurveyModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        + Assign Survey
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {(() => {
                        const farmerSurveys = getFarmerSurveys(selectedFarmer.id);
                        return farmerSurveys.length > 0 ? (
                          farmerSurveys.map((assignment, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <h5 className="font-semibold text-gray-800">{assignment.survey?.title || 'Unknown Survey'}</h5>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      assignment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                      assignment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {assignment.status}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 text-sm mt-1">{assignment.survey?.description}</p>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm">
                                    <div>
                                      <span className="text-gray-500">Assigned:</span>
                                      <p className="font-medium">{assignment.assignedDate}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Due Date:</span>
                                      <p className="font-medium">{assignment.dueDate}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Fields:</span>
                                      <p className="font-medium">{assignment.survey?.fields?.length || 0} questions</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      const updatedSurvey = updateSurveyGrowthStages(assignment.survey, selectedFarmer.cropTypes[0]);
                                      setSelectedSurvey(updatedSurvey);
                                      setShowSurveyModal(true);
                                    }}
                                    className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                                  >
                                    👁️ Preview
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl">📋</span>
                            <p className="mt-2">No surveys assigned yet</p>
                            <p className="text-sm">Click "Assign Survey" to send forms to this farmer</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Analytics Sub-tab */}
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
                                  {[4.2, 4.8, 4.5, 4.7, 5.1].map((yield, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1">
                                      <div 
                                        className="w-full bg-blue-500 rounded-t-md transition-all duration-500 min-h-[4px]"
                                        style={{ height: `${(yield / 6) * 100}%` }}
                                        title={`${yield} tons/ha`}
                                      ></div>
                                      <span className="text-xs text-gray-600 mt-2">
                                        {['Jun', 'Jul', 'Aug', 'Sep', 'Oct'][index]}
                                      </span>
                                      <span className="text-xs font-medium text-blue-600">{yield}t</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Health Status Distribution */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h6 className="font-medium text-gray-800 mb-4">Health Status Distribution</h6>
                                <div className="space-y-2">
                                  {[
                                    { status: 'Excellent', count: 8, color: 'bg-green-500' },
                                    { status: 'Good', count: 12, color: 'bg-blue-500' },
                                    { status: 'Fair', count: 3, color: 'bg-yellow-500' },
                                    { status: 'Poor', count: 1, color: 'bg-red-500' }
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

                      {/* Issues & Alerts Section */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, issues: !prev.issues }))}
                          className="w-full bg-gray-50 hover:bg-gray-100 px-6 py-4 text-left flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">⚠️</span>
                            <span className="font-semibold text-gray-800">Issues & Alerts</span>
                          </div>
                          <span className={`transform transition-transform ${expandedSections.issues ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        
                        {expandedSections.issues && (
                          <div className="p-6 bg-white">
                            <div className="space-y-4">
                              {(() => {
                                const allReports = getFarmerCrops(selectedFarmer.id).flatMap(crop => crop.reports);
                                const issueReports = allReports.filter(report => 
                                  report.pestDiseaseIssues && report.pestDiseaseIssues !== 'None'
                                );
                                
                                if (issueReports.length === 0) {
                                  return (
                                    <div className="text-center py-8 text-gray-500">
                                      <span className="text-4xl">✅</span>
                                      <p className="mt-2">No major issues reported</p>
                                      <p className="text-sm">All crops are showing healthy progress</p>
                                    </div>
                                  );
                                }
                                
                                return issueReports.map((report, index) => (
                                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                      <span className="text-xl">🐛</span>
                                      <div className="flex-1">
                                        <h6 className="font-semibold text-red-800">{report.batchName}</h6>
                                        <p className="text-red-700 text-sm mt-1">{report.pestDiseaseIssues}</p>
                                        <p className="text-red-600 text-xs mt-2">
                                          Reported: {new Date(report.reportDate).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Crop Reports Modal */}
      {showCropReportsModal && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <span className="text-xl">📊</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">On Time</p>
                                  <p className="text-2xl font-bold text-green-600">{analytics.submittedReports}</p>
                                </div>
                                <div className="bg-green-100 p-2 rounded-full">
                                  <span className="text-xl">✅</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-500">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Avg. Yield</p>
                                  <p className="text-2xl font-bold text-purple-600">{analytics.avgYield}</p>
                                  <p className="text-xs text-gray-500">tons/hectare</p>
                                </div>
                                <div className="bg-purple-100 p-2 rounded-full">
                                  <span className="text-xl">🌾</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-orange-500">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                  <p className="text-2xl font-bold text-orange-600">{analytics.submissionRate}%</p>
                                </div>
                                <div className="bg-orange-100 p-2 rounded-full">
                                  <span className="text-xl">📈</span>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {/* Yield Trends Chart */}
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h5 className="font-semibold text-gray-800 mb-4">Yield Trends Over Time</h5>
                        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                          {(() => {
                            const reports = farmerReports[selectedFarmer.id] || [];
                            const monthlyData = [
                              { month: 'Jun', yield: 4.2, target: 4.5 },
                              { month: 'Jul', yield: 4.8, target: 4.5 },
                              { month: 'Aug', yield: 4.5, target: 4.5 },
                              { month: 'Sep', yield: 4.7, target: 4.5 },
                              { month: 'Oct', yield: 5.1, target: 4.5 },
                            ];
                            
                            return (
                              <div className="h-full flex items-end justify-between px-2">
                                {monthlyData.map((data, index) => (
                                  <div key={index} className="flex flex-col items-center flex-1 mx-1">
                                    <div className="flex flex-col items-center justify-end h-40 w-full">
                                      {/* Target line */}
                                      <div 
                                        className="w-full border-t-2 border-dashed border-red-300 mb-1"
                                        style={{ height: `${(data.target / 6) * 100}%` }}
                                        title={`Target: ${data.target} tons/ha`}
                                      ></div>
                                      {/* Actual yield bar */}
                                      <div 
                                        className="w-8 bg-blue-500 rounded-t-md transition-all duration-500"
                                        style={{ height: `${(data.yield / 6) * 100}%` }}
                                        title={`Actual: ${data.yield} tons/ha`}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                                    <span className="text-xs font-medium text-blue-600">{data.yield}t</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                          <div className="absolute top-2 right-2 text-xs text-gray-500">
                            <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span>Actual Yield
                            <span className="inline-block w-3 h-0.5 bg-red-300 border-dashed border-t-2 ml-3 mr-1"></span>Target
                          </div>
                        </div>
                      </div>

                      {/* Growth Stage Progress */}
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h5 className="font-semibold text-gray-800 mb-4">Growth Stage Progress</h5>
                        <div className="space-y-4">
                          {(() => {
                            const reports = farmerReports[selectedFarmer.id] || [];
                            const latestReport = reports[reports.length - 1];
                            const cropType = latestReport?.cropType || selectedFarmer.cropTypes[0];
                            const stages = getGrowthStagesForCrop(cropType);
                            const currentStage = latestReport?.growthStageCode || '10';
                            const currentIndex = stages.findIndex(stage => stage.code === currentStage);
                            
                            return stages.slice(0, 8).map((stage, index) => (
                              <div key={index} className="flex items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  index <= currentIndex 
                                    ? 'bg-green-500 text-white' 
                                    : index === currentIndex + 1
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {index <= currentIndex ? '✓' : index + 1}
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex justify-between items-center">
                                    <span className={`text-sm font-medium ${
                                      index <= currentIndex ? 'text-green-700' : 'text-gray-600'
                                    }`}>
                                      {stage.stage}
                                    </span>
                                    <span className="text-xs text-gray-500">{stage.code}</span>
                                  </div>
                                  <p className="text-xs text-gray-500">{stage.description}</p>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Health Status Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h5 className="font-semibold text-gray-800 mb-4">Health Status Distribution</h5>
                        <div className="relative h-48">
                          {(() => {
                            const reports = farmerReports[selectedFarmer.id] || [];
                            const healthCounts = { Excellent: 0, Good: 0, Fair: 0, Poor: 0 };
                            reports.forEach(report => {
                              healthCounts[report.healthStatus] = (healthCounts[report.healthStatus] || 0) + 1;
                            });
                            
                            const total = Object.values(healthCounts).reduce((sum, count) => sum + count, 0);
                            const colors = { Excellent: 'bg-green-500', Good: 'bg-blue-500', Fair: 'bg-yellow-500', Poor: 'bg-red-500' };
                            
                            return (
                              <div className="flex flex-col h-full">
                                <div className="flex h-32 items-end space-x-2">
                                  {Object.entries(healthCounts).map(([status, count]) => (
                                    <div key={status} className="flex-1 flex flex-col items-center">
                                      <div 
                                        className={`w-8 ${colors[status]} rounded-t-md transition-all duration-500`}
                                        style={{ height: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                                      ></div>
                                      <span className="text-xs text-gray-600 mt-2">{status}</span>
                                      <span className="text-xs font-bold text-gray-800">{count}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h5 className="font-semibold text-gray-800 mb-4">Monthly Report Submissions</h5>
                        <div className="relative h-48">
                          <div className="flex h-32 items-end space-x-1">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, index) => {
                              const height = Math.random() * 80 + 20; // Sample data
                              return (
                                <div key={month} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className="w-6 bg-indigo-500 rounded-t-md transition-all duration-500"
                                    style={{ height: `${height}%` }}
                                  ></div>
                                  <span className="text-xs text-gray-600 mt-2 transform -rotate-45">{month}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reports by Crop Type */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <h5 className="font-semibold text-gray-800 mb-4">Reports by Crop Type</h5>
                      <div className="space-y-6">
                        {(() => {
                          const reports = farmerReports[selectedFarmer.id] || [];
                          const reportsByCrop = {};
                          
                          // Group reports by crop type
                          reports.forEach(report => {
                            if (!reportsByCrop[report.cropType]) {
                              reportsByCrop[report.cropType] = [];
                            }
                            reportsByCrop[report.cropType].push(report);
                          });

                          return Object.entries(reportsByCrop).map(([cropType, cropReports]) => (
                            <div key={cropType} className="border rounded-lg">
                              <div className="bg-gray-50 px-6 py-4 border-b">
                                <div className="flex items-center justify-between">
                                  <h6 className="font-semibold text-gray-800 flex items-center">
                                    <span className="mr-2">
                                      {cropType === 'Rice' ? '🌾' : cropType === 'Corn' ? '🌽' : '🥬'}
                                    </span>
                                    {cropType} Crop Reports
                                  </h6>
                                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {cropReports.length} reports
                                  </span>
                                </div>
                              </div>
                              
                              <div className="p-6">
                                <div className="grid gap-4">
                                  {cropReports.map(report => (
                                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-2">
                                            <h7 className="font-medium text-gray-800">{report.batchName}</h7>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              report.status === 'submitted' ? 'bg-green-100 text-green-800' :
                                              report.status === 'late' ? 'bg-red-100 text-red-800' :
                                              'bg-yellow-100 text-yellow-800'
                                            }`}>
                                              {report.status}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              report.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
                                              report.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                                              report.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'
                                            }`}>
                                              {report.healthStatus}
                                            </span>
                                          </div>
                                          
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                              <span className="text-gray-500">Report Month:</span>
                                              <p className="font-medium">{report.reportMonth}</p>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">Growth Stage:</span>
                                              <p className="font-medium">{report.growthStage}</p>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">Est. Yield:</span>
                                              <p className="font-medium">{report.estimatedYield}</p>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">Submitted:</span>
                                              <p className="font-medium">{report.submissionDate}</p>
                                            </div>
                                          </div>

                                          {(report.pestIssues !== 'None' || report.diseaseIssues !== 'None') && (
                                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                              <p className="text-sm text-yellow-800">
                                                <strong>Issues:</strong> 
                                                {report.pestIssues !== 'None' && ` Pests: ${report.pestIssues}`}
                                                {report.diseaseIssues !== 'None' && ` Diseases: ${report.diseaseIssues}`}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="ml-4">
                                          <button
                                            onClick={() => {
                                              setSelectedReport(report);
                                              setShowReportModal(true);
                                            }}
                                            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded transition-colors text-sm"
                                          >
                                            👁️ View Details
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Crop Summary */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                      <p className="text-gray-600">Average Yield</p>
                                      <p className="text-lg font-bold text-gray-800">
                                        {(cropReports.reduce((sum, r) => sum + parseFloat(r.estimatedYield || 0), 0) / cropReports.length).toFixed(1)} tons/ha
                                      </p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                      <p className="text-gray-600">Latest Stage</p>
                                      <p className="text-lg font-bold text-gray-800">
                                        {cropReports[cropReports.length - 1]?.growthStage || 'N/A'}
                                      </p>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                      <p className="text-gray-600">Success Rate</p>
                                      <p className="text-lg font-bold text-gray-800">
                                        {((cropReports.filter(r => r.status === 'submitted').length / cropReports.length) * 100).toFixed(0)}%
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                        
                        {(() => {
                          const reports = farmerReports[selectedFarmer.id] || [];
                          return reports.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <span className="text-4xl">📊</span>
                              <p className="mt-2">No reports submitted yet</p>
                              <p className="text-sm">Reports will appear here as farmer submits monthly updates</p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Crop Reports Modal */}
      {showCropReportsModal && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
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

      {/* Report Details Modal */}
        {showReportModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Report Details</h3>
                  <p className="text-sm text-gray-600">{selectedReport.batchName} - {selectedReport.reportMonth}</p>
                </div>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setSelectedReport(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Batch Name:</span> <span className="font-medium">{selectedReport.batchName}</span></div>
                      <div><span className="text-gray-600">Crop Type:</span> <span className="font-medium">{selectedReport.cropType}</span></div>
                      <div><span className="text-gray-600">Planting Date:</span> <span className="font-medium">{selectedReport.plantingDate}</span></div>
                      <div><span className="text-gray-600">Report Month:</span> <span className="font-medium">{selectedReport.reportMonth}</span></div>
                      <div><span className="text-gray-600">Submission Date:</span> <span className="font-medium">{selectedReport.submissionDate}</span></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Crop Status</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Growth Stage:</span> <span className="font-medium">{selectedReport.growthStage}</span></div>
                      <div><span className="text-gray-600">Health Status:</span> <span className="font-medium">{selectedReport.healthStatus}</span></div>
                      <div><span className="text-gray-600">Estimated Yield:</span> <span className="font-medium">{selectedReport.estimatedYield}</span></div>
                      <div><span className="text-gray-600">Weather Impact:</span> <span className="font-medium">{selectedReport.weatherImpact}</span></div>
                      {selectedReport.estimatedHarvest && (
                        <div><span className="text-gray-600">Est. Harvest:</span> <span className="font-medium">{selectedReport.estimatedHarvest}</span></div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Issues & Concerns</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Pest Issues:</span>
                      <p className="font-medium">{selectedReport.pestIssues}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Disease Issues:</span>
                      <p className="font-medium">{selectedReport.diseaseIssues}</p>
                    </div>
                  </div>
                </div>
                
                {selectedReport.notes && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Additional Notes</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedReport.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Message Modal */}
        {showMessageModal && selectedFarmer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Send Message</h3>
                  <p className="text-sm text-gray-600">To: {selectedFarmer.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setSelectedFarmer(null);
                    setNewMessage('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type your message here..."
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        sendMessage();
                        setShowMessageModal(false);
                        setSelectedFarmer(null);
                      }}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                      Send Message
                    </button>
                    <button
                      onClick={() => {
                        setShowMessageModal(false);
                        setSelectedFarmer(null);
                        setNewMessage('');
                      }}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                
                {/* Show recent conversation */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3">Recent Conversation</h4>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                    {(farmerMessages[selectedFarmer.id] || []).slice(-3).map(message => (
                      <div key={message.id} className={`text-sm ${
                        message.sender === 'admin' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`inline-block px-3 py-1 rounded-lg ${
                          message.sender === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.message}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Survey Preview Modal */}
        {showSurveyModal && selectedSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedSurvey.title}</h3>
                    <p className="text-gray-600">{selectedSurvey.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSurveyModal(false);
                      setSelectedSurvey(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Survey Fields Preview</h4>
                <div className="space-y-4">
                  {selectedSurvey.fields?.map((field, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <label className="block font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          disabled
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          disabled
                        />
                      )}
                      
                      {field.type === 'select' && (
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled>
                          <option>Select {field.label.toLowerCase()}</option>
                          {field.options?.map((option, optIndex) => (
                            <option key={optIndex} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      )}
                      
                      {field.type === 'file' && (
                        <input
                          type="file"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> This is a preview of how the survey will appear to farmers. 
                    All responses will be automatically linked to crop progress tracking and growth stage analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Survey Modal */}
        {showAssignSurveyModal && selectedFarmer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  Assign Survey to {selectedFarmer.name}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Survey</label>
                    <select
                      id="surveySelect"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a survey...</option>
                      {surveyForms.map(survey => (
                        <option key={survey.id} value={survey.id}>
                          {survey.title} - {survey.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      id="dueDateInput"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Growth Stage Integration</h4>
                    <p className="text-sm text-blue-700">
                      Survey forms will automatically include appropriate growth stages for {selectedFarmer.cropTypes.join(', ')} crops.
                      The farmer will select their current growth stage based on the standardized BBCH agricultural scale.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      const surveySelect = document.getElementById('surveySelect');
                      const dueDateInput = document.getElementById('dueDateInput');
                      
                      if (surveySelect.value && dueDateInput.value) {
                        assignSurveyToFarmer(selectedFarmer.id, surveySelect.value, dueDateInput.value);
                        setShowAssignSurveyModal(false);
                        // Show success message or refresh the surveys tab
                        setSelectedFarmerTab('surveys');
                      } else {
                        alert('Please select a survey and due date');
                      }
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Assign Survey
                  </button>
                  <button
                    onClick={() => setShowAssignSurveyModal(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
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

export default Seed_Track;
