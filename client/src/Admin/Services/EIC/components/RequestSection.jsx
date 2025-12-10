import React, { useState, useMemo, useCallback } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import default_image from '../../../../Assets/eic_default.png';
import ArchiveStatistics from './ArchiveStatistics.jsx';
import { RequestTableSkeleton } from './SkeletonLoaders.jsx';
import RequestStatusBadge from '../../../../Client/Services/EIC/components/RequestStatusBadge.jsx';

// Helper function to determine smart date labels
const getDateLabels = (request) => {
  const pickupAdjusted = request.actual_pickup && 
    new Date(request.actual_pickup).getTime() !== new Date(request.pickupDate).getTime();
  const returnAdjusted = request.adjustedReturnDate && 
    new Date(request.adjustedReturnDate).getTime() !== new Date(request.returnDate).getTime();
  
  // If neither adjusted, return null (no labels needed)
  if (!pickupAdjusted && !returnAdjusted) {
    return { 
      pickupLabel: null, 
      returnLabel: null,
      pickupAdjusted: false,
      returnAdjusted: false
    };
  }
  
  // If one adjusted, show "(adjusted)" on adjusted date, "(on time)" on other for height consistency
  return {
    pickupLabel: pickupAdjusted ? '(adjusted)' : (returnAdjusted ? '(on time)' : null),
    returnLabel: returnAdjusted ? '(adjusted)' : (pickupAdjusted ? '(on time)' : null),
    pickupAdjusted,
    returnAdjusted
  };
};

// Helper function to generate system status prompts
const getSystemPrompt = (request) => {
  const now = new Date();
  const pickupDate = new Date(request.pickupDate);
  const returnDate = new Date(request.adjustedReturnDate || request.returnDate);
  
  const daysDiff = (date1, date2) => Math.ceil((date1 - date2) / (1000 * 60 * 60 * 24));
  const hoursDiff = (date1, date2) => Math.ceil((date1 - date2) / (1000 * 60 * 60));
  
  switch(request.status) {
    case 'Pending':
      const daysWaiting = daysDiff(now, new Date(request.createdAt));
      const pickupIn = daysDiff(pickupDate, now);
      if (pickupIn < 0) {
        return {
          type: 'warning',
          icon: 'fa-exclamation-triangle',
          message: `Request has been pending for ${daysWaiting} day${daysWaiting !== 1 ? 's' : ''}. Pickup date has passed by ${Math.abs(pickupIn)} day${Math.abs(pickupIn) !== 1 ? 's' : ''}. Requires immediate admin action.`
        };
      } else if (pickupIn <= 2) {
        return {
          type: 'warning',
          icon: 'fa-clock',
          message: `Pickup date is in ${pickupIn} day${pickupIn !== 1 ? 's' : ''}. Waiting for admin approval/rejection for ${daysWaiting} day${daysWaiting !== 1 ? 's' : ''}.`
        };
      }
      return {
        type: 'info',
        icon: 'fa-hourglass-half',
        message: `Waiting for admin action for ${daysWaiting} day${daysWaiting !== 1 ? 's' : ''}. Pickup scheduled in ${pickupIn} day${pickupIn !== 1 ? 's' : ''}.`
      };
      
    case 'Approved':
      const pickupDue = daysDiff(pickupDate, now);
      if (pickupDue < 0) {
        return {
          type: 'error',
          icon: 'fa-exclamation-circle',
          message: `Pickup is overdue by ${Math.abs(pickupDue)} day${Math.abs(pickupDue) !== 1 ? 's' : ''}. Will auto-transition to "late_pickup" if not picked up.`
        };
      } else if (pickupDue === 0) {
        const hoursLeft = hoursDiff(pickupDate, now);
        return {
          type: 'warning',
          icon: 'fa-clock',
          message: `Pickup is TODAY (${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''} remaining). User needs to collect item.`
        };
      }
      return {
        type: 'success',
        icon: 'fa-calendar-check',
        message: `Ready for pickup in ${pickupDue} day${pickupDue !== 1 ? 's' : ''}. User has been notified.`
      };
      
    case 'Borrowed':
    case 'late_pickup':
      const returnDue = daysDiff(returnDate, now);
      if (returnDue < 0) {
        return {
          type: 'error',
          icon: 'fa-exclamation-triangle',
          message: `Return is overdue by ${Math.abs(returnDue)} day${Math.abs(returnDue) !== 1 ? 's' : ''}. Will auto-transition to "late_return" if not returned soon.`
        };
      } else if (returnDue <= 3) {
        return {
          type: 'warning',
          icon: 'fa-bell',
          message: `Return due in ${returnDue} day${returnDue !== 1 ? 's' : ''}. Consider sending reminder to user.`
        };
      }
      return {
        type: 'info',
        icon: 'fa-hand-holding',
        message: `Item is with user. Return scheduled in ${returnDue} day${returnDue !== 1 ? 's' : ''}.${request.status === 'late_pickup' ? ' (Pickup was late)' : ''}`
      };
      
    case 'late_return':
      const overdueDays = Math.abs(daysDiff(returnDate, now));
      return {
        type: 'error',
        icon: 'fa-exclamation-circle',
        message: `Item return is ${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue. Follow up with user immediately. Stock not restored until returned.`
      };
      
    default:
      return null;
  }
};

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
      borrowed: requests.filter(req => 
        ['Borrowed', 'late_pickup'].includes(req.status) // Items currently with users (exclude late_return - it's archived)
      ),
      archive: requests.filter(req => 
        ['Rejected', 'No_Return', 'No_Pickup', 'Cancelled', 'Returned', 'late_return'].includes(req.status)
      )
    };
    
    // Calculate breakdown for borrowed tab
    const borrowedBreakdown = result.borrowed.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {});
    
    // TEST 2.1: Borrowed Tab Display
    console.log(`
${'='.repeat(60)}
📋 TEST 2.1: BORROWED TAB DISPLAY
${'='.repeat(60)}
Total requests: ${requests.length}
Borrowed tab count: ${result.borrowed.length}
Borrowed status breakdown:
  - Borrowed: ${borrowedBreakdown['Borrowed'] || 0}
  - late_pickup: ${borrowedBreakdown['late_pickup'] || 0}
Borrowed IDs: ${result.borrowed.map(r => r.id).join(', ')}
Request tab count: ${result.request.length}
Reserved tab count: ${result.reserved.length}
Archive tab count: ${result.archive.length}
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST 2.1
${'='.repeat(60)}
`);
    
    // TEST 2.2: Archive Tab Display
    console.log(`
${'='.repeat(60)}
📋 TEST 2.2: ARCHIVE TAB DISPLAY
${'='.repeat(60)}
Total requests: ${requests.length}
Archive tab count: ${result.archive.length}
Archive status breakdown:
${JSON.stringify(result.archive.reduce((acc, req) => {
  acc[req.status] = (acc[req.status] || 0) + 1;
  return acc;
}, {}), null, 2)}
Archive IDs: ${result.archive.map(r => r.id).join(', ')}
Expected statuses: Rejected, Returned, late_return, No_Return, No_Pickup, Cancelled
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST 2.2
${'='.repeat(60)}
`);
    
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
    // TEST 1.2: Admin Dashboard Data Fetching
    console.log(`
${'='.repeat(60)}
📋 TEST 1.2: ADMIN DASHBOARD DATA FETCHING
${'='.repeat(60)}
Active tab: ${activeTab}
Total requests: ${requests.length}
Filtered requests: ${filteredRequests.length}
Current page: ${currentPage}
Items per page: ${itemsPerPage}
Filters applied: search=${search}, itemFilter=${itemFilter}, userFilter=${userFilter}
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST 1.2
${'='.repeat(60)}
`);
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
      
      // Smart detection: Check if pickup is late
      const now = new Date();
      const pickupDate = new Date(request.pickupDate);
      const isLate = now > pickupDate;
      const status = isLate ? 'late_pickup' : 'Borrowed';
      const returnDate = request.returnDate ? new Date(request.returnDate) : null;
      
      const testNum = isLate ? '3.2' : '3.1';
      console.log(`\n${'='.repeat(60)}\n📋 TEST ${testNum}: ADMIN PICKUP ACTION (${isLate ? 'LATE' : 'ON-TIME'})\n${'='.repeat(60)}\nRequest ID: ${request.id}\nItem: ${itemName}\nUser: ${requestorName}\nScheduled Pickup: ${pickupDate.toLocaleString()}\nCurrent Time: ${now.toLocaleString()}\nIs Late: ${isLate ? 'YES' : 'NO'}\nStatus Will Be: ${status}\nQuantity: ${requestQuantity}\nCurrent Stock: ${currentStock}\nStock After: ${currentStock - requestQuantity}\nReturn Date: ${returnDate ? returnDate.toLocaleString() : 'N/A'}\n${'='.repeat(60)}\n`);
      
      const success = await onStatusChange(request.id, status, itemName, requestorName, requestQuantity, currentStock);
      
      if (success) {
        console.log(`✅ RESULT: Admin Pickup Success - ${status}\n${'='.repeat(60)}\n✅ COPY THIS LOG TO CHECKLIST TEST ${testNum}\n${'='.repeat(60)}\n`);
        onRefresh?.();
      } else {
        console.log(`❌ RESULT: Admin Pickup Failed\n${'='.repeat(60)}\n`);
      }
    } catch (error) {
      console.error('❌ Error in handlePickup:', error);
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
      
      // TEST 4.1/4.2: Smart return detection (logged on server)
      const now = new Date();
      const dueDate = request.adjustedReturnDate ? new Date(request.adjustedReturnDate) : (request.returnDate ? new Date(request.returnDate) : null);
      const isLate = dueDate && now > dueDate;
      const testNum = isLate ? '4.2' : '4.1';
      
      console.log(`
${'='.repeat(60)}
📋 TEST ${testNum}: ADMIN RETURN ACTION (${isLate ? 'LATE' : 'ON-TIME'})
${'='.repeat(60)}
Request ID: ${request.id}
Item: ${itemName}
User: ${requestorName}
Current Status: ${request.status}
Due Date: ${dueDate ? dueDate.toLocaleString() : 'N/A'}${request.adjustedReturnDate ? ' (Adjusted)' : ''}
Current Time: ${now.toLocaleString()}
Is Late: ${isLate ? 'YES' : 'NO'}
Expected Status: ${isLate ? 'late_return' : 'Returned'}
Quantity: ${requestQuantity}
Current Stock: ${currentStock}
Stock After: ${currentStock + requestQuantity}
${'='.repeat(60)}
`);
      
      const success = await onStatusChange(request.id, 'Returned', itemName, requestorName, requestQuantity, currentStock, requestNote);
      
      if (success) {
        console.log(`✅ RESULT: Admin Return Success\n${'='.repeat(60)}\n✅ COPY THIS LOG TO CHECKLIST TEST ${testNum}\n${'='.repeat(60)}\n`);
        onRefresh?.();
      } else {
        console.log(`❌ RESULT: Admin Return Failed\n${'='.repeat(60)}\n`);
      }
    } catch (error) {
      console.error('❌ Error in handleMarkReturned:', error);
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
    const returnDate = new Date(request.adjustedReturnDate || request.returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > returnDate && request.status === 'Borrowed';
  };

  // Check if item is overdue for pickup in Reserved tab
  const isPickupOverdueReserved = (request) => {
    if (!request.pickupDate) return false;
    const pickupDate = new Date(request.pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return pickupDate < today && !request.actual_pickup;
  };

  // Calculate days overdue for pickup in Reserved tab
  const getDaysOverdueReserved = (request) => {
    if (!request.pickupDate) return 0;
    const pickupDate = new Date(request.pickupDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today - pickupDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
                        {/* Display latest pickup date (actual_pickup > pickupDate) */}
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
                              {activeTab === 'request' && isPickupOverdue(request) && !request.actual_pickup && (
                                <div className="text-red-600 dark:text-red-400 text-xs font-medium mt-0.5">
                                  Approval overdue by {getDaysOverdue(request)} day{getDaysOverdue(request) !== 1 ? 's' : ''}
                                </div>
                              )}
                              {activeTab === 'reserved' && (() => {
                                if (isPickupOverdueReserved(request)) {
                                  return (
                                    <div className="text-red-600 dark:text-red-400 text-xs font-medium mt-0.5">
                                      Pickup overdue by {getDaysOverdueReserved(request)} day{getDaysOverdueReserved(request) !== 1 ? 's' : ''}
                                    </div>
                                  );
                                }
                                
                                // Check if pickup is due today
                                if (request.pickupDate && !request.actual_pickup) {
                                  const pickupDate = new Date(request.pickupDate);
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  pickupDate.setHours(0, 0, 0, 0);
                                  
                                  if (pickupDate.getTime() === today.getTime()) {
                                    return (
                                      <div className="text-yellow-600 dark:text-yellow-400 text-xs font-medium mt-0.5">
                                        Pickup due today
                                      </div>
                                    );
                                  }
                                }
                                
                                return null;
                              })()}
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {/* Display latest return date (actual_return > adjustedReturnDate > returnDate) */}
                      {(() => {
                        const labels = getDateLabels(request);
                        const displayDate = request.actual_return || request.adjustedReturnDate || request.returnDate;
                        
                        return (
                          <>
                            {formatDate(displayDate)}
                            {labels.returnLabel && (
                              <div className="text-green-600 dark:text-green-400 text-xs font-medium mt-0.5">
                                {labels.returnLabel}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </td>
                    {activeTab === 'borrowed' && (
                      <td className="px-4 py-3">
                        {(() => {
                          const returnDate = new Date(request.adjustedReturnDate || request.returnDate);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          returnDate.setHours(0, 0, 0, 0);
                          
                          // Check if overdue (return date has passed)
                          if (today > returnDate) {
                            return (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-black border-2 border-red-400">
                                <Clock className="w-3 h-3 mr-1" />
                                Overdue
                              </span>
                            );
                          }
                          
                          // Check if due today
                          if (returnDate.getTime() === today.getTime()) {
                            return (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-black border-2 border-yellow-400">
                                <Clock className="w-3 h-3 mr-1" />
                                Due Today
                              </span>
                            );
                          }
                          
                          // Otherwise with user
                          return (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-black border-2 border-blue-400">
                              With User
                            </span>
                          );
                        })()}
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
                      <td colSpan={activeTab === 'archive' ? "6" : "7"} className="px-6 py-6">
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
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Requested Pickup:</span>
                                <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                  {formatDate(request.pickupDate)}
                                  <span className="text-xs text-gray-500 ml-1">(Original)</span>
                                </p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Requested Return:</span>
                                <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                  {formatDate(request.returnDate)}
                                  <span className="text-xs text-gray-500 ml-1">(Original)</span>
                                </p>
                              </div>
                              {request.requestNote && (
                                <div className="col-span-2 md:col-span-4">
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>User's Note:</span>
                                  <p className={`mt-1 px-3 py-2 rounded ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
                                    {request.requestNote}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* CURRENT STATUS SECTION */}
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                            <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                              <i className="fa-solid fa-calendar-check"></i>
                              CURRENT STATUS & DATES
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Status:</span>
                                <div className="mt-1">
                                  <RequestStatusBadge status={request.status} size="sm" />
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
                              {request.adjustedReturnDate && (() => {
                                const wasAdjusted = new Date(request.adjustedReturnDate).getTime() !== new Date(request.returnDate).getTime();
                                const wasLate = request.actual_return && new Date(request.actual_return) > new Date(request.returnDate);
                                const label = wasAdjusted ? 'Adjusted Return:' : (wasLate ? 'Late Return:' : 'Return Date:');
                                
                                return (
                                  <div>
                                    <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
                                    <p className={`${wasLate && !wasAdjusted ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'} font-semibold`}>
                                      {formatDate(request.adjustedReturnDate)}
                                    </p>
                                  </div>
                                );
                              })()}
                              {request.actual_return && (
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actual Return:</span>
                                  <p className={`text-green-600 dark:text-green-400 font-semibold`}>
                                    {formatDate(request.actual_return)}
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
                              USER INFORMATION
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Name:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.userName || 'N/A'}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Username:</span>
                                <p className={`font-mono ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{request.userUsername || 'N/A'}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                                <p className={`${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{request.userEmail || 'N/A'}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.userPhone || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* ITEM INFORMATION SECTION */}
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                            <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                              <i className="fa-solid fa-box"></i>
                              ITEM INFORMATION
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Item Name:</span>
                                <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{request.itemName}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Category:</span>
                                <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.itemCategory || 'N/A'}</p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Current Stock:</span>
                                <p className={`font-bold ${request.currentStock <= 10 ? 'text-red-600' : isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                  {request.currentStock || 0}
                                </p>
                              </div>
                              <div>
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Reserved Stock:</span>
                                <p className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                  {request.reservedQuantity || 0}
                                </p>
                              </div>
                              {request.itemDateLimit && (
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Max Borrow Period:</span>
                                  <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>{request.itemDateLimit} days</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* SYSTEM STATUS & PROMPTS SECTION */}
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

                          {/* ADMIN NOTES & SYSTEM LOGS SECTION */}
                          {(activeTab === 'archive' && request.statusChangeReason) && (
                            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                              <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                <i className="fa-solid fa-clipboard-list"></i>
                                ADMIN NOTES & SYSTEM LOGS
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {request.status === 'Rejected' ? 'Rejection Reason:' : 
                                     request.status === 'No_Return' ? 'No Return Reason:' :
                                     request.status === 'No_Pickup' ? 'No Pickup Reason:' :
                                     request.status === 'Cancelled' ? 'Cancellation Reason:' :
                                     'Status Change Reason:'}
                                  </span>
                                  <p className={`mt-2 px-4 py-3 rounded-lg ${
                                    request.status === 'Rejected' 
                                      ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                                      : request.status === 'No_Return'
                                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                                      : request.status === 'No_Pickup'
                                      ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
                                      : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                                  }`}>
                                    {request.statusChangeReason}
                                  </p>
                                </div>
                              </div>
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


