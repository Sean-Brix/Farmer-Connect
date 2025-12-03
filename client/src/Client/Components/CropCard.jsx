import React from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

/**
 * Crop Card Component for Active and Archived Crops
 * Displays crop information in a card format
 */
export default function CropCard({ crop, theme, onViewDetails, weatherData, isArchived = false }) {
  const { t } = useCustomTranslation();
  const calculateProgress = () => {
    if (!crop.plantingDate || !crop.expectedHarvest) return 0;
    const planted = new Date(crop.plantingDate);
    const expected = new Date(crop.expectedHarvest);
    const today = new Date();
    const total = expected - planted;
    const elapsed = today - planted;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const progress = calculateProgress();
  const statusColor = crop.status === 'Active' ? 'green' : crop.status === 'Harvested' ? 'blue' : 'red';

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700 hover:border-green-500' 
        : 'bg-white border-gray-200 hover:border-green-400'
    }`}>
      {/* Card Header */}
      <div className={`px-6 py-4 border-b ${
        isArchived 
          ? theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
          : theme === 'dark' ? 'bg-gradient-to-r from-green-900 to-green-800 border-gray-700' : 'bg-gradient-to-r from-green-50 to-green-100 border-gray-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{crop.guideline ? '🌾' : '🌱'}</span>
              <div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {crop.cropType}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {crop.variety}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              statusColor === 'green' ? 'bg-green-500 text-white' :
              statusColor === 'blue' ? 'bg-blue-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {crop.status}
            </span>
            {crop.guideline && (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
              }`}>
                📚 Guideline
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('crop_card.planting_date')}
            </p>
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {new Date(crop.plantingDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('crop_card.planting_date').replace('Planting', 'Expected Harvest')}
            </p>
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {new Date(crop.expectedHarvest).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('form.address').replace('Address', 'Area Planted')}
            </p>
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {crop.area} hectares
            </p>
          </div>
          <div>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('form.address').replace('Address', 'Expected Yield')}
            </p>
            <p className={`text-sm font-bold text-green-600`}>
              {crop.expectedYield} kg
            </p>
          </div>
        </div>

        {/* Progress Bar - Only for Active Crops */}
        {!isArchived && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('stage_progression.progress')}
              </span>
              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Current Stage */}
        <div className="mb-4">
          <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
            {t('stage_progression.current_stage')}
          </p>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
            }`}>
              {crop.currentStage}
            </span>
            {crop.guideline && crop.currentStageIndex !== undefined && (
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Level {(crop.currentStageIndex || 0) + 1} of {crop.guideline.stages?.length || 0}
              </span>
            )}
          </div>
        </div>

        {/* Weather Info - Only for Active Crops */}
        {!isArchived && weatherData?.current && (
          <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'} mb-2`}>
              🌤️ {t('common.info').replace('Information', 'Current Weather')}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-900'}>
                {Math.round(weatherData.current.temperature_2m)}°C
              </span>
              <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-900'}>
                {weatherData.current.relative_humidity_2m}% Humidity
              </span>
              <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-900'}>
                {Math.round(weatherData.current.wind_speed_10m)} km/h
              </span>
            </div>
          </div>
        )}

        {/* Reports Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Reports Submitted:
            </span>
            <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {crop.reports?.length || 0}
            </span>
          </div>
          {crop.reports && crop.reports.length > 0 && (
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Last: {new Date(crop.reports[crop.reports.length - 1].reportDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(crop)}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${
            isArchived
              ? theme === 'dark' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isArchived ? `📂 ${t('crop_card.view_details')}` : `📊 ${t('crop_card.view_details')}`}
        </button>
      </div>
    </div>
  );
}
