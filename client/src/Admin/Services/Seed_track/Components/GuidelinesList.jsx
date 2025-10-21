import React from 'react';

const CATEGORY_OPTIONS = [
  { value: 'Cereals', label: 'Cereals', icon: '🌾' },
  { value: 'Vegetables', label: 'Vegetables', icon: '🥬' },
  { value: 'Fruits', label: 'Fruits', icon: '🍎' },
  { value: 'Legumes', label: 'Legumes', icon: '🫘' },
  { value: 'Root_Crops', label: 'Root Crops', icon: '🥔' },
  { value: 'Herbs_Spices', label: 'Herbs & Spices', icon: '🌿' },
];

export default function GuidelinesList({ 
  guidelines, 
  isLoading, 
  error, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) {
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading crop guidelines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">⚠️ Failed to load guidelines</div>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (!guidelines || guidelines.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Guidelines Found</h3>
        <p className="text-gray-600">Create your first crop guideline to get started</p>
      </div>
    );
  }

  const getCategoryInfo = (category) => {
    return CATEGORY_OPTIONS.find(cat => cat.value === category) || { icon: '🌱', label: category };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {guidelines.map((guideline) => {
        const categoryInfo = getCategoryInfo(guideline.category);
        
        return (
          <div 
            key={guideline.id} 
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <span className="text-2xl">{categoryInfo.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {guideline.name}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium inline-block mt-1">
                      {categoryInfo.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => onEdit(guideline)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Edit Guideline"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(guideline)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete Guideline"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Card Body - Scrollable */}
            <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
              {/* Key Information */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Growing Period:</span>
                  <span className="font-semibold text-gray-800">{guideline.growingPeriod || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Expected Yield:</span>
                  <span className="font-semibold text-gray-800">{guideline.expectedYield || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`font-semibold ${
                    guideline.difficulty === 'Easy' ? 'text-green-600' :
                    guideline.difficulty === 'Moderate' ? 'text-yellow-600' :
                    guideline.difficulty === 'Moderate_High' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {guideline.difficulty?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Profitability:</span>
                  <span className="font-semibold text-blue-600">
                    {guideline.profitability?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Stages Count */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth Stages:</span>
                  <span className="text-lg font-bold text-green-600">
                    {guideline.stages?.length || 0}
                  </span>
                </div>
                {guideline.stages && guideline.stages.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {guideline.stages.slice(0, 3).map((stage, idx) => (
                      <div key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                          {idx + 1}
                        </span>
                        <span className="truncate">{stage.stageName}</span>
                        <span className="text-gray-400">({stage.duration})</span>
                      </div>
                    ))}
                    {guideline.stages.length > 3 && (
                      <div className="text-xs text-gray-500 pl-7">
                        +{guideline.stages.length - 3} more stages
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Varieties */}
              {guideline.varieties && guideline.varieties.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Varieties ({guideline.varieties.length}):</div>
                  <div className="flex flex-wrap gap-1">
                    {guideline.varieties.slice(0, 4).map((variety, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs truncate"
                        style={{ maxWidth: '120px' }}
                      >
                        {variety}
                      </span>
                    ))}
                    {guideline.varieties.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{guideline.varieties.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Crops Using This Guideline */}
              {guideline._count && guideline._count.registeredCrops > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Used by {guideline._count.registeredCrops} registered crop(s)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="p-4 pt-0">
              <button
                onClick={() => onViewDetails(guideline)}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
              >
                📖 View Full Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
