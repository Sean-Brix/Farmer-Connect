import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronLeft, ChevronRight, Calendar, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Returned: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  late_return: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  No_Pickup: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
};

export default function RequestCalendar({ source = 'standalone' }) {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch schedule data
  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const params = new URLSearchParams({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
        type: typeFilter,
        status: statusFilter
      });

      const response = await fetch(`/api/schedule/calendar?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch schedule');

      const result = await response.json();
      setScheduleData(result.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [currentDate, typeFilter, statusFilter]);

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    // Trigger refetch after state update
    setTimeout(() => fetchScheduleData(), 0);
  };

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Get requests for a specific date
  const getRequestsForDate = (day) => {
    if (!day || !scheduleData) return null;
    
    const dateKey = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    
    return scheduleData.requestsByDate.find(d => d.date === dateKey);
  };

  // Handle date click
  const handleDateClick = (day) => {
    if (!day) return;
    
    const dateData = getRequestsForDate(day);
    if (dateData && dateData.total > 0) {
      setSelectedDate(dateData);
      setShowDetailsModal(true);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-7 h-7" />
            Pickup Schedule Calendar
          </h1>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Types</option>
            <option value="eic">EIC Only</option>
            <option value="distribution">Distribution Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Returned">Returned</option>
          </select>

          {scheduleData && (
            <div className="flex gap-4 ml-auto">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">EIC ({scheduleData.stats.eicTotal})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Distribution ({scheduleData.stats.distributionTotal})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={goToNextMonth}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className={`rounded-2xl overflow-hidden border shadow-sm ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        {/* Day names header */}
        <div className="grid grid-cols-7 border-b dark:border-gray-700">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center font-semibold text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {getCalendarDays().map((day, index) => {
            const dateData = day ? getRequestsForDate(day) : null;
            const isToday = day === new Date().getDate() && 
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`min-h-[100px] p-2 border-r border-b dark:border-gray-700 transition-colors ${
                  !day ? 'bg-white dark:bg-gray-800' : 'cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/30'
                } ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}>
                      {day}
                    </div>
                    
                    {dateData && (
                      <div className="space-y-1">
                        {dateData.eicCount > 0 && (
                          <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded shadow-sm font-medium">
                            {dateData.eicCount} EIC
                          </div>
                        )}
                        {dateData.distributionCount > 0 && (
                          <div className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded shadow-sm font-medium">
                            {dateData.distributionCount} Dist
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDate && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`max-w-3xl w-full max-h-[80vh] overflow-auto rounded-2xl shadow-xl p-6 ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="sticky top-0 bg-inherit px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Pickups for {new Date(selectedDate.date).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {selectedDate.requests.map((request) => (
                <div key={`${request.type}-${request.id}`} className={`p-4 rounded-2xl border shadow-sm ${
                  isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        request.type === 'EIC' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {request.type}
                      </span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${STATUS_COLORS[request.status]}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p><strong>User:</strong> {request.userName}</p>
                    <p><strong>Item:</strong> {request.itemName} ({request.quantity}x)</p>
                    <p><strong>Category:</strong> {request.itemCategory}</p>
                    {request.userContact && (
                      <p><strong>Contact:</strong> {request.userContact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
