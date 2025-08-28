import React, { useState, useEffect } from 'react';
import { surveyFormsAPI } from './surveyFormsAPI';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsModal = ({ survey, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [showCreateChart, setShowCreateChart] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [error, setError] = useState(null);

  // Chart creation form state
  const [newChart, setNewChart] = useState({
    chartType: 'BAR',
    title: '',
    description: '',
    config: {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        backgroundColor: [],
        borderColor: [],
      }]
    }
  });

  useEffect(() => {
    if (isOpen && survey) {
      fetchData();
    }
  }, [isOpen, survey]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsData, statisticsData] = await Promise.all([
        surveyFormsAPI.getAnalytics(survey.id),
        surveyFormsAPI.getStatistics(survey.id)
      ]);
      
      setAnalytics(analyticsData.data);
      setStatistics(statisticsData.data.statistics);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChart = async () => {
    try {
      await surveyFormsAPI.createStatistic(survey.id, newChart);
      setShowCreateChart(false);
      setNewChart({
        chartType: 'BAR',
        title: '',
        description: '',
        config: {
          labels: [],
          datasets: [{
            label: '',
            data: [],
            backgroundColor: [],
            borderColor: [],
          }]
        }
      });
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteChart = async (statisticId) => {
    if (window.confirm('Are you sure you want to delete this chart?')) {
      try {
        await surveyFormsAPI.deleteStatistic(statisticId);
        fetchData(); // Refresh data
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const renderChart = (statistic) => {
    const chartProps = {
      data: statistic.config,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: statistic.title,
          },
        },
      },
    };

    switch (statistic.chartType) {
      case 'BAR':
        return <Bar {...chartProps} />;
      case 'LINE':
        return <Line {...chartProps} />;
      case 'PIE':
        return <Pie {...chartProps} />;
      case 'DOUGHNUT':
        return <Doughnut {...chartProps} />;
      default:
        return <Bar {...chartProps} />;
    }
  };

  const renderAnalyticsPreview = () => {
    if (!analytics) return null;

    return (
      <div className="space-y-6">
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-800 text-sm font-medium">Total Responses</div>
            <div className="text-blue-900 text-2xl font-bold">{analytics.overallAnalytics.totalResponses}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 text-sm font-medium">Total Fields</div>
            <div className="text-green-900 text-2xl font-bold">{analytics.overallAnalytics.totalFields}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-purple-800 text-sm font-medium">Completion Rate</div>
            <div className="text-purple-900 text-2xl font-bold">{analytics.overallAnalytics.completionRate}%</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-orange-800 text-sm font-medium">Active Fields</div>
            <div className="text-orange-900 text-2xl font-bold">{Object.keys(analytics.fieldAnalytics || {}).length}</div>
          </div>
        </div>

        {/* Field Analytics Preview */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Field Analytics Preview</h4>
          {Object.values(analytics.fieldAnalytics || {}).slice(0, 3).map((field) => (
            <div key={field.fieldInfo.id} className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{field.fieldInfo.label}</h5>
                <span className="text-sm text-gray-500">{field.totalResponses} responses</span>
              </div>
              
              {field.analytics.type === 'choice' && (
                <div className="space-y-1">
                  {field.analytics.chartData.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="text-gray-900 font-medium">{item.value} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              )}
              
              {field.analytics.type === 'numeric' && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Average:</span>
                    <span className="ml-1 font-medium">{field.analytics.average}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Min:</span>
                    <span className="ml-1 font-medium">{field.analytics.min}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max:</span>
                    <span className="ml-1 font-medium">{field.analytics.max}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span>📊</span>
              Statistics - {survey?.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Analytics and custom charts</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Loading statistics...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-red-800 font-medium">Error loading statistics</div>
              <div className="text-red-600 text-sm mt-1">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              {/* Analytics Preview */}
              {analytics && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Auto-Generated Analytics</h4>
                  </div>
                  {renderAnalyticsPreview()}
                </div>
              )}

              {/* Custom Charts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Custom Charts</h4>
                  <button
                    onClick={() => setShowCreateChart(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <span>➕</span>
                    Create Chart
                  </button>
                </div>

                {statistics.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-gray-400 text-3xl mb-2">📈</div>
                    <p className="text-gray-600 mb-2">No custom charts created yet</p>
                    <p className="text-sm text-gray-500">Create custom charts from your survey data</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {statistics.map((statistic) => (
                      <div key={statistic.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium text-gray-900">{statistic.title}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedChart(statistic)}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteChart(statistic.id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="h-64">
                          {renderChart(statistic)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Chart Modal */}
        {showCreateChart && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Chart</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                  <select
                    value={newChart.chartType}
                    onChange={(e) => setNewChart(prev => ({ ...prev, chartType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="BAR">Bar Chart</option>
                    <option value="LINE">Line Chart</option>
                    <option value="PIE">Pie Chart</option>
                    <option value="DOUGHNUT">Doughnut Chart</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newChart.title}
                    onChange={(e) => setNewChart(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter chart title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newChart.description}
                    onChange={(e) => setNewChart(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Enter chart description"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> After creating the chart, you'll be able to customize the data and labels using the survey response data. 
                    This allows you to create flexible analytics based on your specific needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateChart}
                  disabled={!newChart.title}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Chart
                </button>
                <button
                  onClick={() => setShowCreateChart(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsModal;
