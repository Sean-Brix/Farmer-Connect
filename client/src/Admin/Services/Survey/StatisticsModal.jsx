import React, { useState, useEffect } from 'react';
import { surveyFormsAPI } from './surveyFormsAPI';

const StatisticsModal = ({ survey, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && survey) {
      fetchData();
    }
  }, [isOpen, survey]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const analyticsData = await surveyFormsAPI.getAnalytics(survey.id);
      setAnalytics(analyticsData.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
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
          <h4 className="text-lg font-semibold text-gray-900">Field Analytics</h4>
          {Object.values(analytics.fieldAnalytics || {}).map((field) => (
            <div key={field.fieldInfo.id} className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{field.fieldInfo.label}</h5>
                <span className="text-sm text-gray-500">{field.totalResponses} responses</span>
              </div>
              
              {field.analytics.type === 'choice' && (
                <div className="space-y-1">
                  {field.analytics.chartData.map((item, index) => (
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
            <p className="text-sm text-gray-600 mt-1">Survey analytics and response statistics</p>
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

          {!loading && !error && analytics && renderAnalyticsPreview()}
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;
