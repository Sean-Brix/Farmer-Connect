import React, { useState, useMemo, useCallback } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import ReportModal from '../../PlantingReport/ReportModal';
import { usePlantingReport } from '../../../../contexts/PlantingReportContext';

// Helper function to determine smart date labels
const getDateLabels = (request) => {
  const pickupAdjusted = request.actual_pickup && 
    new Date(request.actual_pickup).getTime() !== new Date(request.pickupDate).getTime();
  if (!pickupAdjusted) {
    return { pickupLabel: null, pickupAdjusted: false };
  }

  return { pickupLabel: '(adjusted)', pickupAdjusted: true };
};

// Helper function to generate system status prompts
const getSystemPrompt = (request) => {
  const now = new Date();
  const pickupDate = new Date(request.pickupDate);

  const daysDiff = (date1, date2) => Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24));

  switch (request.status) {
    case 'Pending': {
      const daysWaiting = daysDiff(now, new Date(request.createdAt));
      const pickupIn = daysDiff(pickupDate, now);
      if (pickupIn < 0) {
        return {
          type: 'error',
          icon: 'fa-exclamation-triangle',
          message: `URGENT: Pending for ${daysWaiting} day${daysWaiting !== 1 ? 's' : ''}. Pickup date passed by ${Math.abs(pickupIn)} day${Math.abs(pickupIn) !== 1 ? 's' : ''}. Approve/Reject immediately.`
        };
      }
      if (pickupIn <= 2) {
        return {
          type: 'warning',
          icon: 'fa-clock',
          message: `Pickup in ${pickupIn} day${pickupIn !== 1 ? 's' : ''}. Pending ${daysWaiting} day${daysWaiting !== 1 ? 's' : ''}. Please approve/reject soon.`
        };
      }
      return {
        type: 'info',
        icon: 'fa-hourglass-half',
        message: `Pending for ${daysWaiting} day${daysWaiting !== 1 ? 's' : ''}. Pickup scheduled in ${pickupIn} day${pickupIn !== 1 ? 's' : ''}.`
      };
    }

    case 'Approved': {
      const pickupDue = daysDiff(pickupDate, now);
      if (pickupDue < 0) {
        return {
          type: 'error',
          icon: 'fa-exclamation-circle',
          message: `Pickup is overdue by ${Math.abs(pickupDue)} day${Math.abs(pickupDue) !== 1 ? 's' : ''}.`
        };
      }
      if (pickupDue <= 2) {
        return {
          type: 'warning',
          icon: 'fa-clock',
          message: `Pickup in ${pickupDue} day${pickupDue !== 1 ? 's' : ''}. User has been notified.`
        };
      }
      return {
        type: 'success',
        icon: 'fa-calendar-check',
        message: `Ready for pickup in ${pickupDue} day${pickupDue !== 1 ? 's' : ''}.`
      };
    }

    case 'Picked_Up':
    case 'late_pickup': {
      const reportDeadline = request.plantingReportDeadline ? new Date(request.plantingReportDeadline) : null;
      if (request.plantingReportStatus === 'Submitted') {
        return {
          type: 'info',
          icon: 'fa-circle-check',
          message: `Report already submitted. Click "View Report" to see details.${request.status === 'late_pickup' ? ' (Pickup was late)' : ''}`
        };
      }

      if (reportDeadline) {
        const reportDue = daysDiff(reportDeadline, now);
        if (reportDue < 0) {
          return {
            type: 'error',
            icon: 'fa-exclamation-triangle',
            message: `Report OVERDUE by ${Math.abs(reportDue)} day${Math.abs(reportDue) !== 1 ? 's' : ''}. Contact farmer urgently.${request.status === 'late_pickup' ? ' (Pickup was late)' : ''}`
          };
        }
        if (reportDue <= 3) {
          return {
            type: 'warning',
            icon: 'fa-bell',
            message: `Report due in ${reportDue} day${reportDue !== 1 ? 's' : ''}. Send reminder to farmer.${request.status === 'late_pickup' ? ' (Pickup was late)' : ''}`
          };
        }
        return {
          type: 'info',
          icon: 'fa-seedling',
          message: `Seeds distributed. Report due in ${reportDue} day${reportDue !== 1 ? 's' : ''}.${request.status === 'late_pickup' ? ' (Pickup was late)' : ''}`
        };
      }

      return {
        type: 'info',
        icon: 'fa-seedling',
        message: `Seeds distributed. Awaiting planting report.${request.status === 'late_pickup' ? ' (Pickup was late)' : ''}`
      };
    }

    case 'Planted':
      return {
        type: 'success',
        icon: 'fa-check-circle',
        message: 'Report submitted. Review and archive when complete.'
      };

    default:
      return null;
  }
};

export default function RequestSection({ 
  requests = [], 
  onStatusChange, 
  onRefresh, 
  onBack, 
  isLoading = false 
}) {
  const { isDark } = useTheme();
  
  // State
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState('');
  const [itemFilter, setItemFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [currentDistributionRequest, setCurrentDistributionRequest] = useState(null);
  const selectedRequest = useMemo(() => {
    if (selectedReportId) {
      return requests.find(r => r.plantingReportId === selectedReportId) || null;
    }
    return null;
  }, [selectedReportId, requests]);
  const isSeedingComplete = useCallback((req) => {
    const r = req.plantingReport;
    if (!r) return false;
    const required = [
      r.dateOfPlanting,
      r.areaPlanted,
      r.seedClassification,
      r.typeOfCrop,
      r.plantingMethod,
      r.varietyId,
    ];
    return required.every(Boolean);
  }, []);
  
  // Planting report context
  const { createReport, updateReport, fetchSeasons, fetchVarieties, archiveReport } = usePlantingReport();
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Categorize requests by status
  const categorizedRequests = useMemo(() => {
    const plantingInProgress = requests.filter(req => ['Picked_Up', 'late_pickup'].includes(req.status) && !isSeedingComplete(req));
    const planted = requests.filter(req => req.status === 'Planted' || (['Picked_Up', 'late_pickup'].includes(req.status) && isSeedingComplete(req)));
    return {
      pending: requests.filter(req => req.status === 'Pending'),
      reserved: requests.filter(req => req.status === 'Approved'),
      planting: plantingInProgress,
      planted,
      archive: requests.filter(req => ['Rejected', 'No_Pickup', 'Cancelled', 'Archived'].includes(req.status))
    };
  }, [requests, isSeedingComplete]);

  // Apply search and filters
  const filteredRequests = useMemo(() => {
    let filtered = categorizedRequests[activeTab] || [];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(req =>
        req.itemName?.toLowerCase().includes(searchLower) ||
        req.requestorName?.toLowerCase().includes(searchLower) ||
        req.requestNote?.toLowerCase().includes(searchLower)
      );
    }

    // Item filter
    if (itemFilter !== 'all') {
      filtered = filtered.filter(req => req.itemName === itemFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter(req => req.requestorName === userFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dateFilter === 'today') {
        filtered = filtered.filter(req => {
          const reqDate = new Date(req.createdAt);
          return reqDate >= today;
        });
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(req => new Date(req.createdAt) >= weekAgo);
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(req => new Date(req.createdAt) >= monthAgo);
      }
    }

    // Status filter (for archive tab)
    if (activeTab === 'archive' && statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    return filtered;
  }, [categorizedRequests, activeTab, search, itemFilter, userFilter, dateFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage, itemsPerPage]);
  
  // Ensure currentPage doesn't exceed totalPages
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset to page 1 when filters or tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, itemFilter, userFilter, dateFilter, statusFilter]);

  // Action handlers
  const handleApprove = useCallback(async (request) => {
    try {
      const itemName = request.itemName || 'Unknown Item';
      const requestorName = request.requestorName || 'Unknown User';
      const requestQuantity = request.requestQuantity || request.quantity || 0;
      const currentStock = request.currentStock || 0;
      const requestNote = request.requestNote || null;
      
      const success = await onStatusChange(request.id, 'Approved', itemName, requestorName, requestQuantity, currentStock, requestNote);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to approve request');
    }
  }, [onStatusChange, onRefresh]);

  const handleReject = useCallback(async (request) => {
    try {
      const itemName = request.itemName || 'Unknown Item';
      const requestorName = request.requestorName || 'Unknown User';
      const requestQuantity = request.requestQuantity || request.quantity || 0;
      const currentStock = request.currentStock || 0;
      const requestNote = request.requestNote || null;
      
      const success = await onStatusChange(request.id, 'Rejected', itemName, requestorName, requestQuantity, currentStock, requestNote);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to reject request');
    }
  }, [onStatusChange, onRefresh]);

  const handlePickup = useCallback(async (request) => {
    try {
      const itemName = request.itemName || 'Unknown Item';
      const requestorName = request.requestorName || 'Unknown User';
      const requestQuantity = request.requestQuantity || request.quantity || 0;
      const currentStock = request.currentStock || 0;
      
      // Smart detection: Check if pickup is late
      const now = new Date();
      const pickupDate = new Date(request.pickupDate);
      const isLate = now > pickupDate;
      const status = isLate ? 'late_pickup' : 'Picked_Up';
      
      const success = await onStatusChange(request.id, status, itemName, requestorName, requestQuantity, currentStock);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to mark as picked up');
    }
  }, [onStatusChange, onRefresh]);

  const handleNoPickup = useCallback(async (request) => {
    try {
      const itemName = request.itemName || 'Unknown Item';
      const requestorName = request.requestorName || 'Unknown User';
      const requestQuantity = request.requestQuantity || request.quantity || 0;
      const currentStock = request.currentStock || 0;
      const requestNote = request.requestNote || null;
      
      const success = await onStatusChange(request.id, 'No_Pickup', itemName, requestorName, requestQuantity, currentStock, requestNote);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to mark as no pickup');
    }
  }, [onStatusChange, onRefresh]);

  const handleCancel = useCallback(async (request) => {
    try {
      const itemName = request.itemName || 'Unknown Item';
      const requestorName = request.requestorName || 'Unknown User';
      const requestQuantity = request.requestQuantity || request.quantity || 0;
      const currentStock = request.currentStock || 0;
      const requestNote = request.requestNote || null;
      
      const success = await onStatusChange(request.id, 'Cancelled', itemName, requestorName, requestQuantity, currentStock, requestNote);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  }, [onStatusChange, onRefresh]);

  const tabs = [
    { id: 'pending', label: 'Pending', count: categorizedRequests.pending.length },
    { id: 'reserved', label: 'Reserved', count: categorizedRequests.reserved.length },
    { id: 'planting', label: 'Planting', count: categorizedRequests.planting.length },
    { id: 'planted', label: 'Planted', count: categorizedRequests.planted.length },
    { id: 'archive', label: 'Archive', count: categorizedRequests.archive.length }
  ];

  const canArchiveReport = (report) => {
    if (!report) return false;
    const required = [
      report.dateOfPlanting,
      report.areaPlanted,
      report.seedClassification,
      report.typeOfCrop,
      report.plantingMethod,
      report.varietyId,
      report.dateOfExpectedHarvest,
    ];
    return required.every(Boolean);
  };

  const handleArchiveRequest = useCallback(async (request) => {
    if (!request.plantingReportId) {
      toast.error('Submit a planting report before archiving.');
      return;
    }
    if (!canArchiveReport(request.plantingReport)) {
      toast.error('Complete planting details and expected harvest before archiving.');
      return;
    }
    try {
      // Ensure request status reaches Planted before archiving to satisfy server transitions
      if (request.status !== 'Planted') {
        await onStatusChange(
          request.id,
          'Planted',
          request.itemName || 'Unknown Item',
          request.requestorName || 'Unknown User',
          request.requestQuantity || request.quantity || 0,
          request.currentStock || 0,
          request.requestNote || null
        );
      }

      await archiveReport(request.plantingReportId);

      await onStatusChange(
        request.id,
        'Archived',
        request.itemName || 'Unknown Item',
        request.requestorName || 'Unknown User',
        request.requestQuantity || request.quantity || 0,
        request.currentStock || 0,
        request.requestNote || null
      );

      toast.success('Request and report archived.');
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to archive request');
    }
  }, [archiveReport, onStatusChange, onRefresh]);

  const toggleRow = (requestId) => {
    setExpandedRow(expandedRow === requestId ? null : requestId);
  };

  // Helper function to check if pickup date is overdue
  const isPickupOverdue = (request) => {
    if (!request.pickupDate) return false;
    const pickupDate = new Date(request.pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return pickupDate < today;
  };

  // Helper function to calculate days overdue for pickup
  const getDaysOverdue = (request) => {
    if (!request.pickupDate) return 0;
    const pickupDate = new Date(request.pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today - pickupDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Get unique items and users for filters
  const uniqueItems = useMemo(() => {
    const items = new Set();
    requests.forEach(req => {
      if (req.itemName) items.add(req.itemName);
    });
    return Array.from(items).sort();
  }, [requests]);

  const uniqueUsers = useMemo(() => {
    const users = new Set();
    requests.forEach(req => {
      if (req.requestorName) users.add(req.requestorName);
    });
    return Array.from(users).sort();
  }, [requests]);
  const columnCount = activeTab === 'archive' ? 4 : 5;
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setItemFilter('all');
    setUserFilter('all');
    setDateFilter('all');
    setStatusFilter('all');
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'text-yellow-600 dark:text-yellow-400',
      'Approved': 'text-green-600 dark:text-green-400',
      'Picked_Up': 'text-blue-600 dark:text-blue-400',
      'late_pickup': 'text-orange-600 dark:text-orange-400',
      'Planted': 'text-teal-600 dark:text-teal-400',
      'Rejected': 'text-red-600 dark:text-red-400',
      'No_Pickup': 'text-gray-600 dark:text-gray-400',
      'Cancelled': 'text-gray-600 dark:text-gray-400',
      'Archived': 'text-purple-600 dark:text-purple-400'
    };

    const displayNames = {
      'Picked_Up': 'Picked Up',
      'late_pickup': 'Late Pickup',
      'No_Pickup': 'No Pickup'
    };

    return (
      <span className={`text-xs font-semibold ${badges[status] || badges['Pending']}`}>
        {displayNames[status] || status}
      </span>
    );
  };

  return (
    <div className={`rounded-2xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header with Back button */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
        <button
          onClick={onBack}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          Back to Items
        </button>
        {activeTab === 'archive' && (
          <button
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              isDark
                ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-700 disabled:text-gray-500'
                : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-200 disabled:text-gray-400'
            }`}
          >
            <i className="fa-solid fa-download"></i>
            Export Excel
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-1 p-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedRow(null);
                setSearch('');
              }}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? isDark
                    ? 'bg-green-600 text-white'
                    : 'bg-green-500 text-white'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-white/20'
                  : isDark
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <input
          type="search"
          placeholder="Search by item, farmer, or note..."
          className={`w-full px-4 py-2 rounded-lg border ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* Filters Row */}
        <div className="flex flex-wrap gap-2">
          <select
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Items</option>
            {uniqueItems.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Farmers</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {activeTab === 'archive' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="Rejected">Rejected</option>
              <option value="No_Pickup">No Pickup</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Archived">Archived</option>
            </select>
          )}
          
          {/* Clear filters button */}
          {(search || itemFilter !== 'all' || userFilter !== 'all' || dateFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={clearAllFilters}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Item
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Farmer
              </th>
              {activeTab === 'planted' ? (
                <>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Planting Date
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Harvest Date
                  </th>
                </>
              ) : (
                <>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Quantity
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Pickup Date
                  </th>
                </>
              )}
              {activeTab !== 'archive' && (
                <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {paginatedRequests.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-8 text-center text-gray-500">
                  {search ? 'No requests match your search' : `No ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} requests`}
                </td>
              </tr>
            ) : (
              paginatedRequests.map(request => (
                <React.Fragment key={request.id}>
                  <tr 
                    onClick={() => toggleRow(request.id)}
                    className={`${isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {request.itemName || 'Unknown Item'}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {request.requestorName || 'N/A'}
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {activeTab === 'planted'
                        ? (request.plantingReport?.dateOfPlanting ? formatDate(request.plantingReport.dateOfPlanting) : '—')
                        : request.quantity}
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {activeTab === 'planted' ? (
                        request.plantingReport?.dateOfExpectedHarvest
                          ? formatDate(request.plantingReport.dateOfExpectedHarvest)
                          : '—'
                      ) : (
                        <div>
                          {(() => {
                            const labels = getDateLabels(request);
                            const displayDate = request.actual_pickup || request.pickupDate;
                            
                            return (
                              <>
                                {formatDate(displayDate)}
                                {labels.pickupLabel && (
                                  <div className="text-green-600 dark:text-green-400 text-xs font-medium mt-0.5">
                                    {labels.pickupLabel}
                                  </div>
                                )}
                                {activeTab === 'pending' && isPickupOverdue(request) && !request.actual_pickup && (
                                  <div className="text-red-600 dark:text-red-400 text-xs font-medium mt-0.5">
                                    Approval overdue by {getDaysOverdue(request)} day{getDaysOverdue(request) !== 1 ? 's' : ''}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </td>
                    {activeTab !== 'archive' && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Pending tab actions */}
                          {activeTab === 'pending' && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleApprove(request); }}
                                className="p-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleReject(request); }}
                                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {/* Reserved tab actions */}
                          {activeTab === 'reserved' && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handlePickup(request); }}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                              >
                                Mark Pickup
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleNoPickup(request); }}
                                className="px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium transition-colors"
                                title="Mark as No Pickup"
                              >
                                No Pickup
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleCancel(request); }}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors"
                                title="Cancel Request"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          
                          {/* Planting tab actions */}
                          {activeTab === 'planting' && (
                            <>
                              {request.plantingReportId ? (
                                <>
                                  <button
                                    onClick={(e) => { 
                                      e.stopPropagation();
                                      // Open the report modal in view/edit mode
                                      setSelectedReportId(request.plantingReportId);
                                      setCurrentDistributionRequest(null);
                                      setIsReportModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors flex items-center gap-1"
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                    View Report
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={(e) => { 
                                    e.stopPropagation();
                                    // Open the report modal directly with distribution data for auto-fill
                                    setSelectedReportId(null);
                                    setCurrentDistributionRequest(request);
                                    setIsReportModalOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors flex items-center gap-1"
                                >
                                  <i className="fa-solid fa-plus"></i>
                                  Create Report
                                </button>
                              )}
                            </>
                          )}

                          {/* Planted tab actions */}
                          {activeTab === 'planted' && request.plantingReportId && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedReportId(request.plantingReportId);
                                  setCurrentDistributionRequest(null);
                                  setIsReportModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors flex items-center gap-1"
                              >
                                <i className="fa-solid fa-eye"></i>
                                View Report
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                  
                  {/* Expanded Details Row */}
                  {expandedRow === request.id && (
                    <tr className={`${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                      <td colSpan="6" className="px-6 py-6">
                        <div className="space-y-6">
                          {/* REQUEST INFORMATION SECTION */}
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                            <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                              <i className="fa-solid fa-file-lines"></i>
                              REQUEST INFORMATION
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Request ID:</span>
                                <p className={`font-mono ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>#{request.id}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Requested Quantity:</span>
                                <p className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{request.quantity}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Created:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{formatDate(request.createdAt)}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{formatDate(request.updatedAt)}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Scheduled Pickup:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{formatDate(request.pickupDate)}</p>
                              </div>
                              {request.requestNote && (
                                <div className="col-span-2 md:col-span-4">
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Farmer's Note:</span>
                                  <p className={`mt-1 px-3 py-2 rounded ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
                                    {request.requestNote}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* CURRENT STATUS & DATES SECTION */}
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                            <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                              <i className="fa-solid fa-calendar-check"></i>
                              CURRENT STATUS & DATES
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Status:</span>
                                <div className="mt-1">
                                  {getStatusBadge(request.status)}
                                </div>
                              </div>
                              {request.actual_pickup && (
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actual Pickup:</span>
                                  <p className={`text-green-600 dark:text-green-400 font-semibold`}>
                                    {formatDate(request.actual_pickup)}
                                  </p>
                                </div>
                              )}
                              {request.plantingReportSubmittedAt && (
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Report Submitted:</span>
                                  <p className={`text-green-600 dark:text-green-400 font-semibold`}>
                                    {formatDate(request.plantingReportSubmittedAt)}
                                  </p>
                                </div>
                              )}
                              {request.plantingReportArchivedAt && (
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Report Archived:</span>
                                  <p className={`text-purple-600 dark:text-purple-400 font-semibold`}>
                                    {formatDate(request.plantingReportArchivedAt)}
                                  </p>
                                </div>
                              )}
                              {activeTab === 'archive' && request.adminName && (
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Processed By:</span>
                                  <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.adminName}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* USER INFORMATION SECTION */}
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                            <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                              <i className="fa-solid fa-user"></i>
                              FARMER INFORMATION
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Name:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.requestorName || 'N/A'}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.requestorEmail || 'N/A'}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.requestorPhone || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* SEED INFORMATION SECTION */}
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                            <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                              <i className="fa-solid fa-seedling"></i>
                              SEED INFORMATION
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Seed Variety:</span>
                                <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{request.itemName}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Crop Type:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.seedCropType || 'N/A'}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Distributed Quantity:</span>
                                <p className={`font-bold text-green-600 dark:text-green-400`}>
                                  {request.quantity} {request.itemUnit || 'bags'}
                                </p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Stock:</span>
                                <p className={`font-bold ${request.currentStock <= 10 ? 'text-red-600 dark:text-red-400' : isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                  {request.currentStock || 0} {request.itemUnit || 'bags'}
                                </p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Planting Window:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.seedPlantingWindow || 30} days</p>
                              </div>
                              {request.seedDescription && (
                                <div className="col-span-2 md:col-span-4">
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Seed Description:</span>
                                  <p className={`mt-1 px-3 py-2 rounded ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
                                    {request.seedDescription}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* PLANTING INFORMATION SECTION */}
                          {(request.status === 'Picked_Up' || request.status === 'late_pickup' || request.status === 'Planted' || request.status === 'Archived') && (
                            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                              <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                                <i className="fa-solid fa-seedling"></i>
                                PLANTING INFORMATION
                              </h4>
                              
                              {request.plantingReportId ? (
                                // Show comprehensive planting report data when available
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  {/* Report Reference */}
                                  <div className="col-span-2">
                                    <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Planting Report:</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedReportId(request.plantingReportId);
                                        setIsReportModalOpen(true);
                                      }}
                                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-2"
                                    >
                                      View Full Report #{request.plantingReportId}
                                    </button>
                                  </div>

                                  {/* Farmer Information */}
                                  {request.plantingReport?.farmerName && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Farmer Name:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.farmerName}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {request.plantingReport?.rsbsaNumber && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>RSBSA Number:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.rsbsaNumber}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.farmLocation && (
                                    <div className="col-span-2">
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Farm Location:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.farmLocation}
                                      </p>
                                    </div>
                                  )}

                                  {/* Planting Details */}
                                  {request.plantingReport?.dateOfPlanting && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date of Planting:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {formatDate(request.plantingReport.dateOfPlanting)}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.areaPlanted && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Area Planted:</span>
                                      <p className={`font-medium ${isDark ? 'text-teal-300' : 'text-teal-600'}`}>
                                        {request.plantingReport.areaPlanted} hectares
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.plantingMethod && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Planting Method:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.plantingMethod}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.seedClassification && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Seed Classification:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.seedClassification}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.typeOfCrop && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Type of Crop:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.typeOfCrop}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.riceIrrigation && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rice Irrigation:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.riceIrrigation}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.cropInsurance !== undefined && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Crop Insurance:</span>
                                      <p className={`font-medium ${request.plantingReport.cropInsurance ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {request.plantingReport.cropInsurance ? 'Yes' : 'No'}
                                      </p>
                                    </div>
                                  )}

                                  {/* Harvest Information */}
                                  {(request.plantingReport?.harvestArea || request.plantingReport?.numberOfBags || request.plantingReport?.yieldMtPerHa) && (
                                    <div className="col-span-2 md:col-span-4">
                                      <hr className={`my-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                                      <h5 className={`text-xs font-bold mb-2 ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                                        HARVEST INFORMATION
                                      </h5>
                                    </div>
                                  )}

                                  {request.plantingReport?.dateOfExpectedHarvest && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expected Harvest Date:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {formatDate(request.plantingReport.dateOfExpectedHarvest)}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.harvestArea && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Harvest Area:</span>
                                      <p className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
                                        {request.plantingReport.harvestArea} hectares
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.numberOfBags && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Number of Bags:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.numberOfBags} bags
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.weightPerBag && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Weight per Bag:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingReport.weightPerBag} kg
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReport?.yieldMtPerHa && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Yield (MT/ha):</span>
                                      <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                                        {request.plantingReport.yieldMtPerHa} MT/ha
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                // Show planting report status when not yet submitted
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div className="col-span-2 md:col-span-4">
                                    <div className={`p-3 rounded-lg ${isDark ? 'bg-yellow-900/30 border border-yellow-700/50' : 'bg-yellow-50 border border-yellow-200'}`}>
                                      <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                                        <i className="fa-solid fa-clock"></i>
                                        <span className="font-medium">
                                          {request.status === 'Picked_Up' || request.status === 'late_pickup' 
                                            ? 'Planting report pending. Please submit report after planting.'
                                            : 'No planting report available for this distribution.'}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Farmer-provided details captured at request time */}
                                  {request.farmLocation && (
                                    <div className="col-span-2">
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Farm Location (from request):</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.farmLocation}
                                      </p>
                                    </div>
                                  )}

                                  {request.areaPlanted && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Area Planted (ha):</span>
                                      <p className={`font-medium ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                                        {request.areaPlanted}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingMethod && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Planting Method:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {request.plantingMethod}
                                      </p>
                                    </div>
                                  )}

                                  {request.plantingReportDeadline && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Report Deadline:</span>
                                      <p className={`font-medium ${
                                        new Date(request.plantingReportDeadline) < new Date()
                                          ? 'text-red-600 dark:text-red-400'
                                          : isDark ? 'text-gray-200' : 'text-gray-900'
                                      }`}>
                                        {formatDate(request.plantingReportDeadline)}
                                        {new Date(request.plantingReportDeadline) < new Date() && ' (Overdue)'}
                                      </p>
                                    </div>
                                  )}

                                  {request.pickedUpAt && (
                                    <div>
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Picked Up On:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        {formatDate(request.pickedUpAt)}
                                      </p>
                                    </div>
                                  )}

                                  {(request.status === 'Picked_Up' || request.status === 'late_pickup') && (
                                    <div className="col-span-2">
                                      <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expected Planting Window:</span>
                                      <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                        Within {request.seedPlantingWindow || 30} days from pickup
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* SYSTEM STATUS & ALERTS SECTION */}
                          {(() => {
                            const systemPrompt = getSystemPrompt(request);
                            if (!systemPrompt) return null;
                            
                            const colorClasses = {
                              success: 'bg-green-50 dark:bg-green-900/50 text-green-900 dark:text-green-100 border-green-200 dark:border-green-700',
                              info: 'bg-blue-50 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-700',
                              warning: 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-700',
                              error: 'bg-red-50 dark:bg-red-900/50 text-red-900 dark:text-red-100 border-red-200 dark:border-red-700'
                            };
                            
                            return (
                              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                                <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  <i className="fa-solid fa-robot"></i>
                                  SYSTEM STATUS & ALERTS
                                </h4>
                                <div className={`px-4 py-3 rounded-lg border ${colorClasses[systemPrompt.type]}`}>
                                  <div className="flex items-start gap-3">
                                    <i className={`fa-solid ${systemPrompt.icon} text-lg mt-0.5`}></i>
                                    <p className="flex-1 font-medium">
                                      {systemPrompt.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredRequests.length > 0 && (
        <div className={`flex items-center justify-between px-4 py-3 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Show
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              per page
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length}
            </span>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Previous
              </button>
              <span className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedReportId(null);
            setCurrentDistributionRequest(null);
          }}
          report={selectedRequest?.plantingReport || null}
          distributionRequest={currentDistributionRequest}
          onArchive={selectedRequest ? () => handleArchiveRequest(selectedRequest) : undefined}
          onSave={async (reportData) => {
            try {
              if (selectedReportId) {
                await updateReport(selectedReportId, reportData);
                toast.success('Report updated successfully');
              } else {
                await createReport(reportData);
                toast.success('Report created successfully');
              }
              setIsReportModalOpen(false);
              setSelectedReportId(null);
              setCurrentDistributionRequest(null);
              onRefresh();
            } catch (error) {
              console.error('Error saving report:', error);
              toast.error(error.message || 'Failed to save report');
            }
          }}
        />
      )}
    </div>
  );
}
