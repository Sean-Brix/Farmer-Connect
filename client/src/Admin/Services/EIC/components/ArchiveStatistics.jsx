import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import axios from 'axios';
import { TrendingUp, TrendingDown, Archive, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ArchiveStatistics() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded && !stats && !loading) {
      fetchStatistics();
    }
  }, [isExpanded]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/eic/request/statistics');
      setStats(response.data.statistics);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-xl shadow-sm mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Collapsible Header */}
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded && !stats) {
            fetchStatistics();
          }
        }}
        className={`w-full p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between hover:${isDark ? 'bg-gray-750' : 'bg-gray-50'} transition-colors`}
      >
        <div className="flex items-center gap-2">
          <Archive className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Archive Statistics
          </h3>
          {stats && !isExpanded && (
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              ({stats.total} items)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && stats && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                fetchStatistics();
              }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <i className="fa-solid fa-rotate-right mr-2"></i>
              Refresh
            </span>
          )}
          <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} ${isDark ? 'text-gray-400' : 'text-gray-600'}`}></i>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-4">{error}</p>
          ) : stats ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Total Archived */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Archived</p>
                      <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {stats.total}
                      </p>
                    </div>
                    <Archive className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                {/* Late Return Rate */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-orange-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Late Return Rate</p>
                      <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {(stats.lateReturnRate * 100).toFixed(1)}%
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-orange-500" />
                  </div>
                </div>

                {/* No Pickup Rate */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-yellow-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No Pickup Rate</p>
                      <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {(stats.noPickupRate * 100).toFixed(1)}%
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>

                {/* Avg Days Overdue */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Days Overdue</p>
                      <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {stats.avgDaysOverdue}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-red-500" />
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div>
                <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Breakdown by Status
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {Object.entries(stats.byStatus).map(([status, count]) => {
                    const statusConfig = {
                      Returned: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10', label: 'Returned' },
                      Rejected: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10', label: 'Rejected' },
                      No_Return: { icon: AlertTriangle, color: 'text-purple-500', bgColor: 'bg-purple-500/10', label: 'No Return' },
                      No_Pickup: { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', label: 'No Pickup' },
                      Cancelled: { icon: XCircle, color: 'text-gray-500', bgColor: 'bg-gray-500/10', label: 'Cancelled' },
                      late_return: { icon: TrendingDown, color: 'text-orange-500', bgColor: 'bg-orange-500/10', label: 'Late Return' }
                    };
                    const config = statusConfig[status];
                    if (!config) return null;
                    const Icon = config.icon;
                    
                    return (
                      <div
                        key={status}
                        className={`rounded-lg p-3 ${config.bgColor} border ${
                          isDark ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 ${config.color}`} />
                          <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {count}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {stats.total > 0 ? `${((count / stats.total) * 100).toFixed(1)}%` : '0%'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              {stats.recentActivity && (
                <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stats.recentActivity.last30Days}
                    </span>
                    {' '}items archived in the last 30 days
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
