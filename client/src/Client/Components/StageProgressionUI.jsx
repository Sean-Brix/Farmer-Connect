import React, { useState, useEffect } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

/**
 * Stage Progression UI Component - NEW VERSION
 * Integrated with stage-based reporting system
 * Shows pending reports, report status, and submission deadlines
 */
export default function StageProgressionUI({ 
  crop, 
  theme = 'light',
  onSubmitReport,
  onMessageAdmin
}) {
  const { t } = useCustomTranslation();
  const [stageInfo, setStageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!crop?.id) return;

    const fetchStageInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/seed-track/crops/${crop.id}/stage-info`);
        if (!response.ok) {
          throw new Error('Failed to fetch stage information');
        }
        const data = await response.json();
        if (data.success && data.stageInfo) {
          setStageInfo(data.stageInfo);
        }
      } catch (err) {
        console.error('Error fetching stage info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStageInfo();
    
    // Refresh stage info every 30 seconds
    const interval = setInterval(fetchStageInfo, 30000);
    return () => clearInterval(interval);
  }, [crop?.id]);

  if (loading && !stageInfo) {
    return (
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (error || !stageInfo) {
    return (
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <p className={`text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error || t('messages.no_data')}
        </p>
      </div>
    );
  }

  const { 
    currentStageName, 
    currentStageIndex, 
    totalStages, 
    daysRemaining,
    currentStageStartDate,
    currentStageEndDate,
    currentStageDetails,
    pendingReports = [],
    allStages = []
  } = stageInfo;

  const isCompleted = currentStageIndex >= totalStages;

  const getStageIcon = (status) => {
    if (status === 'completed') return '✅';
    if (status === 'current') return '🌟';
    if (status === 'pending') return '📋';
    if (status === 'late') return '⚠️';
    if (status === 'next') return '🔓';
    return '🔒';
  };

  const getStageColor = (status) => {
    if (status === 'completed') return theme === 'dark' ? 'bg-green-900 border-green-500' : 'bg-green-50 border-green-400';
    if (status === 'current') return theme === 'dark' ? 'bg-blue-900 border-blue-400' : 'bg-blue-50 border-blue-400';
    if (status === 'pending') return theme === 'dark' ? 'bg-yellow-900 border-yellow-500' : 'bg-yellow-50 border-yellow-400';
    if (status === 'late') return theme === 'dark' ? 'bg-red-900 border-red-500' : 'bg-red-50 border-red-400';
    if (status === 'next') return theme === 'dark' ? 'bg-yellow-900 border-yellow-500' : 'bg-yellow-50 border-yellow-400';
    return theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300';
  };

  // Calculate stage progress for current stage
  const currentStageProgress = !isCompleted && currentStageStartDate && currentStageEndDate ? (() => {
    const today = new Date();
    const startDate = new Date(currentStageStartDate);
    const endDate = new Date(currentStageEndDate);
    const totalDuration = endDate - startDate;
    const elapsedDuration = today - startDate;
    return Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
  })() : 0;

  return (
    <div className="space-y-6">
      {/* Completion Banner */}
      {isCompleted && (
        <div className={`rounded-xl border-2 p-6 text-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-400' 
            : 'bg-gradient-to-br from-green-50 to-green-100 border-green-400'
        }`}>
          <div className="text-6xl mb-4">🎉</div>
          <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('stage_progression.completed')}
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
            {t('survey.all_surveys_completed')}
          </p>
        </div>
      )}

      {/* Pending Reports Alert - Quick Summary */}
      {pendingReports.length > 0 && (
        <div className={`rounded-xl border-2 p-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-yellow-900 to-yellow-800 border-yellow-400' 
            : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400'
        }`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl">📋</div>
            <div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {pendingReports.length} {t('status.pending')} {t('navigation.farmer_reports')}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
                {t('survey.answer_all_questions')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Previous Submitted Reports */}
      {(() => {
        const submittedReports = allStages.filter(stage => 
          stage.hasReport && stage.reportStatus && stage.reportStatus !== 'Pending'
        );
        
        if (submittedReports.length === 0) return null;

        return (
          <div className={`rounded-xl border-2 p-6 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-400' 
              : 'bg-gradient-to-br from-green-50 to-green-100 border-green-400'
          }`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">📊</div>
              <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t('navigation.farmer_reports')} ({submittedReports.length})
              </h3>
                <div className="space-y-2">
                  {submittedReports.map((stage) => {
                    const isLate = stage.reportStatus === 'Late';
                    return (
                      <div 
                        key={stage.index}
                        className={`p-3 rounded-lg border ${
                          theme === 'dark' 
                            ? isLate ? 'bg-orange-900/30 border-orange-500' : 'bg-green-900/30 border-green-500'
                            : isLate ? 'bg-orange-50 border-orange-400' : 'bg-green-50 border-green-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {stage.name} Report
                              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                isLate 
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-green-500 text-white'
                              }`}>
                                {stage.reportStatus}
                              </span>
                            </div>
                            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Submitted: {stage.reportSubmittedAt ? new Date(stage.reportSubmittedAt).toLocaleDateString() : 'N/A'}
                              {stage.reportDueDate && ` • Due: ${new Date(stage.reportDueDate).toLocaleDateString()}`}
                            </div>
                          </div>
                          <div className={`text-2xl ${isLate ? '⚠️' : '✅'}`}>
                            {isLate ? '⚠️' : '✅'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Current Stage Highlight */}
      {!isCompleted && currentStageDetails && (
        <div className={`rounded-xl border-2 p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-400' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400'
        }`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                theme === 'dark' ? 'bg-blue-700' : 'bg-blue-200'
              }`}>
                🌟
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t('stage_progression.current_stage')}: {currentStageName}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {t('stage_progression.stage')} {currentStageIndex + 1} {t('pagination.of')} {totalStages}
                </span>
              </div>
              {currentStageDetails.description && (
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                  {currentStageDetails.description}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Duration: </span>
                  <span className={theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}>{currentStageDetails.duration}</span>
                </div>
                <div>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Expected End: </span>
                  <span className={theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}>
                    {new Date(currentStageEndDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>{t('stage_progression.progress')}</span>
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>{Math.round(currentStageProgress)}%</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-blue-950' : 'bg-blue-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                    style={{ width: `${currentStageProgress}%` }}
                  />
                </div>
              </div>

              {/* Key Activities */}
              {currentStageDetails.activities && Array.isArray(currentStageDetails.activities) && currentStageDetails.activities.length > 0 && (
                <div className="mb-4">
                  <h4 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                    📝 Key Activities:
                  </h4>
                  <ul className="space-y-1">
                    {currentStageDetails.activities.slice(0, 3).map((activity, idx) => (
                      <li key={idx} className={`text-sm flex items-start gap-2 ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
                        <span className="text-green-500 flex-shrink-0">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stage Status Message */}
              {daysRemaining > 0 && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-600 text-blue-200' 
                    : 'bg-blue-50 border-blue-400 text-blue-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏳</span>
                    <div className="text-sm">
                      <div className="font-semibold">{t('status.in_progress')} - {daysRemaining} {t('stage_progression.days_remaining')}</div>
                      <div className="text-xs opacity-80">{t('survey.answer_all_questions')}</div>
                    </div>
                  </div>
                </div>
              )}

              {daysRemaining <= 0 && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-green-900/30 border-green-600 text-green-200' 
                    : 'bg-green-50 border-green-400 text-green-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <div className="text-sm">
                      <div className="font-semibold">{t('stage_progression.completed')}</div>
                      <div className="text-xs opacity-80">{t('survey.complete_required_fields')}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Admin Button */}
              {onMessageAdmin && (
                <button
                  onClick={() => onMessageAdmin(crop)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  💬 {t('chat.title')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All Stages Timeline */}
      {allStages.length > 0 && (
        <div className={`rounded-xl border p-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Growth Journey - All Stages
          </h3>
          
          <div className="space-y-4">
            {allStages.map((stage, index) => {
              const hasReport = stage.hasReport;
              const reportStatus = stage.reportStatus;
              const isCurrent = index === currentStageIndex;
              const isNext = index === currentStageIndex + 1;
              const isLocked = index > currentStageIndex;
              
              let status = 'locked';
              if (hasReport && reportStatus === 'Submitted') status = 'completed';
              else if (reportStatus === 'Pending') status = 'pending';
              else if (reportStatus === 'Late') status = 'late';
              else if (isCurrent) status = 'current';
              else if (isNext) status = 'next';

              return (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < allStages.length - 1 && (
                    <div className={`absolute left-8 top-16 w-0.5 h-8 ${
                      hasReport && reportStatus === 'Submitted'
                        ? 'bg-green-400' 
                        : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                    }`} />
                  )}
                  
                  {/* Stage Card */}
                  <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } ${isCurrent ? 'shadow-lg scale-105 border-blue-400' : ''}`}>
                    <div className="flex items-start gap-4">
                      {/* Stage Number Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 ${
                        isCurrent 
                          ? 'bg-blue-500 border-blue-600 text-white animate-pulse' 
                          : theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-gray-300' 
                            : 'bg-gray-100 border-gray-300 text-gray-700'
                      }`}>
                        {isLocked ? '🔒' : index + 1}
                      </div>

                      {/* Stage Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className={`font-bold text-base ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {stage.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-lg" title="Active Stage">🌟</span>
                          )}
                          {reportStatus === 'Submitted' && (
                            <span className="text-lg" title="Report Submitted">✅</span>
                          )}
                          {reportStatus === 'Pending' && (
                            <span className="text-lg" title="Report Pending">📋</span>
                          )}
                          {reportStatus === 'Late' && (
                            <span className="text-lg" title="Report Overdue">⚠️</span>
                          )}
                        </div>

                        {!isLocked && (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                              <div>
                                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Duration: 
                                </span>
                                <span className={`ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                                  {stage.duration}
                                </span>
                              </div>
                              {stage.reportDueDate && (reportStatus === 'Pending' || reportStatus === 'Late') && (
                                <div>
                                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Report Due: 
                                  </span>
                                  <span className={`ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                                    {new Date(stage.reportDueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {stage.reportSubmittedAt && reportStatus === 'Submitted' && (
                                <div>
                                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Submitted: 
                                  </span>
                                  <span className={`ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                                    {new Date(stage.reportSubmittedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Stage Progress Bar (only for current stage) */}
                            {isCurrent && (
                              <div className="mt-2">
                                <div className={`h-2 rounded-full overflow-hidden ${
                                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                }`}>
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                                    style={{ width: `${currentStageProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Submit Report Button (for pending/late reports) */}
                            {(reportStatus === 'Pending' || reportStatus === 'Late') && onSubmitReport && (
                              <button
                                onClick={() => onSubmitReport(crop, index)}
                                className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                                  reportStatus === 'Late'
                                    ? theme === 'dark'
                                      ? 'bg-red-600 hover:bg-red-500 text-white'
                                      : 'bg-red-600 hover:bg-red-700 text-white'
                                    : theme === 'dark'
                                      ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                }`}
                              >
                                📝 Submit {stage.name} Report {reportStatus === 'Late' && '(OVERDUE)'}
                              </button>
                            )}
                          </>
                        )}

                        {isLocked && (
                          <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Complete previous stages to unlock
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overall Progress Stats */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
        <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          📈 {t('stage_progression.progress')}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
            <div className="text-2xl font-bold text-green-600">
              {allStages.filter(s => s.reportStatus === 'Submitted').length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>{t('status.completed')}</div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-50'}`}>
            <div className="text-2xl font-bold text-yellow-600">
              {allStages.filter(s => s.reportStatus === 'Pending' || s.reportStatus === 'Late').length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-700'}`}>{t('status.pending')}</div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {allStages.filter(s => !s.hasReport).length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('seminar.upcoming')}</div>
          </div>
        </div>

        {/* Overall completion percentage */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{t('stage_progression.progress')}</span>
            <span className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
              {Math.round((allStages.filter(s => s.reportStatus === 'Submitted').length / totalStages) * 100)}%
            </span>
          </div>
          <div className={`h-4 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(allStages.filter(s => s.reportStatus === 'Submitted').length / totalStages) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
