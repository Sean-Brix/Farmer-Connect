import React, { useState, useMemo, useCallback } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import default_image from '../../../../Assets/eic_default.png';
import ArchiveStatistics from './ArchiveStatistics.jsx';
import { RequestTableSkeleton } from './SkeletonLoaders.jsx';

export default function RequestSection({ requests = [], onStatusChange, onRefresh, onBack, onOpenSettings, isLoading = false }) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('request'); // request, reserved, onhold, archive
  const [expandedRow, setExpandedRow] = useState(null);
  const [search, setSearch] = useState('');
  const [itemFilter, setItemFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Enhanced filters for Phase 4
  const [overdueFilter, setOverdueFilter] = useState('all'); // all, overdue, on-time
  const [quantityMin, setQuantityMin] = useState('');
  const [quantityMax, setQuantityMax] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [overdueDurationFilter, setOverdueDurationFilter] = useState('all'); // all, 0-3, 3-7, 7-30, 30+
  const [processingAdminFilter, setProcessingAdminFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Categorize requests by status
  const categorizedRequests = useMemo(() => {
    const result = {
      request: requests.filter(req => req.status === 'Pending'),
      reserved: requests.filter(req => req.status === 'Approved'),
      borrowed: requests.filter(req => req.status === 'late_return'), // Items overdue but still with user
      archive: requests.filter(req => 
        ['Rejected', 'No_Return', 'No_Pickup', 'Cancelled', 'Returned'].includes(req.status)
      )
    };
    
    // Debug logging for Archive tab
    console.log('📊 Archive categorization:', {
      totalRequests: requests.length,
      archiveCount: result.archive.length,
      archiveStatuses: result.archive.reduce((acc, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      }, {}),
      archiveIds: result.archive.map(r => r.id)
    });
    
    return result;
  }, [requests]);

  // Apply search filter
  const filteredRequests = useMemo(() => {
    let filtered = categorizedRequests[activeTab] || [];
    
    // Search filter - API returns itemName and requestorName directly
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(req =>
        req.itemName?.toLowerCase().includes(searchLower) ||
        req.requestorName?.toLowerCase().includes(searchLower) ||
        req.requestNote?.toLowerCase().includes(searchLower) ||
        (activeTab === 'archive' && req.statusChangeReason?.toLowerCase().includes(searchLower))
      );
    }

    // Item filter - API returns itemName directly
    if (itemFilter !== 'all') {
      filtered = filtered.filter(req => req.itemName === itemFilter);
    }

    // User filter - API returns requestorName directly
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
    
    // PHASE 4: Enhanced Filters
    
    // Overdue filter (Request and Reserved tabs)
    if ((activeTab === 'request' || activeTab === 'reserved') && overdueFilter !== 'all') {
      filtered = filtered.filter(req => {
        const isOverdue = isPickupOverdue(req);
        return overdueFilter === 'overdue' ? isOverdue : !isOverdue;
      });
    }
    
    // Quantity range filter
    if (quantityMin) {
      const min = parseInt(quantityMin);
      filtered = filtered.filter(req => (req.quantity || 0) >= min);
    }
    if (quantityMax) {
      const max = parseInt(quantityMax);
      filtered = filtered.filter(req => (req.quantity || 0) <= max);
    }
    
    // Date range filter
    if (dateRangeStart) {
      const start = new Date(dateRangeStart);
      filtered = filtered.filter(req => new Date(req.createdAt) >= start);
    }
    if (dateRangeEnd) {
      const end = new Date(dateRangeEnd);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(req => new Date(req.createdAt) <= end);
    }
    
    // Overdue duration filter (Reserved and Borrowed tabs)
    if ((activeTab === 'reserved' || activeTab === 'borrowed') && overdueDurationFilter !== 'all') {
      filtered = filtered.filter(req => {
        const daysOverdue = getDaysOverdue(req);
        if (overdueDurationFilter === '0-3') return daysOverdue >= 0 && daysOverdue <= 3;
        if (overdueDurationFilter === '3-7') return daysOverdue > 3 && daysOverdue <= 7;
        if (overdueDurationFilter === '7-30') return daysOverdue > 7 && daysOverdue <= 30;
        if (overdueDurationFilter === '30+') return daysOverdue > 30;
        return true;
      });
    }
    
    // Processing admin filter (Archive tab)
    if (activeTab === 'archive' && processingAdminFilter !== 'all') {
      filtered = filtered.filter(req => req.adminName === processingAdminFilter);
    }
    
    return filtered;
  }, [categorizedRequests, activeTab, search, itemFilter, userFilter, dateFilter, statusFilter, 
      overdueFilter, quantityMin, quantityMax, dateRangeStart, dateRangeEnd, overdueDurationFilter, processingAdminFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage, itemsPerPage]);

  // Reset to page 1 when filters or tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, itemFilter, userFilter, dateFilter, statusFilter, overdueFilter, quantityMin, quantityMax, dateRangeStart, dateRangeEnd, overdueDurationFilter, processingAdminFilter]);

  // Memoized action handlers for better performance
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
      
      const success = await onStatusChange(request.id, 'late_return', itemName, requestorName, requestQuantity, currentStock);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to mark as picked up');
    }
  }, [onStatusChange, onRefresh]);

  const handleMarkNoReturn = useCallback(async (request) => {
    try {
      const itemName = request.itemName || 'Unknown Item';
      const requestorName = request.requestorName || 'Unknown User';
      const requestQuantity = request.requestQuantity || request.quantity || 0;
      const currentStock = request.currentStock || 0;
      const requestNote = request.requestNote || null;
      
      const success = await onStatusChange(request.id, 'No_Return', itemName, requestorName, requestQuantity, currentStock, requestNote);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to mark as returned');
    }
  }, [onStatusChange, onRefresh]);

  const handleNoReturn = useCallback(async (request) => {
    try {
      const itemName = request.itemName || 'Unknown Item';
      const requestorName = request.requestorName || 'Unknown User';
      const requestQuantity = request.requestQuantity || request.quantity || 0;
      const currentStock = request.currentStock || 0;
      
      const success = await onStatusChange(request.id, 'No_Return', itemName, requestorName, requestQuantity, currentStock);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to mark as no return');
    }
  }, [onStatusChange, onRefresh]);

  const handleMarkReturned = useCallback(async (request) => {
    try {
      const itemName = request.itemName || 'Unknown Item';
      const requestorName = request.requestorName || 'Unknown User';
      const requestQuantity = request.requestQuantity || request.quantity || 0;
      const currentStock = request.currentStock || 0;
      const requestNote = request.requestNote || null;
      
      const success = await onStatusChange(request.id, 'Returned', itemName, requestorName, requestQuantity, currentStock, requestNote);
      
      if (success) {
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to mark as returned');
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

  // Check if item is overdue (past return date and still with user)
  const isOverdue = (request) => {
    if (!request.returnDate) return false;
    const returnDate = new Date(request.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > returnDate && (request.status === 'Returned' || request.status === 'late_return');
  };

  const tabs = [
    { id: 'request', label: 'Request', count: categorizedRequests.request.length },
    { id: 'reserved', label: 'Reserved', count: categorizedRequests.reserved.length },
    { id: 'borrowed', label: 'Borrowed', count: categorizedRequests.borrowed.length },
    { id: 'archive', label: 'Archive', count: categorizedRequests.archive.length }
  ];

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

  // Get unique items and users for filters - API returns itemName and requestorName directly
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
  
  // Get unique processing admins for Archive tab filter
  const uniqueAdmins = useMemo(() => {
    const admins = new Set();
    requests.filter(req => ['Rejected', 'No_Return', 'No_Pickup', 'Cancelled', 'Returned'].includes(req.status))
      .forEach(req => {
        if (req.adminName) admins.add(req.adminName);
      });
    return Array.from(admins).sort();
  }, [requests]);
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setItemFilter('all');
    setUserFilter('all');
    setDateFilter('all');
    setStatusFilter('all');
    setOverdueFilter('all');
    setQuantityMin('');
    setQuantityMax('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setOverdueDurationFilter('all');
    setProcessingAdminFilter('all');
  };

  const handleExportArchive = () => {
    // Build query parameters from current filters
    const params = new URLSearchParams();
    
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (userFilter !== 'all') params.append('userId', userFilter);
    if (itemFilter !== 'all') params.append('itemId', itemFilter);
    if (processingAdminFilter !== 'all') params.append('adminId', processingAdminFilter);
    if (dateRangeStart) params.append('dateFrom', dateRangeStart);
    if (dateRangeEnd) params.append('dateTo', dateRangeEnd);

    // Open download URL
    const url = `/api/eic/request/export?${params.toString()}`;
    window.open(url, '_blank');
    
    toast.success('Exporting Excel file with monthly sheets...');
  };

  return (
    <div className={`rounded-2xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header with Back and Settings buttons */}
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
        <div className="flex items-center gap-2">
          {activeTab === 'archive' && (
            <button
              onClick={handleExportArchive}
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
          <button
            onClick={onOpenSettings}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all flex items-center gap-2 disabled:bg-gray-700 disabled:text-gray-500"
          >
            <i className="fa-solid fa-gear"></i>
            Settings
          </button>
        </div>
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

      {/* Archive Statistics - Only show on archive tab */}
      {activeTab === 'archive' && <ArchiveStatistics />}

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <input
          type="search"
          placeholder="Search by item, user, or note..."
          className={`w-full px-4 py-2 rounded-lg border ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* Enhanced Filters - Single Row */}
        <div className="flex flex-wrap gap-2">
          {/* Basic Filters */}
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
            <option value="all">All Users</option>
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
              <option value="Returned">Returned</option>
              <option value="Rejected">Rejected</option>
              <option value="No_Return">No Return</option>
              <option value="No_Pickup">No Pickup</option>
              <option value="late_return">Late Return</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          )}
          
          {/* Enhanced Filters (Phase 4) - Overdue filter for Request and Reserved tabs */}
          {(activeTab === 'request' || activeTab === 'reserved') && (
            <select
              value={overdueFilter}
              onChange={(e) => setOverdueFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="overdue">Overdue Only</option>
              <option value="on-time">On-time Only</option>
            </select>
          )}
          
          {/* Quantity range for Request tab */}
          {activeTab === 'request' && (
            <>
              <input
                type="number"
                placeholder="Min qty"
                min="0"
                value={quantityMin}
                onChange={(e) => setQuantityMin(e.target.value)}
                className={`w-24 px-3 py-1.5 rounded-lg border text-sm ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <input
                type="number"
                placeholder="Max qty"
                min="0"
                value={quantityMax}
                onChange={(e) => setQuantityMax(e.target.value)}
                className={`w-24 px-3 py-1.5 rounded-lg border text-sm ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </>
          )}
            
          {/* Overdue duration for Reserved and Borrowed tabs */}
          {(activeTab === 'reserved' || activeTab === 'borrowed') && (
            <select
              value={overdueDurationFilter}
              onChange={(e) => setOverdueDurationFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Durations</option>
              <option value="0-3">0-3 days overdue</option>
              <option value="3-7">3-7 days overdue</option>
              <option value="7-30">7-30 days overdue</option>
              <option value="30+">30+ days overdue</option>
            </select>
          )}
          
          {/* Processing admin for Archive tab */}
          {activeTab === 'archive' && uniqueAdmins.length > 0 && (
            <select
              value={processingAdminFilter}
              onChange={(e) => setProcessingAdminFilter(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Admins</option>
              {uniqueAdmins.map(admin => (
                <option key={admin} value={admin}>{admin}</option>
              ))}
            </select>
          )}
          
          {/* Date range picker */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRangeStart}
              onChange={(e) => setDateRangeStart(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>to</span>
            <input
              type="date"
              value={dateRangeEnd}
              onChange={(e) => setDateRangeEnd(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          {/* Clear filters button */}
          {(search || itemFilter !== 'all' || userFilter !== 'all' || dateFilter !== 'all' || 
            statusFilter !== 'all' || overdueFilter !== 'all' || quantityMin || quantityMax || 
            dateRangeStart || dateRangeEnd || overdueDurationFilter !== 'all' || processingAdminFilter !== 'all') && (
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

      {/* Loading State */}
      {isLoading ? (
        <div className="p-6">
          <RequestTableSkeleton />
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Item
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Requestor
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Quantity
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Pickup Date
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Return Date
              </th>
              {activeTab === 'borrowed' && (
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </th>
              )}
              {activeTab === 'archive' && (
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </th>
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
                <td colSpan={activeTab === 'archive' ? "6" : "7"} className="px-4 py-8 text-center text-gray-500">
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
                      {request.quantity}
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div>
                        {formatDate(request.pickupDate)}
                        {(activeTab === 'request' || activeTab === 'reserved') && isPickupOverdue(request) && (
                          <div className="text-red-600 dark:text-red-400 text-xs font-medium mt-0.5">
                            Overdue by {getDaysOverdue(request)} day{getDaysOverdue(request) !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatDate(request.returnDate)}
                    </td>
                    {activeTab === 'borrowed' && (
                      <td className="px-4 py-3">
                        {isOverdue(request) ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <Clock className="w-3 h-3 mr-1" />
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            With User
                          </span>
                        )}
                      </td>
                    )}
                    {activeTab === 'archive' && (
                      <td className="px-4 py-3">
                        <span className={`font-medium ${
                          request.status === 'Returned' ? 'text-green-600 dark:text-green-400' :
                          request.status === 'Rejected' ? 'text-red-600 dark:text-red-400' :
                          request.status === 'No_Return' ? 'text-orange-600 dark:text-orange-400' :
                          request.status === 'No_Pickup' ? 'text-yellow-600 dark:text-yellow-400' :
                          request.status === 'late_return' ? 'text-purple-600 dark:text-purple-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </td>
                    )}
                    {activeTab !== 'archive' && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Request tab actions */}
                          {activeTab === 'request' && (
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
                              Mark Picked Up
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleNoPickup(request); }}
                              className="px-3 py-1.5 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium transition-colors"
                              title="Mark as No Pickup"
                            >
                              No Pickup
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancel(request); }}
                              className="px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium transition-colors"
                              title="Cancel Request"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        
                        {/* Borrowed tab actions - items are with users */}
                        {activeTab === 'borrowed' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleNoReturn(request); }}
                              className={`px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors ${
                                isOverdue(request) 
                                  ? 'bg-red-600 hover:bg-red-700' 
                                  : 'bg-orange-600 hover:bg-orange-700'
                              }`}
                              title="Mark as not returned"
                            >
                              No Return
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMarkReturned(request); }}
                              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors"
                              title="Mark as successfully returned"
                            >
                              Returned
                            </button>
                          </>
                        )}
                        
                        {/* Removed manual actions for On Hold */}
                        {/* These will auto-transition based on return deadline */}
                      </div>
                    </td>
                    )}
                  </tr>
                  
                  {/* Expanded Details Row */}
                  {expandedRow === request.id && (
                    <tr className={`${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                      <td colSpan={activeTab === 'archive' ? "6" : "7"} className="px-4 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Request ID:
                            </span>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                              #{request.id}
                            </p>
                          </div>
                          <div>
                            <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Created At:
                            </span>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                          <div>
                            <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Available Stock:
                            </span>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                              {request.currentStock || 0}
                            </p>
                          </div>
                          
                          {/* Archive-specific details */}
                          {activeTab === 'archive' && (
                            <>
                              {request.updatedAt && (
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Status Changed:
                                  </span>
                                  <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                    {formatDate(request.updatedAt)}
                                  </p>
                                </div>
                              )}
                              {request.adminName && (
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Processed By:
                                  </span>
                                  <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                    {request.adminName}
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                          
                          {request.actual_pickup && (
                            <div>
                              <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Actual Pickup:
                              </span>
                              <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                {formatDate(request.actual_pickup)}
                              </p>
                            </div>
                          )}
                          {request.actual_return && (
                            <div>
                              <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Actual Return:
                              </span>
                              <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                {formatDate(request.actual_return)}
                              </p>
                            </div>
                          )}
                          
                          {/* User's request note */}
                          {request.requestNote && (
                            <div className="col-span-2 md:col-span-3">
                              <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Request Note:
                              </span>
                              <p className={`mt-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                {request.requestNote}
                              </p>
                            </div>
                          )}
                          
                          {/* Admin's status change reason (for archive) */}
                          {activeTab === 'archive' && request.statusChangeReason && (
                            <div className="col-span-2 md:col-span-3">
                              <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {request.status === 'Rejected' ? 'Rejection Reason:' : 
                                 request.status === 'No_Return' ? 'No Return Reason:' :
                                 request.status === 'No_Pickup' ? 'No Pickup Reason:' :
                                 request.status === 'Cancelled' ? 'Cancellation Reason:' :
                                 'Status Change Reason:'}
                              </span>
                              <p className={`mt-1 px-3 py-2 rounded-lg ${
                                request.status === 'Rejected' 
                                  ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                                  : request.status === 'No_Return'
                                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
                                  : request.status === 'No_Pickup'
                                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                                  : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                              }`}>
                                {request.statusChangeReason}
                              </p>
                            </div>
                          )}
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
        </>
      )}
    </div>
  );
}


