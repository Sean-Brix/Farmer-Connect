import React from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';

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
  const { theme, isDark } = useTheme();
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading crop guidelines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className={isDark ? 'text-red-400 mb-2' : 'text-red-500 mb-2'}>⚠️ Failed to load guidelines</div>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{error.message}</p>
      </div>
    );
  }

  if (!guidelines || guidelines.length === 0) {
    return (
      <div className={`text-center py-12 rounded-lg border-2 border-dashed ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
        <div className="text-6xl mb-4">🌱</div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>No Guidelines Found</h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Create your first crop guideline to get started</p>
      </div>
    );
  }

  const getCategoryInfo = (category) => {
    return CATEGORY_OPTIONS.find(cat => cat.value === category) || { icon: '🌱', label: category };
  };

  return (
    <div className={`rounded-lg border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Crop Name
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Growing Period
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Stages
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Difficulty
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Profitability
              </th>
              <th className={`px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
            {guidelines.map((guideline) => {
              const categoryInfo = getCategoryInfo(guideline.category);
              
              return (
                <tr 
                  key={guideline.id} 
                  className={`transition-colors duration-150 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  {/* Crop Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                        <span className="text-xl">{categoryInfo.icon}</span>
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {guideline.name}
                        </div>
                        {guideline.varieties && guideline.varieties.length > 0 && (
                          <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {guideline.varieties.slice(0, 2).join(', ')}
                            {guideline.varieties.length > 2 && ` +${guideline.varieties.length - 2}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {categoryInfo.label}
                    </span>
                  </td>

                  {/* Growing Period */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {guideline.growingPeriod || 'N/A'}
                    </div>
                  </td>

                  {/* Stages */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`}>
                        {guideline.stages?.length || 0}
                      </span>
                      {guideline.stages && guideline.stages.length > 0 && (
                        <div className={`text-xs max-w-[150px] truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`} title={guideline.stages.map(s => s.stageName).join(', ')}>
                          {guideline.stages[0].stageName}
                          {guideline.stages.length > 1 && ` +${guideline.stages.length - 1}`}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      guideline.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      guideline.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                      guideline.difficulty === 'Moderate_High' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {guideline.difficulty?.replace('_', ' ') || 'N/A'}
                    </span>
                  </td>

                  {/* Profitability */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {guideline.profitability?.replace('_', ' ') || 'N/A'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetails(guideline)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/30' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}`}
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit(guideline)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/30' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                        title="Edit Guideline"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(guideline)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
                        title="Delete Guideline"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
