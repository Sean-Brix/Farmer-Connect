import React, { useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
import { useTheme } from '../../../contexts/ThemeContext';
import { useAdminSeedTrack } from './hooks/useSeedTrackQueries';
import { 
  useCropGuidelines, 
  useCreateCropGuideline, 
  useUpdateCropGuideline, 
  useDeleteCropGuideline 
} from './hooks/useCropGuidelines';
import GuidelinesList from './Components/GuidelinesList';
import GuidelineModal from './Components/GuidelineModal';

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
  const { isDark } = useTheme();
  
  // Data from backend
  const { farmers = [], reports: sampleSeedTrackingData = [], cropsByUser = new Map(), isLoading: seedLoading, error: seedError } = useAdminSeedTrack();

  // Crop Guidelines API hooks
  const { data: apiGuidelines, isLoading: guidelinesLoading, error: guidelinesError } = useCropGuidelines({});
  const createGuideline = useCreateCropGuideline();
  const updateGuideline = useUpdateCropGuideline();
  const deleteGuideline = useDeleteCropGuideline();

  // Query client for cache invalidation
  const queryClient = useQueryClient();

  // UI state - Restore last active tab from localStorage
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('admin_seed_track_active_tab') || 'overview';
    } catch {
      return 'overview';
    }
  });
  const [openFarmerTabs, setOpenFarmerTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_open_farmer_tabs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeFarmerId, setActiveFarmerId] = useState(() => {
    try {
      return localStorage.getItem('admin_active_farmer_id') || null;
    } catch {
      return null;
    }
  });
  const [selectedFarmerTab, setSelectedFarmerTab] = useState('reports');
  const [showCropReportsModal, setShowCropReportsModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showDetailedReportModal, setShowDetailedReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({ search: '', status: 'all', location: 'all' });
  
  // Crop view toggle (active vs archived)
  const [showArchivedCrops, setShowArchivedCrops] = useState(false);
  
  // Expandable crop rows in table
  const [expandedCropId, setExpandedCropId] = useState(null);

  // Alerts
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  // Crop Guidelines state (using API)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuidelineModal, setShowGuidelineModal] = useState(false);
  
  // Messages state
  const [pendingMessages, setPendingMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [collapsedCrops, setCollapsedCrops] = useState(new Set()); // Track collapsed crop messages
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [guidelineToDelete, setGuidelineToDelete] = useState(null);
  const [editingGuideline, setEditingGuideline] = useState(null);
  const [adminId, setAdminId] = useState(null); // Store admin user ID
  
  // Stage editor modal states
  const [showStageEditorModal, setShowStageEditorModal] = useState(false);
  const [selectedCropForStageEdit, setSelectedCropForStageEdit] = useState(null);
  const [showStageConfirmModal, setShowStageConfirmModal] = useState(false);
  const [stageAction, setStageAction] = useState(null); // 'skip', 'revert', 'delete-report'
  const [pendingActionData, setPendingActionData] = useState(null);
  
  // Report detail modal states
  const [showReportDetailModal, setShowReportDetailModal] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState(null);

  // Persist open farmer tabs to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('admin_open_farmer_tabs', JSON.stringify(openFarmerTabs));
    } catch (error) {
      console.error('Failed to save farmer tabs:', error);
    }
  }, [openFarmerTabs]);

  // Persist active farmer ID to localStorage
  React.useEffect(() => {
    try {
      if (activeFarmerId) {
        localStorage.setItem('admin_active_farmer_id', activeFarmerId);
      } else {
        localStorage.removeItem('admin_active_farmer_id');
      }
    } catch (error) {
      console.error('Failed to save active farmer ID:', error);
    }
  }, [activeFarmerId]);

  // Persist activeTab to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('admin_seed_track_active_tab', activeTab);
    } catch (error) {
      console.error('Failed to save active tab:', error);
    }
  }, [activeTab]);

  // Fetch admin ID on mount
  React.useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const response = await fetch('/api/account/details/me');
        const data = await response.json();
        if (response.ok && data.id) {
          setAdminId(data.id);
        }
      } catch (error) {
        console.error('Error fetching admin ID:', error);
      }
    };
    fetchAdminId();
  }, []);

  // Fetch messages when Messages main tab is opened
  React.useEffect(() => {
    if (activeTab === 'messages') {
      fetchPendingMessages();
    }
  }, [activeTab]);

  // Fetch messages when farmer Messages sub-tab is opened
  React.useEffect(() => {
    if (activeTab === 'farmer' && selectedFarmerTab === 'messages') {
      fetchPendingMessages();
    }
  }, [activeTab, selectedFarmerTab]);

  // Seed tracking helpers mapping to existing UI expectations
  const getBBCHStages = (cropType) => {
    const stages = {
      'Rice': ['Germination','Seedling','Tillering','Stem elongation','Booting','Heading','Flowering','Milk development','Dough development','Ripening','Senescence','Dormancy','Harvest'],
      'Corn': ['Germination','Seedling','Leaf development','Tillering','Stem elongation','Inflorescence emergence','Flowering','Development of fruit','Ripening','Senescence','Dormancy','Vegetative','Tasseling','Silking','Harvest'],
      'Vegetables': ['Germination','Seedling','Leaf development','Formation of side shoots','Inflorescence emergence','Flowering','Development of fruit','Ripening','Senescence','Dormancy','Transplanting','Vegetative','Harvest']
    };
    return stages[cropType] || stages['Vegetables'];
  };

  // Farmers tabs helpers
  const openFarmerTab = (farmer) => {
    const exists = openFarmerTabs.some((t) => t.farmerId === farmer.farmerId);
    if (!exists) setOpenFarmerTabs((prev) => [...prev, farmer]);
    setActiveFarmerId(farmer.farmerId);
    setActiveTab('farmer');
  };

  const closeFarmerTab = (farmerId, event) => {
    if (event?.stopPropagation) event.stopPropagation();
    const updated = openFarmerTabs.filter((t) => t.farmerId !== farmerId);
    setOpenFarmerTabs(updated);
    if (activeFarmerId === farmerId) {
      if (updated.length > 0) setActiveFarmerId(updated[0].farmerId);
      else {
        setActiveTab('overview');
        setActiveFarmerId(null);
      }
    }
  };

  const getCurrentFarmer = () => openFarmerTabs.find((t) => t.farmerId === activeFarmerId);

  // Helper function to get farmer's crops with reports
  const getFarmerCrops = (farmerId, includeArchived = false) => {
    const userCrops = cropsByUser.get(farmerId) || [];
    
    // Filter by status based on includeArchived flag
    if (includeArchived) {
      // Return only archived/completed crops
      return userCrops.filter(crop => 
        crop.status === 'Archived' || 
        crop.status === 'Completed' ||
        (crop.expectedHarvest && new Date(crop.expectedHarvest) < new Date())
      );
    } else {
      // Return only active crops
      return userCrops.filter(crop => crop.status === 'Active');
    }
  };
  
  // Helper function to archive a crop
  const archiveCrop = async (cropId, reason) => {
    try {
      const res = await fetch(`/api/seed-track/crops/${cropId}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (!res.ok) throw new Error('Failed to archive crop');
      
      showAlert('Crop archived successfully', 'success');
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Archive error:', error);
      showAlert('Failed to archive crop', 'error');
    }
  };
  
  // Helper function to mark crop as completed
  const completeCrop = async (cropId) => {
    try {
      const res = await fetch(`/api/seed-track/crops/${cropId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) throw new Error('Failed to complete crop');
      
      showAlert('Crop marked as completed', 'success');
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Complete error:', error);
      showAlert('Failed to complete crop', 'error');
    }
  };

  // Helper function to skip crop stage (admin control)
  const skipCropStage = async (cropId) => {
    try {
      const res = await fetch(`/api/seed-track/crops/${cropId}/skip-stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to skip stage');
      }
      
      const data = await res.json();
      showAlert(data.message || 'Stage skipped successfully', 'success');
      
      // Refetch queries immediately for instant UI update
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['seed-track'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['seed-track-crops'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['admin-accounts'], type: 'active' })
      ]);
    } catch (error) {
      console.error('Skip stage error:', error);
      showAlert(error.message || 'Failed to skip stage', 'error');
    }
  };

  // Helper function to revert crop stage (admin control)
  const revertCropStage = async (cropId) => {
    try {
      const res = await fetch(`/api/seed-track/crops/${cropId}/revert-stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to revert stage');
      }
      
      const data = await res.json();
      showAlert(data.message || 'Stage reverted successfully', 'success');
      
      // Refetch queries immediately for instant UI update
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['seed-track'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['seed-track-crops'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['admin-accounts'], type: 'active' })
      ]);
    } catch (error) {
      console.error('Revert stage error:', error);
      showAlert(error.message || 'Failed to revert stage', 'error');
    }
  };

  // Helper function to delete a report (admin control)
  const deleteReport = async (reportId) => {
    try {
      const res = await fetch(`/api/seed-track/reports/${reportId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to reset report');
      }
      
      showAlert('Report reset to pending. Farmer can now resubmit.', 'success');
      
      // Refetch queries immediately for instant UI update
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['seed-track'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['seed-track-crops'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['admin-accounts'], type: 'active' })
      ]);
    } catch (error) {
      console.error('Delete report error:', error);
      showAlert(error.message || 'Failed to reset report', 'error');
    }
  };

  // Stage editor modal functions
  const openStageEditor = (crop) => {
    console.log('[Seed Track] Opening stage editor for crop:', crop);
    console.log('[Seed Track] Crop reports:', crop.reports);
    setSelectedCropForStageEdit(crop);
    setShowStageEditorModal(true);
  };

  const handleStageAction = (action, data = null) => {
    setStageAction(action);
    setPendingActionData(data);
    setShowStageConfirmModal(true);
  };

  const confirmStageAction = async () => {
    setShowStageConfirmModal(false);
    
    try {
      if (stageAction === 'skip') {
        await skipCropStage(selectedCropForStageEdit.id);
      } else if (stageAction === 'revert') {
        await revertCropStage(selectedCropForStageEdit.id);
      } else if (stageAction === 'delete-report') {
        await deleteReport(pendingActionData.reportId);
      }
      setShowStageEditorModal(false);
    } catch (error) {
      console.error('Stage action error:', error);
    }
  };

  // Messages management functions
  const fetchPendingMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch('/api/seed-track/messages/pending');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      if (data.success) {
        setPendingMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      showAlert('Failed to load messages', 'error');
    } finally {
      setMessagesLoading(false);
    }
  };

  // Group messages by farmer
  const farmerMessagesMap = useMemo(() => {
    const map = new Map();
    pendingMessages.forEach(msg => {
      const userId = msg.user.id;
      if (!map.has(userId)) {
        map.set(userId, {
          user: msg.user,
          messages: [],
          lastMessageDate: msg.createdAt
        });
      }
      map.get(userId).messages.push(msg);
      // Update last message date if this message is newer
      if (new Date(msg.createdAt) > new Date(map.get(userId).lastMessageDate)) {
        map.get(userId).lastMessageDate = msg.createdAt;
      }
    });
    return map;
  }, [pendingMessages]);

  // Open farmer's tab with messages
  const openFarmerMessages = (userId) => {
    const farmer = farmers.find(f => f.id === userId);
    if (farmer) {
      openFarmerTab({ 
        farmerId: farmer.id, 
        name: farmer.name, 
        ...farmer 
      });
      setSelectedFarmerTab('messages');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const sendReply = async (messageId, cropId) => {
    if (!replyText.trim()) return;
    if (!adminId) {
      showAlert('Admin session not found. Please refresh the page.', 'error');
      return;
    }
    
    try {
      const res = await fetch(`/api/seed-track/messages/${messageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: replyText,
          userId: adminId
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to send reply');
      }
      
      showAlert('Reply sent successfully', 'success');
      setReplyText('');
      setSelectedMessage(null);
      
      fetchPendingMessages(); // Refresh list
    } catch (error) {
      console.error('Error sending reply:', error);
      showAlert(error.message || 'Failed to send reply', 'error');
    }
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
      // Only show farmers with active registered crops
      const userCrops = cropsByUser.get(farmer.id) || [];
      const hasActiveCrops = userCrops.some(crop => crop.status === 'Active');
      if (!hasActiveCrops) {
        return false;
      }
      
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

  // Overview statistics for charts and KPIs
  const getOverviewStatistics = () => {
    const totalFarmers = farmers.length;
    const totalReports = sampleSeedTrackingData.length;

    const cropDistribution = sampleSeedTrackingData.reduce((acc, r) => {
      acc[r.crop] = (acc[r.crop] || 0) + 1;
      return acc;
    }, {});

    const healthDistribution = sampleSeedTrackingData.reduce((acc, r) => {
      const key = r.healthStatus || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReports = sampleSeedTrackingData.filter((r) => new Date(r.reportDate) >= thirtyDaysAgo);

    const activeCropsSet = new Set();
    sampleSeedTrackingData.forEach((r) => activeCropsSet.add(`${r.farmerId}-${r.crop}`));

    return {
      totalFarmers,
      totalReports,
      recentReports: recentReports.length,
      activeCrops: activeCropsSet.size,
      cropDistribution,
      healthDistribution,
    };
  };

  // Export overview data
  const exportOverviewData = () => {
    try {
      const stats = getOverviewStatistics();
      const exportData = {
        exportInfo: {
          title: 'Seed Track Overview Export',
          exportDate: new Date().toISOString(),
          exportedBy: 'Admin',
        },
        overviewStatistics: {
          totalFarmers: stats.totalFarmers,
          totalReports: stats.totalReports,
          recentReports: stats.recentReports,
          activeCrops: stats.activeCrops,
          cropDistribution: stats.cropDistribution,
          healthDistribution: stats.healthDistribution,
        },
        farmersData: farmers.map((f) => ({
          id: f.id,
          name: f.name,
          email: f.email,
          location: f.location,
          joinDate: f.joinDate,
          cropTypes: f.cropTypes,
          totalReports: f.totalReports,
          status: f.status,
        })),
        reportsData: sampleSeedTrackingData.map((r) => ({
          farmerId: r.farmerId,
          crop: r.crop,
          variety: r.variety,
          plantingDate: r.plantingDate,
          reportDate: r.reportDate,
          growthStage: r.growthStage,
          plantHeight: r.plantHeight,
          healthStatus: r.healthStatus,
          estimatedYield: r.estimatedYield,
          area: r.area,
        })),
        summary: {
          generatedAt: new Date().toISOString(),
          totalRecords: farmers.length + sampleSeedTrackingData.length,
          dataIntegrity: 'Complete',
        },
      };

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
    } catch (err) {
      console.error('Export error:', err);
      showAlert('Error exporting data. Please try again.', 'error');
    }
  };

  // Crop guidelines helpers
  const categoryOptions = [
    { value: 'Cereals', label: 'Cereals & Grains', icon: '🌾' },
    { value: 'Vegetables', label: 'Vegetables', icon: '🥬' },
    { value: 'Fruits', label: 'Fruits', icon: '🍎' },
    { value: 'Legumes', label: 'Legumes', icon: '🫘' },
    { value: 'Root_Crops', label: 'Root Crops', icon: '🥔' },
    { value: 'Herbs_Spices', label: 'Herbs & Spices', icon: '🌿' },
  ];

  const filteredGuidelines = (apiGuidelines || []).filter((g) => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const name = (g.name || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const varieties = Array.isArray(g.varieties) ? g.varieties : [];
    const matchesSearch = !term || name.includes(term) || varieties.some((v) => String(v).toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  // Guideline CRUD handlers
  const handleSaveGuideline = async (guidelineData) => {
    try {
      if (editingGuideline) {
        // Update existing guideline
        await updateGuideline.mutateAsync({
          id: editingGuideline.id,
          ...guidelineData
        });
        showAlert('Guideline updated successfully!', 'success');
      } else {
        // Create new guideline
        await createGuideline.mutateAsync(guidelineData);
        showAlert('Guideline created successfully!', 'success');
      }
      setShowGuidelineModal(false);
      setEditingGuideline(null);
    } catch (error) {
      console.error('Save guideline error:', error);
      showAlert(error.message || 'Failed to save guideline', 'error');
    }
  };

  const handleEditGuideline = (guideline) => {
    setEditingGuideline(guideline);
    setShowGuidelineModal(true);
  };

  const handleDeleteGuideline = async () => {
    if (!guidelineToDelete) return;
    
    try {
      await deleteGuideline.mutateAsync(guidelineToDelete.id);
      showAlert('Guideline deleted successfully!', 'success');
      setShowDeleteModal(false);
      setGuidelineToDelete(null);
    } catch (error) {
      console.error('Delete guideline error:', error);
      showAlert(error.message || 'Failed to delete guideline', 'error');
    }
  };

  // Loading and error states
  if (seedLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gray-50'}`}>
        <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Loading seed tracking data…</div>
      </div>
    );
  }
  if (seedError) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gray-50'}`}>
        <div className="text-red-700">Failed to load data.</div>
      </div>
    );
  }

  // UI markup (preserved styling)
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mt-8 sm:mt-16">
        {alert?.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 max-w-sm ${alert.type === 'success' ? (isDark ? 'bg-green-900 border-green-500 text-green-200' : 'bg-green-50 border-green-500 text-green-800') : (isDark ? 'bg-gray-800 border-gray-500 text-gray-200' : 'bg-gray-50 border-gray-500 text-gray-800')}`}>
            <span className="font-medium text-sm">{alert.message}</span>
          </div>
        )}

        {/* Main Content Container */}
        <div className={`rounded-lg border shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="p-6 lg:p-8">
            {/* Navigation Tabs */}
            <div className={`border-b mb-8 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <nav className="flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors duration-200 ${
                    activeTab === 'overview'
                      ? 'border-green-600 text-green-600'
                      : isDark ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                      : isDark ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="hidden sm:inline">Crop Guidelines</span>
                  <span className="sm:hidden">Guidelines</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors duration-200 ${
                    activeTab === 'messages'
                      ? 'border-green-600 text-green-600'
                      : isDark ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Messages
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
                          : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
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
                      className={`ml-2 p-1 rounded-md transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
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
                    <div className={`rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-900' : 'bg-green-50'}`}>
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.totalFarmers}</h3>
                          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Farmers</p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <svg className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.totalReports}</h3>
                          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Reports</p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-900' : 'bg-green-50'}`}>
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.activeCrops}</h3>
                          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Crops</p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <svg className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{stats.recentReports}</h3>
                          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Recent Reports</p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Filters Section - Clean Professional Design */}
            <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>

              {/* Search Bar and Filters in horizontal layout */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Search Bar - positioned on the left */}
                <div className="lg:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search farmers by name or email..."
                      value={filters.search || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border border-gray-200 bg-white text-gray-700 placeholder-gray-400'}`}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col justify-end sm:flex-row lg:col-span-3 gap-4 sm:gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className={`w-full rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-200 bg-white text-gray-700'}`}
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
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Items per page</label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className={`w-full rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-200 bg-white text-gray-700'}`}
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

            {/* Farmers Table - Clean Professional Design */}
            <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              {/* Table Header */}
              <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Farmers Directory
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={exportOverviewData}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      <span>📤</span>
                      Export Overview
                    </button>
                    <div className={`text-sm px-3 py-1 rounded-full ${isDark ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}>
                      {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getFilteredFarmers().length)} of {getFilteredFarmers().length} farmers
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Farmer</th>
                      <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Client Profile</th>
                      <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Current Crops</th>
                      <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-100'}`}>
                    {getPaginatedFarmers().map((farmer) => (
                      <tr key={farmer.id} className={`transition-colors duration-150 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            <div className="ml-0">
                              <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{farmer.name}</div>
                              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ID: {farmer.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className={`text-sm ${isDark ? 'text-gray-200' : 'text-black'}`}>{farmer.location}</div>
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{farmer.joinDate}</div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              // Get only active crops (not archived or completed)
                              const userCrops = cropsByUser.get(farmer.id) || [];
                              const activeCrops = userCrops.filter(crop => 
                                crop.status !== 'Archived' && crop.status !== 'Completed'
                              );
                              
                              if (activeCrops.length === 0) {
                                return (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-400 border border-gray-600' : 'bg-gray-100 text-gray-500 border border-gray-300'}`}>
                                    None
                                  </span>
                                );
                              }
                              
                              // Get unique crop types from active crops
                              const activeCropTypes = [...new Set(activeCrops.map(c => c.cropType))];
                              
                              return activeCropTypes.map((cropType, index) => (
                                <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}>
                                  {cropType}
                                </span>
                              ));
                            })()}
                          </div>
                        </td>
    
                        <td className="px-3 py-3 whitespace-nowrap text-right">
                          <button
                            onClick={() => {
                              openFarmerTab({ farmerId: farmer.id, name: farmer.name, ...farmer });
                              setTimeout(() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }, 100);
                            }}
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
              <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Page {currentPage} of {getTotalPages()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600' : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'}`}
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
                                : isDark ? 'text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
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
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600' : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            {/* Messages Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  💬 Farmers with Pending Messages
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Click on a farmer to view and reply to their messages</p>
              </div>
              <button
                onClick={fetchPendingMessages}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Refresh
              </button>
            </div>

            {messagesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading messages...</p>
              </div>
            ) : farmerMessagesMap.size === 0 ? (
              <div className={`text-center py-16 rounded-lg border-2 border-dashed ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                <span className="text-6xl block mb-4">📭</span>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Pending Messages</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>All farmer messages have been addressed</p>
              </div>
            ) : (
              <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        Farmer
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        Messages
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        Last Message
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        Preview
                      </th>
                      <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                    {Array.from(farmerMessagesMap.values()).map((farmerData) => (
                      <tr 
                        key={farmerData.user.id}
                        className={`transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
                              <span className="text-lg">👤</span>
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {farmerData.user.firstName} {farmerData.user.surname}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                @{farmerData.user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'}`}>
                            {farmerData.messages.length} pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                            {new Date(farmerData.lastMessageDate).toLocaleDateString()}
                          </div>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {new Date(farmerData.lastMessageDate).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm max-w-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {farmerData.messages[0].message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openFarmerMessages(farmerData.user.id)}
                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                          >
                            View & Reply
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

  {/* Crop Guidelines Tab */}
        {activeTab === 'guidelines' && (
          <div>
            {/* Guidelines Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Crop Guidelines Management
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage crop growing guidelines for farmers</p>
              </div>
              <button
                onClick={() => {
                  setEditingGuideline(null);
                  setShowGuidelineModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <span>+</span>
                Add New Guideline
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className={`rounded-lg p-4 mb-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Search Guidelines</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by crop name or variety..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border border-gray-300 bg-white text-gray-700 placeholder-gray-400'}`}
                    />
                  </div>
                </div>
                <div className="min-w-[200px]">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300 bg-white text-gray-700'}`}
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

            {/* Guidelines List Component */}
            <GuidelinesList
              guidelines={filteredGuidelines}
              isLoading={guidelinesLoading}
              error={guidelinesError}
              onEdit={handleEditGuideline}
              onDelete={(guideline) => {
                setGuidelineToDelete(guideline);
                setShowDeleteModal(true);
              }}
              onViewDetails={(guideline) => {
                // Optional: Implement view details functionality
                handleEditGuideline(guideline);
              }}
            />

            {/* Empty State */}
            {!guidelinesLoading && filteredGuidelines.length === 0 && (
              <div className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <div className="text-6xl mb-4 opacity-30">📚</div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No guidelines found</h3>
                <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                      setEditingGuideline(null);
                      setShowGuidelineModal(true);
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
            <div className={`rounded-xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              {/* Enhanced Farmer Header */}
              <div className={`border-b p-4 sm:p-5 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="ml-0">
                      <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentFarmer.name}</h2>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{currentFarmer.email}</p>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{currentFarmer.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      currentFarmer.status === 'Active' ? 'bg-green-100 text-green-700' : (isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700')
                    }`}>
                      {currentFarmer.status}
                    </span>
                  </div>
                </div>

                {/* Enhanced Sub Navigation */}
                <div className="mt-6">
                  <nav className="flex flex-wrap gap-2 sm:gap-6">
                    <button
                      onClick={() => setSelectedFarmerTab('reports')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        selectedFarmerTab === 'reports'
                          ? 'border-green-500 text-gray-900'
                          : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="hidden sm:inline">Current Crops</span>
                      <span className="sm:hidden">Current</span>
                    </button>
                    <button
                      onClick={() => setSelectedFarmerTab('archive')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        selectedFarmerTab === 'archive'
                          ? 'border-green-500 text-gray-900'
                          : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="hidden sm:inline">Archive</span>
                    </button>
                    <button
                      onClick={() => setSelectedFarmerTab('messages')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        selectedFarmerTab === 'messages'
                          ? 'border-green-500 text-gray-900'
                          : isDark ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="hidden sm:inline">Messages</span>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Enhanced Tab Content */}
              <div className="p-4 sm:p-6">
                {/* Current Crops Tab */}
                {selectedFarmerTab === 'reports' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h4 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Current Crops
                      </h4>
                      <span className={`text-sm px-3 py-1 rounded-full ${isDark ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}>
                        {getFarmerCrops(currentFarmer.id, false).length} active
                      </span>
                    </div>
                    
                    {/* Crops Table */}
                    {getFarmerCrops(currentFarmer.id, false).length > 0 ? (
                      <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <table className={`w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Crop</th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Variety</th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Stage</th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Reports Status</th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {getFarmerCrops(currentFarmer.id, false).map((crop, index) => {
                              const latestReport = crop.reports && crop.reports.length > 0 ? crop.reports[crop.reports.length - 1] : null;
                              
                              return (
                                <React.Fragment key={crop.id}>
                                  <tr className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                                    <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                      <div className="font-medium">{crop.cropType}</div>
                                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Planted: {new Date(crop.plantingDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                      </div>
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {crop.variety}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap`}>
                                      <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          latestReport?.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                                          latestReport?.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                          latestReport?.healthStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                                          'bg-gray-100 text-gray-600'
                                        }`}>
                                          {crop.currentStageName || crop.currentStage || latestReport?.growthStage || 'N/A'}
                                        </span>
                                        {crop.guideline && crop.guideline.stages && (
                                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {crop.currentStageIndex + 1}/{crop.guideline.stages.length}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap`}>
                                      {(() => {
                                        const allReports = crop.reports || [];
                                        const pendingReports = allReports.filter(r => r.status === 'Pending').length;
                                        const lateReports = allReports.filter(r => r.status === 'Late').length;
                                        const submittedReports = allReports.filter(r => r.status === 'Submitted').length;
                                        
                                        if (lateReports > 0) {
                                          return (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                              ⚠️ {lateReports} Overdue
                                            </span>
                                          );
                                        } else if (pendingReports > 0) {
                                          return (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                              📋 {pendingReports} Pending
                                            </span>
                                          );
                                        } else if (submittedReports > 0) {
                                          return (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                              ✅ All Submitted
                                            </span>
                                          );
                                        } else {
                                          return (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                              No Reports
                                            </span>
                                          );
                                        }
                                      })()}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-right text-sm font-medium`}>
                                      <div className="flex items-center gap-2 justify-end flex-wrap">
                                        {/* Stage Editor Button */}
                                        {crop.guideline && crop.guideline.stages && (
                                          <button
                                            onClick={() => openStageEditor(crop)}
                                            className={`px-3 py-2 text-xs rounded-md transition-colors flex items-center gap-1 ${
                                              isDark 
                                                ? 'bg-green-700 hover:bg-green-800 text-white' 
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                            title="Edit crop stages"
                                          >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Edit Stages
                                          </button>
                                        )}
                                        <button
                                          onClick={() => setExpandedCropId(expandedCropId === crop.id ? null : crop.id)}
                                          className={`px-3 py-2 text-xs rounded-md transition-colors ${
                                            isDark 
                                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                                              : 'bg-green-500 hover:bg-green-600 text-white'
                                          }`}
                                        >
                                          {expandedCropId === crop.id ? 'Hide' : 'View'} Reports ({
                                            crop.reports?.filter(r => {
                                              const hasValidStatus = r.status === 'Submitted' || r.status === 'Late';
                                              const hasData = r.submittedAt != null && (r.healthStatus != null || r.plantHeight != null);
                                              const hasValidHealth = r.healthStatus && r.healthStatus !== 'Unknown';
                                              return hasValidStatus && hasData && hasValidHealth;
                                            }).length || 0
                                          })
                                        </button>
                                        <button
                                          onClick={() => {
                                            const reason = window.prompt('Reason for archiving this crop (optional):');
                                            if (reason !== null) {
                                              archiveCrop(crop.id, reason);
                                            }
                                          }}
                                          className={`px-3 py-2 text-xs rounded-md transition-colors ${
                                            isDark 
                                              ? 'bg-green-500 hover:bg-green-600 text-white' 
                                              : 'bg-green-400 hover:bg-green-500 text-white'
                                          }`}
                                          title="Archive"
                                        >
                                          📦
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                  {expandedCropId === crop.id && (() => {
                                    const filteredReports = crop.reports?.filter(r => {
                                      const hasValidStatus = r.status === 'Submitted' || r.status === 'Late';
                                      const hasData = r.submittedAt != null && (r.healthStatus != null || r.plantHeight != null);
                                      const hasValidHealth = r.healthStatus && r.healthStatus !== 'Unknown';
                                      return hasValidStatus && hasData && hasValidHealth;
                                    }) || [];
                                    return filteredReports.length > 0;
                                  })() && (
                                    <tr>
                                      <td colSpan="4" className={`px-4 py-3 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                        <div className="overflow-x-auto">
                                          <table className={`w-full text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <thead className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                              <tr>
                                                <th className="px-3 py-2 text-left font-medium">Date</th>
                                                <th className="px-3 py-2 text-left font-medium">Health</th>
                                                <th className="px-3 py-2 text-left font-medium">Height</th>
                                                <th className="px-3 py-2 text-left font-medium">Issues</th>
                                                <th className="px-3 py-2 text-left font-medium">Notes</th>
                                                <th className="px-3 py-2 text-left font-medium">Actions</th>
                                              </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                              {crop.reports?.filter(r => {
                                                const hasValidStatus = r.status === 'Submitted' || r.status === 'Late';
                                                const hasData = r.submittedAt != null && (r.healthStatus != null || r.plantHeight != null);
                                                const hasValidHealth = r.healthStatus && r.healthStatus !== 'Unknown';
                                                return hasValidStatus && hasData && hasValidHealth;
                                              }).map((report, idx) => (
                                                <tr key={idx} className={isDark ? 'hover:bg-gray-800' : 'hover:bg-white'}>
                                                  <td className="px-3 py-2 whitespace-nowrap">
                                                    {new Date(report.submittedAt || report.createdAt).toLocaleDateString('en-US', { 
                                                      month: 'short', 
                                                      day: 'numeric',
                                                      year: 'numeric'
                                                    })}
                                                  </td>
                                                  <td className="px-3 py-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                      report.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                                                      report.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                                      report.healthStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                                                      'bg-gray-100 text-gray-600'
                                                    }`}>
                                                      {report.healthStatus || 'Unknown'}
                                                    </span>
                                                  </td>
                                                  <td className="px-3 py-2">{report.plantHeight || 'N/A'} cm</td>
                                                  <td className="px-3 py-2 max-w-xs truncate">{report.pestsObserved || report.pestsAndDiseases || 'None'}</td>
                                                  <td className="px-3 py-2 max-w-xs truncate">{report.notes || '-'}</td>
                                                  <td className="px-3 py-2 whitespace-nowrap">
                                                    <div className="flex gap-1">
                                                      <button
                                                        onClick={() => {
                                                          setSelectedReportDetail(report);
                                                          setShowReportDetailModal(true);
                                                        }}
                                                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                                                          isDark 
                                                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                        }`}
                                                        title="View report details"
                                                      >
                                                        👁️ View
                                                      </button>
                                                      <button
                                                        onClick={() => {
                                                          if (window.confirm(`⚠️ DELETE REPORT CONFIRMATION\n\nReport Date: ${new Date(report.submittedAt || report.createdAt).toLocaleDateString()}\nHealth Status: ${report.healthStatus || 'Unknown'}\n\nThis action cannot be undone. Are you sure you want to delete this report?`)) {
                                                            deleteReport(report.id);
                                                          }
                                                        }}
                                                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                                                          isDark 
                                                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                                                            : 'bg-red-500 hover:bg-red-600 text-white'
                                                        }`}
                                                        title="Delete report"
                                                      >
                                                        🗑️ Delete
                                                      </button>
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <span className="text-6xl">🌱</span>
                        <p className="mt-4 text-xl">No active crops</p>
                        <p className="text-sm">This farmer hasn't planted any crops yet</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Archive Tab */}
                {selectedFarmerTab === 'archive' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h4 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Archived Crops
                      </h4>
                      <span className={`text-sm px-3 py-1 rounded-full ${isDark ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}>
                        {getFarmerCrops(currentFarmer.id, true).length} archived
                      </span>
                    </div>

                    {getFarmerCrops(currentFarmer.id, true).length > 0 ? (
                      <div className="space-y-4">
                        {getFarmerCrops(currentFarmer.id, true).map((crop) => {
                          const plantingDateFormatted = new Date(crop.plantingDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          });
                          const harvestDateFormatted = crop.expectedHarvest ? new Date(crop.expectedHarvest).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'N/A';

                          return (
                            <div key={crop.id} className={`border rounded-lg p-6 opacity-90 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h5 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{crop.cropType} - {crop.variety}</h5>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      crop.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                      crop.status === 'Archived' ? (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700') :
                                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {crop.status}
                                    </span>
                                  </div>
                                  <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span>🌱 Planted: {plantingDateFormatted}</span>
                                    <span>🌾 Expected Harvest: {harvestDateFormatted}</span>
                                    <span>📏 Area: {crop.area} hectares</span>
                                  </div>
                                  {crop.notes && (
                                    <div className={`mt-2 text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                      Note: {crop.notes}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {crop.reports?.length || 0} reports
                                  </div>
                                  <button
                                    onClick={() => {
                                      const expectedMonths = getExpectedReportMonths(crop.plantingDate, crop.expectedHarvest);
                                      setSelectedCrop({
                                        ...crop,
                                        expectedMonths,
                                        farmerId: currentFarmer.id
                                      });
                                      setShowCropReportsModal(true);
                                    }}
                                    className={`mt-2 text-xs underline ${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'}`}
                                  >
                                    View Reports
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="text-6xl">📦</span>
                        <p className={`mt-4 text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No archived crops</p>
                        <p className="text-sm">Completed or archived crops will appear here</p>
                      </div>
                    )}
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
                    <div className={`rounded-lg p-6 mb-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h5 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>📊 Quick Overview</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(() => {
                          const analytics = getFarmerAnalytics(currentFarmer.id);
                          return (
                            <>
                              <div className={`text-center p-3 rounded-lg shadow-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analytics.totalReports}</div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Reports</div>
                              </div>
                              <div className={`text-center p-3 rounded-lg shadow-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analytics.activeCrops}</div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Crops</div>
                              </div>
                              <div className={`text-center p-3 rounded-lg shadow-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{analytics.avgPlantHeight}cm</div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Height</div>
                              </div>
                              <div className={`text-center p-3 rounded-lg shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="text-2xl font-bold text-orange-600">{analytics.totalEstimatedYield}kg</div>
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Est. Yield</div>
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
                              fill: false
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
                                },
                                ticks: {
                                  maxRotation: 0,
                                  minRotation: 0,
                                  align: 'center',
                                  font: {
                                    size: 12,
                                    weight: 'bold'
                                  },
                                  padding: 10
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
                                },
                                ticks: {
                                  maxRotation: 0,
                                  minRotation: 0,
                                  align: 'center',
                                  font: {
                                    size: 14,
                                    weight: 'bold'
                                  },
                                  padding: 20,
                                  autoSkip: true,
                                  autoSkipPadding: 30
                                }
                              }
                            }
                          };

                          return (
                            <div key={cropIndex} className={`border rounded-lg p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                              <div className="mb-4">
                                <h6 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{crop.cropType} - Growth Analytics</h6>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                                <h6 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>📈 Recent Reports Timeline</h6>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                  {crop.reports.slice(-5).reverse().map((report, reportIndex) => (
                                    <div key={reportIndex} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                      <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                          report.healthStatus === 'Healthy' ? 'bg-green-500' :
                                          report.healthStatus === 'Warning' ? 'bg-yellow-500' :
                                          report.healthStatus === 'Critical' ? 'bg-red-500' :
                                          'bg-gray-500'
                                        }`}></div>
                                        <div>
                                          <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{report.reportDate}</div>
                                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Stage: {report.growthStage}</div>
                                        </div>
                                      </div>
                                      <div className="text-right text-sm">
                                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{report.plantHeight}cm</div>
                                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{report.estimatedYield}kg</div>
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

                {/* Messages Tab */}
                {selectedFarmerTab === 'messages' && (
                  <div>
                    {(() => {
                      const farmerMessages = pendingMessages.filter(msg => msg.user.id === currentFarmer.id);
                      
                      if (farmerMessages.length === 0) {
                        return (
                          <div className={`text-center py-16 rounded-lg border-2 border-dashed ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                            <span className="text-6xl block mb-4">📭</span>
                            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Messages</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>This farmer hasn't sent any messages yet</p>
                          </div>
                        );
                      }

                      // Group messages by crop
                      const messagesByCrop = farmerMessages.reduce((acc, msg) => {
                        const cropKey = msg.crop.id;
                        if (!acc[cropKey]) {
                          acc[cropKey] = {
                            crop: msg.crop,
                            messages: [],
                            allMessages: [],
                            hasUnreplied: false // Track if there are messages without admin replies
                          };
                        }
                        acc[cropKey].messages.push(msg);
                        
                        // Check if this message has no admin replies
                        if (!msg.replies || msg.replies.length === 0) {
                          acc[cropKey].hasUnreplied = true;
                        }
                        
                        // Flatten messages with replies for chat display
                        acc[cropKey].allMessages.push({
                          ...msg,
                          isAdminReply: false,
                          isOriginal: true
                        });
                        if (msg.replies && msg.replies.length > 0) {
                          msg.replies.forEach(reply => {
                            acc[cropKey].allMessages.push({
                              ...reply,
                              isAdminReply: true,
                              isOriginal: false
                            });
                          });
                        }
                        
                        return acc;
                      }, {});

                      return (
                        <div className="space-y-4">
                          {Object.values(messagesByCrop).map((cropData) => {
                            const isCollapsed = collapsedCrops.has(cropData.crop.id);
                            
                            return (
                              <div key={cropData.crop.id} className={`rounded-lg border overflow-hidden ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
                                {/* Collapsible Crop Header */}
                                <button
                                  onClick={() => {
                                    const newCollapsed = new Set(collapsedCrops);
                                    if (isCollapsed) {
                                      newCollapsed.delete(cropData.crop.id);
                                    } else {
                                      newCollapsed.add(cropData.crop.id);
                                    }
                                    setCollapsedCrops(newCollapsed);
                                  }}
                                  className={`w-full px-5 py-3.5 text-left transition-colors flex items-center justify-between ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <span className="text-2xl">🌾</span>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                          {cropData.crop.cropType} - {cropData.crop.variety}
                                        </h3>
                                        {cropData.hasUnreplied && (
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-red-900/40 text-red-300 border border-red-700' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                                            Needs Reply
                                          </span>
                                        )}
                                      </div>
                                      <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {cropData.messages.length} {cropData.messages.length === 1 ? 'message' : 'messages'} • {cropData.crop.currentStageName || `Stage ${cropData.crop.currentStageIndex + 1}`}
                                      </p>
                                    </div>
                                  </div>
                                  <svg 
                                    className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {/* Collapsible Content */}
                                {!isCollapsed && (
                                  <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                    {/* Chat Thread */}
                                    <div className={`p-5 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
                                      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                                        {cropData.allMessages.map((comment, idx) => (
                                          <div key={idx} className={`flex gap-3 ${comment.isAdminReply ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                              comment.isAdminReply 
                                                ? 'bg-green-600 text-white' 
                                                : isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                                            }`}>
                                              {comment.isAdminReply ? '👨‍💼' : '👤'}
                                            </div>
                                            <div className={`flex-1 ${comment.isAdminReply ? 'items-end' : 'items-start'} flex flex-col`}>
                                              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                                                comment.isAdminReply 
                                                  ? isDark ? 'bg-green-700 text-white' : 'bg-green-600 text-white'
                                                  : isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900 border border-gray-200'
                                              }`}>
                                                <p className="text-sm leading-relaxed">
                                                  {comment.message}
                                                </p>
                                              </div>
                                              <span className={`text-xs mt-1 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {new Date(comment.createdAt).toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Reply Form */}
                                      <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                                        <textarea
                                          value={selectedMessage === cropData.crop.id ? replyText : ''}
                                          onChange={(e) => {
                                            setReplyText(e.target.value);
                                            setSelectedMessage(cropData.crop.id);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                              e.preventDefault();
                                              if (replyText.trim()) {
                                                const lastFarmerMsg = cropData.messages[cropData.messages.length - 1];
                                                sendReply(lastFarmerMsg.id, cropData.crop.id);
                                              }
                                            }
                                          }}
                                          placeholder="Type your reply... (Press Enter to send, Shift+Enter for new line)"
                                          rows={3}
                                          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm resize-none ${
                                            isDark
                                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500'
                                          } focus:outline-none focus:ring-2 focus:ring-green-500/30`}
                                        />
                                        <div className="flex justify-end mt-2.5">
                                          <button
                                            onClick={() => {
                                              // Send reply to the last farmer message in this crop
                                              const lastFarmerMsg = cropData.messages[cropData.messages.length - 1];
                                              sendReply(lastFarmerMsg.id, cropData.crop.id);
                                            }}
                                            disabled={!replyText.trim()}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                              replyText.trim()
                                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                          >
                                            <span>Send Reply</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

  {/* Professional Crop Reports Modal */}
        {showCropReportsModal && selectedCrop && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
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
                        🌱 Planted: {new Date(selectedCrop.plantingDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} • 🌾 Expected Harvest: {selectedCrop.expectedHarvest ? new Date(selectedCrop.expectedHarvest).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'N/A'} • 📏 Area: {selectedCrop.area} hectares
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
              <div className={`p-4 max-h-[calc(90vh-120px)] overflow-y-auto ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Expected Harvest Timeline */}
                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-4 flex items-center border-b pb-2 ${isDark ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Expected Monthly Reports Timeline
                  </h3>
                  
                  <div className={`rounded-lg p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {selectedCrop.expectedMonths.map((month, index) => {
                        // Check if there's a report for this month
                        const hasReport = Array.isArray(selectedCrop.reports) && selectedCrop.reports.some(report => {
                          if (!report || !report.reportDate) return false;
                          // Extract YYYY-MM from reportDate (handles both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss.sssZ" formats)
                          const reportMonth = String(report.reportDate).substring(0, 7);
                          return reportMonth === month;
                        });
                        
                        const currentDate = new Date().toISOString().slice(0, 7); // Current YYYY-MM
                        const isCurrentMonth = month === currentDate;
                        const isPastMonth = month < currentDate;
                        
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
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Report Submitted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Current Month</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Missing Report</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded mr-2 border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}></div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Future Report</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Reports List */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center border-b pb-2 ${isDark ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
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
                        <div key={index} className={`border rounded-lg overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                          {/* Report Header */}
                          <div className={`px-4 py-3 border-l-4 ${
                            report.healthStatus === 'Healthy' ? (isDark ? 'bg-green-900/30 border-green-500' : 'bg-green-50 border-green-500') :
                            report.healthStatus === 'Warning' ? (isDark ? 'bg-gray-800 border-gray-500' : 'bg-gray-50 border-gray-500') :
                            report.healthStatus === 'Critical' ? (isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-600') :
                            isDark ? 'bg-gray-800 border-gray-400' : 'bg-white border-gray-400'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`text-base font-semibold flex items-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                <span className={`w-6 h-6 rounded flex items-center justify-center mr-2 text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}`}>
                                  #{selectedCrop.reports.length - index}
                                </span>
                                Report - {new Date(report.reportDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
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
                          
                          {/* View Full Report Button */}
                          <div className="px-4 py-3 bg-white border-t border-gray-200">
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setShowDetailedReportModal(true);
                              }}
                              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span>View Full Report Details</span>
                            </button>
                          </div>
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

        {/* Detailed Report View Modal */}
        {showDetailedReportModal && selectedReport && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-300">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 border-b border-green-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Complete Monthly Report</h2>
                      <p className="text-green-100 mt-1 flex items-center space-x-2">
                        <span>📅 {new Date(selectedReport.reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-white/20 rounded">{selectedReport.growthStage}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailedReportModal(false);
                      setSelectedReport(null);
                    }}
                    className="text-white hover:bg-white/20 text-2xl w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto bg-gray-50">
                <div className="space-y-6">
                  
                  {/* Weather Conditions */}
                  {selectedReport.weatherSnapshot && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        🌤️ Weather Conditions at Time of Report
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedReport.weatherSnapshot.temp && (
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                            <p className="text-sm text-orange-700 font-medium">Temperature</p>
                            <p className="text-2xl font-bold text-orange-900 mt-1">{selectedReport.weatherSnapshot.temp.toFixed(1)}°C</p>
                          </div>
                        )}
                        {selectedReport.weatherSnapshot.humidity && (
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-blue-700 font-medium">Humidity</p>
                            <p className="text-2xl font-bold text-blue-900 mt-1">{selectedReport.weatherSnapshot.humidity.toFixed(0)}%</p>
                          </div>
                        )}
                        {selectedReport.weatherSnapshot.precipitation !== undefined && (
                          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                            <p className="text-sm text-cyan-700 font-medium">Precipitation</p>
                            <p className="text-2xl font-bold text-cyan-900 mt-1">{selectedReport.weatherSnapshot.precipitation} mm</p>
                          </div>
                        )}
                        {selectedReport.weatherSnapshot.windSpeed && (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-700 font-medium">Wind Speed</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{selectedReport.weatherSnapshot.windSpeed} km/h</p>
                          </div>
                        )}
                      </div>
                      {selectedReport.weatherImpact && (
                        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                          <p className="text-sm font-medium text-yellow-800">Weather Impact: {selectedReport.weatherImpact}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Basic Plantation Information */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M7 21l3-9 9-3-3 9-9 3z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      🌱 Basic Plantation Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-2">Growth Stage</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedReport.growthStage}</p>
                      </div>
                      {selectedReport.plantHeight && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-2">Plant Height</p>
                          <p className="text-lg font-semibold text-gray-900">~{selectedReport.plantHeight} cm</p>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-2">Health Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          selectedReport.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                          selectedReport.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                          selectedReport.healthStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedReport.healthStatus || 'Not Specified'}
                        </span>
                      </div>
                      {selectedReport.estimatedYield && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-2">Estimated Yield</p>
                          <p className="text-lg font-semibold text-gray-900">~{selectedReport.estimatedYield} kg</p>
                        </div>
                      )}
                      {selectedReport.actualYield && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-2">Actual Yield</p>
                          <p className="text-lg font-semibold text-green-700">{selectedReport.actualYield} kg</p>
                        </div>
                      )}
                      {selectedReport.soilCondition && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-2">Soil Condition</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedReport.soilCondition}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pest & Disease Management */}
                  {(selectedReport.pestsObserved || selectedReport.diseasesObserved) && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        🐛 Pest & Disease Management
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedReport.pestsObserved && (
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="text-sm font-semibold text-red-800 mb-2">Pests Observed</p>
                            <p className="text-gray-700">{selectedReport.pestsObserved}</p>
                          </div>
                        )}
                        {selectedReport.diseasesObserved && (
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <p className="text-sm font-semibold text-orange-800 mb-2">Diseases Observed</p>
                            <p className="text-gray-700">{selectedReport.diseasesObserved}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Farm Management Activities */}
                  {(selectedReport.fertilizersApplied || selectedReport.pesticideApplications || selectedReport.irrigationFrequency || selectedReport.majorActivities) && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        🛠️ Management Activities
                      </h3>
                      <div className="space-y-4">
                        {selectedReport.fertilizersApplied && (
                          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-green-600 font-semibold mt-0.5">💊</span>
                            <div>
                              <p className="text-sm font-semibold text-green-800">Fertilizers Applied</p>
                              <p className="text-gray-700 mt-1">{selectedReport.fertilizersApplied}</p>
                            </div>
                          </div>
                        )}
                        {selectedReport.pesticideApplications && (
                          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <span className="text-yellow-600 font-semibold mt-0.5">🧪</span>
                            <div>
                              <p className="text-sm font-semibold text-yellow-800">Pesticide Applications</p>
                              <p className="text-gray-700 mt-1">{selectedReport.pesticideApplications}</p>
                            </div>
                          </div>
                        )}
                        {selectedReport.irrigationFrequency && (
                          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-blue-600 font-semibold mt-0.5">💧</span>
                            <div>
                              <p className="text-sm font-semibold text-blue-800">Irrigation Frequency</p>
                              <p className="text-gray-700 mt-1">{selectedReport.irrigationFrequency}</p>
                            </div>
                          </div>
                        )}
                        {selectedReport.majorActivities && (
                          <div className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                            <span className="text-indigo-600 font-semibold mt-0.5">📋</span>
                            <div>
                              <p className="text-sm font-semibold text-indigo-800">Major Activities This Month</p>
                              <p className="text-gray-700 mt-1">{selectedReport.majorActivities}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Challenges & Planning */}
                  {(selectedReport.challenges || selectedReport.plannedActions) && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        📋 Challenges & Future Planning
                      </h3>
                      <div className="space-y-4">
                        {selectedReport.challenges && (
                          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Challenges Faced</p>
                            <p className="text-gray-700">{selectedReport.challenges}</p>
                          </div>
                        )}
                        {selectedReport.plannedActions && (
                          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-sm font-semibold text-emerald-900 mb-2">🎯 Planned Actions for Next Month</p>
                            <p className="text-gray-700">{selectedReport.plannedActions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Monthly Costs */}
                  {selectedReport.costs && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        💰 Monthly Costs (₱)
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedReport.costs.seeds && (
                          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                            <p className="text-xs text-amber-700 font-medium">Seeds</p>
                            <p className="text-xl font-bold text-amber-900 mt-1">₱{parseFloat(selectedReport.costs.seeds).toLocaleString()}</p>
                          </div>
                        )}
                        {selectedReport.costs.fertilizer && (
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <p className="text-xs text-green-700 font-medium">Fertilizer</p>
                            <p className="text-xl font-bold text-green-900 mt-1">₱{parseFloat(selectedReport.costs.fertilizer).toLocaleString()}</p>
                          </div>
                        )}
                        {selectedReport.costs.pesticides && (
                          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                            <p className="text-xs text-yellow-700 font-medium">Pesticides</p>
                            <p className="text-xl font-bold text-yellow-900 mt-1">₱{parseFloat(selectedReport.costs.pesticides).toLocaleString()}</p>
                          </div>
                        )}
                        {selectedReport.costs.labor && (
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <p className="text-xs text-blue-700 font-medium">Labor</p>
                            <p className="text-xl font-bold text-blue-900 mt-1">₱{parseFloat(selectedReport.costs.labor).toLocaleString()}</p>
                          </div>
                        )}
                        {selectedReport.costs.irrigation && (
                          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                            <p className="text-xs text-cyan-700 font-medium">Irrigation</p>
                            <p className="text-xl font-bold text-cyan-900 mt-1">₱{parseFloat(selectedReport.costs.irrigation).toLocaleString()}</p>
                          </div>
                        )}
                        {selectedReport.costs.equipment && (
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <p className="text-xs text-purple-700 font-medium">Equipment</p>
                            <p className="text-xl font-bold text-purple-900 mt-1">₱{parseFloat(selectedReport.costs.equipment).toLocaleString()}</p>
                          </div>
                        )}
                        {selectedReport.costs.others && (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-700 font-medium">Others</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">₱{parseFloat(selectedReport.costs.others).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                      {/* Total Cost */}
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                        <div className="flex items-center justify-between text-white">
                          <span className="font-semibold text-lg">Total Monthly Cost</span>
                          <span className="font-bold text-2xl">
                            ₱{Object.values(selectedReport.costs).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {selectedReport.notes && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        📝 Additional Notes
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{selectedReport.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Submission Info */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 border border-gray-300">
                    <p className="text-sm text-gray-600 text-center">
                      📅 Report submitted on {selectedReport.submissionDate ? new Date(selectedReport.submissionDate).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

          </div> 
        </div> 
        
    {/* Guideline Create/Edit Modal */}
    <GuidelineModal
      isOpen={showGuidelineModal}
      onClose={() => {
        setShowGuidelineModal(false);
        setEditingGuideline(null);
      }}
      guideline={editingGuideline}
      onSave={handleSaveGuideline}
      isLoading={createGuideline.isPending || updateGuideline.isPending}
    />

    {/* Delete Confirmation Modal */}
  {showDeleteModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Delete Crop Guideline</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the guideline for "{guidelineToDelete?.name}"? This action cannot be undone.
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
              onClick={handleDeleteGuideline}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Stage Editor Modal */}
    {showStageEditorModal && selectedCropForStageEdit && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Modal Header */}
          <div className={`px-6 py-4 border-b ${isDark ? 'bg-gradient-to-r from-indigo-900 to-indigo-800 border-gray-700' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Stage Editor</h3>
                  <p className="text-sm text-indigo-100">{selectedCropForStageEdit.cropType} - {selectedCropForStageEdit.variety}</p>
                </div>
              </div>
              <button
                onClick={() => setShowStageEditorModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {/* Stage Progress Visual */}
            <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
              <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📊 Stage Progression
              </h4>
              
              <div className="space-y-3">
                {selectedCropForStageEdit.guideline?.stages?.map((stage, index) => {
                  const isCurrent = index === selectedCropForStageEdit.currentStageIndex;
                  const isPast = index < selectedCropForStageEdit.currentStageIndex;
                  const isFuture = index > selectedCropForStageEdit.currentStageIndex;

                  return (
                    <div key={index} className="flex items-center gap-3">
                      {/* Stage Number Circle */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isCurrent 
                          ? 'bg-green-500 text-white ring-4 ring-green-300 shadow-lg' 
                          : isPast 
                          ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isPast ? '✓' : index + 1}
                      </div>

                      {/* Stage Info */}
                      <div className="flex-1">
                        <div className={`font-semibold ${
                          isCurrent 
                            ? isDark ? 'text-green-400' : 'text-green-600'
                            : isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          {stage.stageName}
                          {isCurrent && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">CURRENT</span>}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Duration: {stage.durationValue} {stage.durationUnit}
                        </div>
                      </div>

                      {/* Progress Line */}
                      {index < selectedCropForStageEdit.guideline.stages.length - 1 && (
                        <div className={`absolute left-8 w-0.5 h-8 ${
                          isPast ? 'bg-blue-500' : isDark ? 'bg-gray-700' : 'bg-gray-300'
                        }`} style={{ marginTop: '3.5rem' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Revert Stage */}
              <button
                onClick={() => handleStageAction('revert')}
                disabled={selectedCropForStageEdit.currentStageIndex === 0}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedCropForStageEdit.currentStageIndex === 0
                    ? isDark 
                      ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed' 
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                    : isDark
                    ? 'bg-orange-900/30 border-orange-600 hover:bg-orange-900/50 text-orange-400 hover:shadow-lg'
                    : 'bg-orange-50 border-orange-300 hover:bg-orange-100 text-orange-700 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⏪</span>
                  <span className="font-bold text-lg">Revert Stage</span>
                </div>
                <p className="text-sm">
                  {selectedCropForStageEdit.currentStageIndex === 0 
                    ? 'Already at first stage' 
                    : `Move back to: ${selectedCropForStageEdit.guideline?.stages[selectedCropForStageEdit.currentStageIndex - 1]?.stageName}`}
                </p>
              </button>

              {/* Skip Stage */}
              <button
                onClick={() => handleStageAction('skip')}
                disabled={selectedCropForStageEdit.currentStageIndex >= selectedCropForStageEdit.guideline?.stages?.length - 1}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedCropForStageEdit.currentStageIndex >= selectedCropForStageEdit.guideline?.stages?.length - 1
                    ? isDark
                      ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                    : isDark
                    ? 'bg-purple-900/30 border-purple-600 hover:bg-purple-900/50 text-purple-400 hover:shadow-lg'
                    : 'bg-purple-50 border-purple-300 hover:bg-purple-100 text-purple-700 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⏩</span>
                  <span className="font-bold text-lg">Skip Stage</span>
                </div>
                <p className="text-sm">
                  {selectedCropForStageEdit.currentStageIndex >= selectedCropForStageEdit.guideline?.stages?.length - 1
                    ? 'Already at final stage'
                    : `Advance to: ${selectedCropForStageEdit.guideline?.stages[selectedCropForStageEdit.currentStageIndex + 1]?.stageName}`}
                </p>
              </button>
            </div>

            {/* Reports Section */}
            {(() => {
              console.log('[Seed Track] Reports section check:', {
                hasReports: !!selectedCropForStageEdit.reports,
                reportsLength: selectedCropForStageEdit.reports?.length,
                reports: selectedCropForStageEdit.reports
              });
              return selectedCropForStageEdit.reports && selectedCropForStageEdit.reports.length > 0;
            })() && (
              <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {(() => {
                  // Log all reports for debugging
                  console.log('[Seed Track] Rendering reports section, all reports:', selectedCropForStageEdit.reports);
                  
                  // Filter out Pending reports AND reports with no actual data (null/undefined fields)
                  const submittedReports = selectedCropForStageEdit.reports.filter(report => {
                    // Must be submitted or late
                    const hasValidStatus = report.status === 'Submitted' || report.status === 'Late';
                    // Must have at least one non-null data field and submittedAt timestamp
                    const hasData = report.submittedAt != null && (report.healthStatus != null || report.plantHeight != null);
                    // Don't show if health status is "Unknown"
                    const hasValidHealth = report.healthStatus && report.healthStatus !== 'Unknown';
                    
                    console.log('[Seed Track] Filtering report:', {
                      reportId: report.id,
                      status: report.status,
                      hasValidStatus,
                      hasData,
                      hasValidHealth,
                      submittedAt: report.submittedAt,
                      healthStatus: report.healthStatus,
                      plantHeight: report.plantHeight,
                      willShow: hasValidStatus && hasData && hasValidHealth
                    });
                    
                    return hasValidStatus && hasData && hasValidHealth;
                  });
                  
                  console.log('[Seed Track] Filtered submitted reports count:', submittedReports.length);
                  return (
                    <>
                      <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        📋 Recent Reports ({submittedReports.length})
                      </h4>
                      {submittedReports.length === 0 ? (
                        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <div className="text-4xl mb-2">📝</div>
                          <p className="text-sm">No submitted reports yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {submittedReports.slice(-5).reverse().map((report, idx) => (
                    <div key={idx} className={`p-3 rounded-lg flex items-center justify-between ${
                      isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                    } transition-colors`}>
                      <div className="flex-1">
                        <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                          {report.stageName || 'N/A'} - {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Health: {report.healthStatus || 'Unknown'} • Height: {report.plantHeight || 'N/A'} cm
                        </div>
                      </div>
                      <button
                        onClick={() => handleStageAction('delete-report', { reportId: report.id, reportDate: new Date(report.createdAt || report.reportDate).toLocaleDateString() })}
                        className={`ml-4 px-3 py-1 text-xs rounded-md transition-colors ${
                          isDark
                            ? 'bg-red-900/50 hover:bg-red-900 text-red-300'
                            : 'bg-red-100 hover:bg-red-200 text-red-700'
                        }`}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className={`px-6 py-4 border-t ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <button
              onClick={() => setShowStageEditorModal(false)}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Stage Action Confirmation Modal */}
    {showStageConfirmModal && selectedCropForStageEdit && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
        <div className={`rounded-xl shadow-2xl w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Warning Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Confirm Action</h3>
                <p className="text-sm text-yellow-100">Please review before proceeding</p>
              </div>
            </div>
          </div>

          {/* Confirmation Body */}
          <div className="p-6">
            <div className={`space-y-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {stageAction === 'skip' && (
                <>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                    <p className="font-semibold mb-2">⏩ Skip Current Stage</p>
                    <p className="text-sm">
                      <strong>Crop:</strong> {selectedCropForStageEdit.cropType} - {selectedCropForStageEdit.variety}<br />
                      <strong>Current:</strong> {selectedCropForStageEdit.currentStageName} ({selectedCropForStageEdit.currentStageIndex + 1}/{selectedCropForStageEdit.guideline?.stages?.length})<br />
                      <strong className="text-purple-600">New Stage:</strong> {selectedCropForStageEdit.guideline?.stages[selectedCropForStageEdit.currentStageIndex + 1]?.stageName} ({selectedCropForStageEdit.currentStageIndex + 2}/{selectedCropForStageEdit.guideline?.stages?.length})
                    </p>
                  </div>
                </>
              )}

              {stageAction === 'revert' && (
                <>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
                    <p className="font-semibold mb-2">⏪ Revert to Previous Stage</p>
                    <p className="text-sm">
                      <strong>Crop:</strong> {selectedCropForStageEdit.cropType} - {selectedCropForStageEdit.variety}<br />
                      <strong>Current:</strong> {selectedCropForStageEdit.currentStageName} ({selectedCropForStageEdit.currentStageIndex + 1}/{selectedCropForStageEdit.guideline?.stages?.length})<br />
                      <strong className="text-orange-600">New Stage:</strong> {selectedCropForStageEdit.guideline?.stages[selectedCropForStageEdit.currentStageIndex - 1]?.stageName} ({selectedCropForStageEdit.currentStageIndex}/{selectedCropForStageEdit.guideline?.stages?.length})
                    </p>
                  </div>
                </>
              )}

              {stageAction === 'delete-report' && (
                <>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
                    <p className="font-semibold mb-2 text-red-600">🗑️ Delete Report</p>
                    <p className="text-sm">
                      <strong>Report Date:</strong> {pendingActionData?.reportDate}<br />
                      <strong className="text-red-600">Warning:</strong> This action cannot be undone!
                    </p>
                  </div>
                </>
              )}

              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you sure you want to proceed with this action?
              </p>
            </div>
          </div>

          {/* Confirmation Footer */}
          <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} rounded-b-xl`}>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStageConfirmModal(false);
                  setStageAction(null);
                  setPendingActionData(null);
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmStageAction}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  stageAction === 'delete-report'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : stageAction === 'skip'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Report Detail Modal */}
    {showReportDetailModal && selectedReportDetail && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
        <div className={`rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Modal Header */}
          <div className={`sticky top-0 px-6 py-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex justify-between items-center z-10`}>
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📊 Report Details
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Submitted: {new Date(selectedReportDetail.submittedAt || selectedReportDetail.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={() => {
                setShowReportDetailModal(false);
                setSelectedReportDetail(null);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Report Status & Stage */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Stage</p>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {selectedReportDetail.stageName || 'N/A'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  selectedReportDetail.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                  selectedReportDetail.status === 'Late' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedReportDetail.status}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🌱 Plant Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Health Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                    selectedReportDetail.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                    selectedReportDetail.healthStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                    selectedReportDetail.healthStatus === 'Critical' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedReportDetail.healthStatus || 'Unknown'}
                  </span>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Plant Height</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedReportDetail.plantHeight ? `${selectedReportDetail.plantHeight} cm` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Farm Management */}
            {(selectedReportDetail.pestsObserved || selectedReportDetail.diseasesObserved || 
              selectedReportDetail.fertilizersApplied || selectedReportDetail.pesticideApplications) && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  🚜 Farm Management
                </h4>
                <div className="space-y-3">
                  {selectedReportDetail.pestsObserved && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Pests Observed:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.pestsObserved}</p>
                    </div>
                  )}
                  {selectedReportDetail.diseasesObserved && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Diseases Observed:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.diseasesObserved}</p>
                    </div>
                  )}
                  {selectedReportDetail.fertilizersApplied && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Fertilizers Applied:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.fertilizersApplied}</p>
                    </div>
                  )}
                  {selectedReportDetail.pesticideApplications && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Pesticide Applications:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.pesticideApplications}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Environmental Conditions */}
            {(selectedReportDetail.irrigationFrequency || selectedReportDetail.soilCondition || 
              selectedReportDetail.weatherImpact) && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  🌦️ Environmental Conditions
                </h4>
                <div className="space-y-3">
                  {selectedReportDetail.irrigationFrequency && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Irrigation Frequency:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.irrigationFrequency}</p>
                    </div>
                  )}
                  {selectedReportDetail.soilCondition && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Soil Condition:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.soilCondition}</p>
                    </div>
                  )}
                  {selectedReportDetail.weatherImpact && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Weather Impact:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.weatherImpact}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes & Planned Actions */}
            {(selectedReportDetail.notes || selectedReportDetail.plannedActions) && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  📝 Notes & Planning
                </h4>
                <div className="space-y-3">
                  {selectedReportDetail.notes && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Notes:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.notes}</p>
                    </div>
                  )}
                  {selectedReportDetail.plannedActions && (
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Planned Actions:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedReportDetail.plannedActions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Yield & Costs */}
            {(selectedReportDetail.actualYield || selectedReportDetail.costs) && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  💰 Yield & Financial
                </h4>
                {selectedReportDetail.actualYield && (
                  <div className="mb-3">
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actual Yield:</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedReportDetail.actualYield} kg
                    </p>
                  </div>
                )}
                {selectedReportDetail.costs && typeof selectedReportDetail.costs === 'object' && (
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Costs Breakdown:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(selectedReportDetail.costs).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{key}:</span>
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>₱{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className={`sticky bottom-0 px-6 py-4 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <button
              onClick={() => {
                setShowReportDetailModal(false);
                setSelectedReportDetail(null);
              }}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  </div>
  );
}

export default Seed_Track;
